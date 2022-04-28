import * as vscode from "vscode";
import {
  parseErrors,
  fillBodyAndExcerptWithItems,
} from "@ts-error-messages/engine";
import * as bundleErrors from "./bundleErrors.json";
import { compressToEncodedURIComponent } from "lz-string";

const humaniseDiagnostic = (
  diagnostic: vscode.Diagnostic,
): vscode.MarkdownString | undefined => {
  if (diagnostic.source !== "ts") {
    return undefined;
  }
  const errors = parseErrors(diagnostic.message);

  const errorBodies: string[] = [];

  errors.forEach((error, index) => {
    const fullError = (
      bundleErrors as Record<string, { body: string; excerpt: string }>
    )[error.code];

    errorBodies.push(
      `## TS Error #${index + 1}`,
      ["```", error.parseInfo.rawError, "```"].join("\n"),
    );

    if (fullError) {
      const { excerpt } = fillBodyAndExcerptWithItems(
        fullError.body,
        fullError.excerpt,
        error.parseInfo.items,
      );
      errorBodies.push(
        `### Translation`,
        excerpt,
        `[See full translation](https://ts-error-translator.vercel.app/?error=${compressToEncodedURIComponent(
          diagnostic.message,
        )})`,
      );
    } else {
      errorBodies.push(
        `### Translation`,
        `Could not find a translation for error code \`#${error.code}\``,
        `\`${error.error}\``,
        `[Contribute a translation](https://github.com/mattpocock/ts-error-translator/blob/main/CONTRIBUTING.md)`,
      );
    }
  });

  if (errorBodies.length > 0) {
    return new vscode.MarkdownString(errorBodies.join("\n\n"));
  }
};

export function activate(context: vscode.ExtensionContext) {
  const uriStore: Record<
    vscode.Uri["path"],
    {
      range: vscode.Range;
      contents: vscode.MarkdownString[];
    }[]
  > = {};

  context.subscriptions.push(
    vscode.languages.registerHoverProvider(
      {
        scheme: "file",
        language: "typescript",
      },
      {
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
      },
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
          const humanizedVersion = humaniseDiagnostic(diagnostic);

          if (humanizedVersion) {
            items.push({
              range: diagnostic.range,
              contents: [humanizedVersion],
            });
          }
        });
        uriStore[uri.path] = items;
      });
    }),
  );

  context.subscriptions.push(
    vscode.languages.registerCodeLensProvider(
      {
        scheme: "file",
        language: "typescript",
      },
      {
        provideCodeLenses: (document) => {
          return [
            new vscode.CodeLens(
              new vscode.Range(
                new vscode.Position(0, 0),
                new vscode.Position(10, 0),
              ),
              {
                title: "Hey!",
                command: "wow",
              },
            ),
          ];
        },
      },
    ),
  );

  let disposable = vscode.commands.registerCommand(
    "my-extension.helloWorld",
    () => {
      vscode.window.showInformationMessage("Hello World from my-extension!");
    },
  );

  context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {}
