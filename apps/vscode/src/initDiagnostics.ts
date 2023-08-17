import * as vscode from 'vscode';
import { humaniseDiagnostic } from './humaniseDiagnostic';

const languages = [
  'typescript',
  'typescriptreact',
  'javascript',
  'javascriptreact',
  'vue',
  'svelte',
  'astro',
];

type UriStoreMember = {
  range: vscode.Range;
  severity: vscode.DiagnosticSeverity;
  contents: vscode.MarkdownString[];
};

export const initDiagnostics = (context: vscode.ExtensionContext) => {
  const uriStore: Record<vscode.Uri['path'], UriStoreMember[]> = {};

  const hoverProvider: vscode.HoverProvider = {
    provideHover: (document, position) => {
      const itemsInUriStore = uriStore[document.uri.path];

      if (!itemsInUriStore) {
        return null;
      }

      const itemsInRange = itemsInUriStore
        // Only show errors
        .filter((item) => item.severity === vscode.DiagnosticSeverity.Error)
        .filter((item) => {
          return item.range.contains(position);
        });

      return itemsInRange[0];
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

  context.subscriptions.push(
    vscode.languages.onDidChangeDiagnostics((e) => {
      e.uris.forEach((uri) => {
        const diagnostics = vscode.languages.getDiagnostics(uri);

        const items: UriStoreMember[] = [];

        diagnostics.forEach((diagnostic) => {
          if (diagnostic.source !== 'ts') {
            return;
          }

          const humanizedVersion = humaniseDiagnostic(diagnostic);

          if (humanizedVersion) {
            items.push({
              range: diagnostic.range,
              contents: humanizedVersion,
              severity: diagnostic.severity,
            });
          }
        });
        uriStore[uri.path] = items;
      });
    }),
  );
};
