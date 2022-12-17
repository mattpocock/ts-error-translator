import {
  getTipsFromFile,
  Tip,
  tipInfo,
  TipType,
} from '@total-typescript/tips-parser';
import * as vscode from 'vscode';
import { defaultOptions } from './defaultOptions';
import { initDiagnostics } from './initDiagnostics';

const languages = [
  'typescript',
  'typescriptreact',
  'javascript',
  'javascriptreact',
];

let options = defaultOptions;

const updateOptions = () => {
  options = {
    ...defaultOptions,
    ...vscode.workspace.getConfiguration('totalTypeScript'),
  };
};

const tipHasNoDepsOrAllDepsCompleted = (tip: Tip) => {
  const tipInfoItem = tipInfo[tip.type];

  if (!tipInfoItem) {
    return false;
  }

  // Tip has no deps
  if (!tipInfoItem.deps) {
    return true;
  }

  const deps = Array.isArray(tipInfoItem.deps)
    ? tipInfoItem.deps
    : [tipInfoItem.deps];

  return deps.every((dep) => {
    return isTipComplete(dep);
  });
};

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
let ignoredTips = new Set<string>(options.hiddenTips);

const isTipComplete = (tipType: Tip['type']) => {
  const tipInfoItem = tipInfo[tipType as keyof typeof tipInfo];

  if (!tipInfoItem) {
    return true;
  }

  if (tipInfoItem.difficulty === 'easy' && options.hideBasicTips) {
    return true;
  }

  return ignoredTips.has(tipType);
};

export async function activate(context: vscode.ExtensionContext) {
  initDiagnostics(context);

  const updateHiddenTips = () => {
    updateOptions();
    ignoredTips = new Set(options.hiddenTips);
  };

  updateHiddenTips();

  if (options.hideBasicTips === null) {
    vscode.window
      .showInformationMessage(
        `Would you call yourself a TypeScript beginner? If you are, we'll show you tips that are helpful when you're first learning TypeScript.`,
        'Yes',
        'No',
      )
      .then((res) => {
        if (!res) {
          return;
        }
        vscode.workspace
          .getConfiguration('totalTypeScript')
          .update(
            'hideBasicTips',
            res === 'No',
            vscode.ConfigurationTarget.Global,
          );
      });
  }

  const helperDiagnostics =
    vscode.languages.createDiagnosticCollection('helpers');
  const uriStore: Record<string, Array<Tip & { range: vscode.Range }>> = {};

  context.subscriptions.push(
    vscode.commands.registerCommand(
      `ts-error-translator.dont-show-again`,
      async ({ tip }: { tip: TipType }) => {
        const humanReadableTip: string | undefined = tipInfo[tip]?.name;

        if (!humanReadableTip) {
          return;
        }

        const config = vscode.workspace.getConfiguration('totalTypeScript');

        ignoredTips.add(tip);

        await config.update(
          'hiddenTips',
          Array.from(ignoredTips),
          vscode.ConfigurationTarget.Global,
        );

        if (vscode.window.activeTextEditor?.document) {
          updateDiagnostics(vscode.window.activeTextEditor.document);
        }
      },
    ),
    vscode.commands.registerCommand(
      `ts-error-translator.show-tip`,
      async ({ tip }: { tip: TipType }) => {
        const humanReadableTip: string | undefined = tipInfo[tip]?.name;

        if (!humanReadableTip) {
          return;
        }

        const config = vscode.workspace.getConfiguration('totalTypeScript');

        ignoredTips.delete(tip);

        await config.update(
          'hiddenTips',
          Array.from(ignoredTips),
          vscode.ConfigurationTarget.Global,
        );

        if (vscode.window.activeTextEditor?.document) {
          updateDiagnostics(vscode.window.activeTextEditor.document);
        }
      },
    ),
  );

  const updateDiagnostics = async (document: vscode.TextDocument) => {
    try {
      const tipsFromFile = getTipsFromFile(document.getText());

      uriStore[document.uri.path] = tipsFromFile.map((tip) => ({
        ...tip,
        range: getRangeFromSourceLocation(tip.loc),
      }));
    } catch (e) {}

    helperDiagnostics.set(
      document.uri,
      uriStore[document.uri.path]
        .filter(tipHasNoDepsOrAllDepsCompleted)
        .filter((tip) => !isTipComplete(tip.type))
        .map((tip) => {
          const diagnostic = new vscode.Diagnostic(
            tip.range,
            tip.type,
            vscode.DiagnosticSeverity.Information,
          );
          diagnostic.source = 'total-typescript';
          return diagnostic;
        }),
    );
  };

  if (vscode.window.activeTextEditor) {
    await updateDiagnostics(vscode.window.activeTextEditor.document);
  }

  context.subscriptions.push(
    vscode.window.onDidChangeActiveTextEditor(async (editor) => {
      if (editor) {
        await updateDiagnostics(editor.document);
      }
    }),
    vscode.workspace.onDidChangeTextDocument(async (e) => {
      await updateDiagnostics(e.document);
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

      const tipsToShowFullHoverFor: Tip[] = [];
      const tipsToShowSummaryFor: Tip[] = [];

      items.forEach((tip) => {
        if (tipHasNoDepsOrAllDepsCompleted(tip) && !isTipComplete(tip.type)) {
          tipsToShowFullHoverFor.push(tip);
        } else {
          tipsToShowSummaryFor.push(tip);
        }
      });

      const contents = tipsToShowFullHoverFor
        .map((itemInRange) => {
          const thisTip = tipInfo[itemInRange.type];

          if (!thisTip) {
            return '';
          }
          const mdString = new vscode.MarkdownString(
            `**${thisTip.name}**\n\n${
              thisTip.message ? `${thisTip.message}\n\n` : ''
            }${
              thisTip.link ? `[Learn More](${thisTip.link}) |` : ''
            } [Mark as Learned](command:ts-error-translator.dont-show-again?${encodeURIComponent(
              JSON.stringify({ tip: itemInRange.type }),
            )})`,
          );

          mdString.isTrusted = true;
          mdString.supportHtml = true;

          return mdString;
        })
        .filter(Boolean);

      // const tipSummaryElements = tipsToShowSummaryFor
      //   .map((tip) => {
      //     const thisTip = tipInfo[tip.type];

      //     if (!thisTip) {
      //       return '';
      //     }
      //     return ` - ${
      //       thisTip.name
      //     } | [Show Hints](command:ts-error-translator.show-tip?${encodeURIComponent(
      //       JSON.stringify({ tip: tip.type }),
      //     )})`;
      //   })
      //   .filter(Boolean);

      // if (tipSummaryElements.length > 0) {
      //   const tipSummmary = new vscode.MarkdownString(
      //     [`**Learned Tips**`, '', ...tipSummaryElements].join('\n'),
      //   );

      //   tipSummmary.isTrusted = true;
      //   tipSummmary.supportHtml = true;

      //   contents.push(tipSummmary);
      // }

      return {
        contents,
      };
    },
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('totalTypeScript')) {
        updateHiddenTips();
      }

      if (vscode.window.activeTextEditor) {
        await updateDiagnostics(vscode.window.activeTextEditor.document);
      }
    }),
  );

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
