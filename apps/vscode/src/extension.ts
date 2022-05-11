import * as vscode from 'vscode';
import { humaniseDiagnostic } from './humaniseDiagnostic';
import { Options } from './types';

const defaultOptions: Options = {
  showFullTranslation: true,
  showTLDRTranslation: true,
};

let options = defaultOptions;

export function activate(context: vscode.ExtensionContext) {
  const uriStore: Record<
    vscode.Uri['path'],
    {
      range: vscode.Range;
      contents: vscode.MarkdownString[];
    }[]
  > = {};

  const updateOptions = () => {
    options = {
      ...defaultOptions,
      ...vscode.workspace.getConfiguration('tsErrorTranslator'),
    };
  };

  updateOptions();

  context.subscriptions.push(
    vscode.workspace.onDidChangeConfiguration((config) => {
      if (config.affectsConfiguration('tsErrorTranslator')) {
        updateOptions();
      }
    }),
  );

  const hoverProvider: vscode.HoverProvider = {
    provideHover: (document, position) => {
      const itemsInUriStore = uriStore[document.uri.path];

      if (!itemsInUriStore) {
        return null;
      }

      const itemsInRange = itemsInUriStore.filter((item) => {
        return item.range.contains(position);
      });
      return itemsInRange[0];
    },
  };

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      {
        language: 'typescript',
      },
      hoverProvider,
    ),
    vscode.languages.registerHoverProvider(
      {
        language: 'typescriptreact',
      },
      hoverProvider,
    ),
    vscode.languages.registerHoverProvider(
      {
        language: 'vue',
      },
      hoverProvider,
    ),
    vscode.languages.registerHoverProvider(
      {
        language: 'svelte',
      },
      hoverProvider,
    ),
    vscode.languages.registerHoverProvider(
      {
        language: 'astro',
      },
      hoverProvider,
    ),
  );

  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics((e) => {
      e.uris.forEach((uri) => {
        const diagnostics = vscode.languages.getDiagnostics(uri);

        const items: {
          range: vscode.Range;
          contents: vscode.MarkdownString[];
        }[] = [];
        diagnostics.forEach((diagnostic) => {
          const humanizedVersion = humaniseDiagnostic(diagnostic, options);

          if (humanizedVersion) {
            items.push({
              range: diagnostic.range,
              contents: humanizedVersion,
            });
          }
        });
        uriStore[uri.path] = items;
      });
    }),
  );
}

// this method is called when your extension is deactivated
export function deactivate() {}
