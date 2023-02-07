import { parseErrors } from '@total-typescript/error-translation-engine';

export default function init(modules: { typescript: typeof import("typescript/lib/tsserverlibrary") }) {
  const ts = modules.typescript;

  function withParsedError(messageText: string): string {
    const parsed = parseErrors(messageText);
    const allMessages = parsed.map(err => err.error).join('\n\n');
    return `${messageText}\n\nIn other words,\n${allMessages}\n`;
  }

  function enrichDiagnostic(diagnostic: ts.Diagnostic): ts.Diagnostic {
    if (typeof diagnostic.messageText === 'string') {
      diagnostic.messageText = withParsedError(diagnostic.messageText);
      return diagnostic;
    }
    if (diagnostic.messageText.category === ts.DiagnosticCategory.Error) {
      const msg = withParsedError(diagnostic.messageText.messageText);
      diagnostic.messageText.messageText = msg;

      const nextMesgs = diagnostic.messageText.next;
      if (nextMesgs) {
        for (let i = 0; i < nextMesgs.length; i++) {
          let nextMsg = nextMesgs[i];
          nextMesgs[i].messageText = withParsedError(nextMsg.messageText);
        }
      }
    }
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

// export = init;