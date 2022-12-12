import {
  getTipsFromFile,
  Tip,
  TipInfo,
  tipInfo,
} from '@ts-error-messages/parser';
import * as vscode from 'vscode';
import { initDiagnostics } from './initDiagnostics';

const languages = [
  'typescript',
  'typescriptreact',
  'javascript',
  'javascriptreact',
];

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

const getHiddenTips = (): string[] => {
  const config = vscode.workspace.getConfiguration('tsErrorTranslator');
  return config.get('hiddenTips') || [];
};

let webview: vscode.WebviewPanel | undefined = undefined;

export async function activate(context: vscode.ExtensionContext) {
  initDiagnostics(context);

  let ignoredTips = new Set<string>(getHiddenTips());

  const updateHiddenTips = () => {
    ignoredTips = new Set(getHiddenTips());
  };

  const helperDiagnostics =
    vscode.languages.createDiagnosticCollection('helpers');
  const uriStore: Record<string, Array<Tip & { range: vscode.Range }>> = {};

  tips.forEach((tip) => {
    context.subscriptions.push(
      vscode.commands.registerCommand(
        `ts-error-translator.dont-show-again.${tip}`,
        async () => {
          const humanReadableTip: string | undefined =
            tipInfo[tip as keyof typeof tipInfo]?.name;

          if (!humanReadableTip) {
            return;
          }

          const config = vscode.workspace.getConfiguration('tsErrorTranslator');

          ignoredTips.add(tip);

          await config.update(
            'hiddenTips',
            Array.from(ignoredTips),
            vscode.ConfigurationTarget.Global,
          );
        },
      ),
    );

    context.subscriptions.push(
      vscode.commands.registerCommand(
        `ts-error-translator.show.${tip}`,
        async () => {
          const humanReadableTip:
            | { name: string; message?: string }
            | undefined = tipInfo[tip as keyof typeof tipInfo];

          if (!humanReadableTip) {
            return;
          }

          if (!webview) {
            webview = vscode.window.createWebviewPanel(
              'ts-error-translator',
              'TS Error Translator',
              vscode.ViewColumn.Beside,
            );

            context.subscriptions.push(
              webview.onDidDispose(() => {
                webview = undefined;
              }),
            );
          }

          webview.reveal();

          webview.title = humanReadableTip.name;

          webview.webview.html = `
            <video src="https://file-examples.com/storage/fe8c7eef0c6364f6c9504cc/2017/04/file_example_MP4_480_1_5MG.mp4" autoplay></video>
          `;
        },
      ),
    );
  });

  const updateDiagnostics = async (document: vscode.TextDocument) => {
    try {
      const tips = getTipsFromFile(document.getText());

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
          return ignoredTips.has(dep);
        });
      };

      /**
       * Tips where the deps have been fulfilled
       */
      const tipsWithoutDeps = tips.filter(tipHasNoDepsOrAllDepsCompleted);

      uriStore[document.uri.path] = tipsWithoutDeps
        .filter((tip) => !ignoredTips.has(tip.type))
        .map((tip) => ({
          ...tip,
          range: getRangeFromSourceLocation(tip.loc),
        }));
    } catch (e) {}

    helperDiagnostics.set(
      document.uri,
      uriStore[document.uri.path].map((tip) => {
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

      const contents = items
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
            } [Mark as Learned](command:ts-error-translator.dont-show-again.${
              itemInRange.type
            })`,
          );

          mdString.isTrusted = true;
          mdString.supportHtml = true;

          return mdString;
        })
        .filter(Boolean);

      return {
        contents,
      };
    },
  };

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration(async (e) => {
      if (e.affectsConfiguration('tsErrorTranslator.hiddenTips')) {
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
