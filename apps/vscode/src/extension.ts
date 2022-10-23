import { getTipsFromFile, Tip } from '@ts-error-messages/parser';
import * as vscode from 'vscode';
import { initDiagnostics } from './initDiagnostics';

const languages = [
  'typescript',
  'typescriptreact',
  'javascript',
  'javascriptreact',
];

const tipInfo: Record<
  Tip['type'],
  {
    message: string;
    name: string;
  }
> = {
  'function-return-type': {
    name: 'Function return type',
    message: `This is a function return type. It tells the function what type it should return.`,
  },
  'interface-declaration': {
    name: 'Interface declaration',
    message: `This is an interface declaration. It's like a type alias, but it can be extended.`,
  },
  'optional-object-property': {
    name: 'Optional Object Property',
    message: `The question mark next to this object property means that it's optional - it doesn't need to be specified on this object.`,
  },
  'readonly-object-property': {
    name: 'Readonly Object Property',
    message: `The readonly keyword means that this property can't be changed after it's been set.`,
  },
  'type-alias-declaration': {
    name: 'Type Keyword',
    message: `This is a type alias. It's like an interface, but it can't be extended - and it can represent things that interfaces can't.`,
  },
  'variable-type-annotation': {
    name: 'Variable type annotation',
    message: `This annotation tells the variable what type it should be.`,
  },
  'conditional-type': {
    name: 'Conditional type',
    message: `This is a conditional type. It's a kind of if-else logic in TypeScript, but at the type level.`,
  },
  'nested-conditional-type': {
    name: 'Nested conditional type',
    message: `Conditional types can be nested in TypeScript!`,
  },
};

const tips = Object.keys(tipInfo);

export const getRangeFromSourceLocation = (location: {
  start: {
    line: number;
    column: number;
  };
  end: {
    line: number;
    column: number;
  };
}): vscode.Range => {
  return new vscode.Range(
    new vscode.Position(location.start.line - 1, location.start.column),
    new vscode.Position(location.end.line - 1, location.end.column),
  );
};

export function activate(context: vscode.ExtensionContext) {
  initDiagnostics(context);

  const helperDiagnostics =
    vscode.languages.createDiagnosticCollection('helpers');
  const uriStore: Record<string, Array<Tip & { range: vscode.Range }>> = {};

  tips.forEach((tip) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        `ts-error-translator.dont-show-again.${tip}`,
        async () => {
          const config = vscode.workspace.getConfiguration(
            `tsErrorTranslator.dontShowAgain`,
          );
          vscode.window.showInformationMessage(`${tip} won't be shown again!`);
          await config.update(
            tip.replace(new RegExp('-', 'g'), ''),
            true,
            vscode.ConfigurationTarget.Global,
          );
        },
      ),
    );
  });

  const updateDiagnostics = async (document: vscode.TextDocument) => {
    try {
      const tips = getTipsFromFile(document.getText());

      uriStore[document.uri.path] = tips.map((tip) => ({
        ...tip,
        range: getRangeFromSourceLocation(tip.loc),
      }));
    } catch (e) {}

    helperDiagnostics.set(
      document.uri,
      uriStore[document.uri.path].map((tip) => {
        const diagnostic = new vscode.Diagnostic(
          tip.range,
          tipInfo[tip.type].message,
          vscode.DiagnosticSeverity.Information,
        );
        diagnostic.code = {
          value: tip.type,
          target: vscode.Uri.parse(`https://ts-error-messages.com/${tip.type}`),
        };
        diagnostic.source = 'total-typescript';
        return diagnostic;
      }),
    );
  };

  if (vscode.window.activeTextEditor) {
    updateDiagnostics(vscode.window.activeTextEditor.document);
  }

  context.subscriptions.push(
    vscode.workspace.onDidChangeTextDocument((e) => {
      updateDiagnostics(e.document);
    }),
  );

  const hoverProvider: vscode.HoverProvider = {
    provideHover: (document, position) => {
      const itemsInUriStore = uriStore[document.uri.path];

      if (!itemsInUriStore) {
        return null;
      }

      const items = itemsInUriStore.filter((item) => {
        return item.range.contains(position);
      });

      const contents = items.map((itemInRange) => {
        const thisTip = tipInfo[itemInRange.type];
        const mdString = new vscode.MarkdownString(
          `**${thisTip.name}**\n\n${thisTip.message}\n\n[Learn More](TODO) | [Don't Show Again](command:ts-error-translator.dont-show-again.${itemInRange.type})`,
        );
        mdString.isTrusted = true;
        mdString.supportHtml = true;

        return mdString;
      });
      return {
        contents,
      };
    },
  };

  context.subscriptions.push(
    ...languages.map((language) => {
      return vscode.languages.registerHoverProvider(
        {
          language,
        },
        hoverProvider,
      );
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
