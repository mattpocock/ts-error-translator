import * as vscode from 'vscode';
import {
  fillBodyWithItems,
  parseErrors,
} from '@total-typescript/error-translation-engine';
import * as bundleErrors from './bundleErrors.json';

type GHIssueURLParams = {
  title: string;
  body: string;
  labels: string;
  assignees: 'mattpocock';
};

export const humaniseDiagnostic = (
  diagnostic: vscode.Diagnostic,
): vscode.MarkdownString[] => {
  const errorLines = parseErrors(diagnostic.message);

  const markdownStrings: vscode.MarkdownString[] = [];

  markdownStrings.push(new vscode.MarkdownString('## Translation'));

  errorLines.forEach((error) => {
    const errorBodies: string[] = [];

    const fullError = (bundleErrors as Record<string, { body: string }>)[
      error.code
    ];

    errorBodies.push(['```txt', error.parseInfo.rawError, '```'].join('\n'));

    if (fullError) {
      const { body } = fillBodyWithItems(fullError.body, error.parseInfo.items);

      errorBodies.push('---', body);
    } else {
      errorBodies.push(
        `[Request a translation for \`#${
          error.code
        }\`](https://github.com/mattpocock/ts-error-translator/issues/new?${new URLSearchParams(
          {
            title: `Translation request for ${error.code}`,
            assignees: 'mattpocock',
            body: [
              `# Error Text`,
              `${error.parseInfo.rawError}`,
              `# Supporting Information`,
              `Please provide other information which led to this error, and any specific questions you have about it:`,
            ].join('\n\n'),
            labels: 'translation request',
          } satisfies GHIssueURLParams,
        )})`,
      );
    }

    markdownStrings.push(new vscode.MarkdownString(errorBodies.join('\n\n')));
  });

  return markdownStrings;
};
