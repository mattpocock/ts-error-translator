import * as vscode from 'vscode';

import {
  parseErrors,
  fillBodyAndExcerptWithItems,
} from '@ts-error-messages/engine';
import * as bundleErrors from './bundleErrors.json';
import { compressToEncodedURIComponent } from 'lz-string';
import { Options } from './types';

export const humaniseDiagnostic = (
  diagnostic: vscode.Diagnostic,
  options: Options,
): vscode.MarkdownString | undefined => {
  if (diagnostic.source !== 'ts') {
    return undefined;
  }
  const errors = parseErrors(diagnostic.message);

  const errorBodies: string[] = [];

  errors.forEach((error, index) => {
    const fullError = (
      bundleErrors as Record<string, { body: string; excerpt: string }>
    )[error.code];

    errorBodies.push(['```txt', error.parseInfo.rawError, '```'].join('\n'));

    if (fullError) {
      const { excerpt, body } = fillBodyAndExcerptWithItems(
        fullError.body,
        fullError.excerpt,
        error.parseInfo.items,
      );
      errorBodies.push(
        `[See full translation](https://ts-error-translator.vercel.app/?error=${compressToEncodedURIComponent(
          diagnostic.message,
        )})`,
        ...(options.showTLDRTranslation ? [`### TL;DR`, excerpt] : []),
        ...(options.showFullTranslation ? [`### Full Translation`, body] : []),
      );
    } else {
      errorBodies.push(
        `### No Translation Found`,
        `Could not find a translation for error code \`#${error.code}\``,
        `[Contribute a translation](https://github.com/mattpocock/ts-error-translator/blob/main/CONTRIBUTING.md)`,
      );
    }
  });

  if (errorBodies.length > 0) {
    return new vscode.MarkdownString(errorBodies.join('\n\n'));
  }
};
