function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary") }) {
  const ts = modules.typescript;

  function enrichDiagnostic(diagnostic: ts.Diagnostic): ts.Diagnostic {
    // diagnostic.code: number
    // diagnostic.category === ts.DiagnosticCategory (Error, Message, Suggestion, Warning)
    diagnostic.messageText = `${diagnostic.messageText}\n\nHello from plugin!\n`
    return diagnostic;
  }

  function create(info: ts.server.PluginCreateInfo) {
    // Set up decorator object
    const proxy: ts.LanguageService = Object.create(null);

    for (let k of Object.keys(info.languageService) as Array<keyof ts.LanguageService>) {
      const x = info.languageService[k]!;
      // @ts-expect-error - JS runtime trickery which is tricky to type tersely
      proxy[k] = (...args: Array<{}>) => x.apply(info.languageService, args);
    }

    proxy.getSemanticDiagnostics = (filename) => {
      return info.languageService.getSemanticDiagnostics(filename).map(enrichDiagnostic);
    }

    return proxy;
  }

  return { create };

}

export = init;