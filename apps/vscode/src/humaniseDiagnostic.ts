import * as vscode from 'vscode';

import {
  parseErrors,
  fillBodyAndExcerptWithItems,
} from '@ts-error-messages/engine';
import * as bundleErrors from './bundleErrors.json';
import { compressToEncodedURIComponent } from 'lz-string';
import { Options } from './types';

const getMessageTemplate = (options: Options) => {
  let messageTemplate:
    | 'body-and-tldr'
    | 'tldr-only'
    | 'body-only'
    | 'link-only';

  if (options.showFullTranslation) {
    if (options.showTLDRTranslation) {
      messageTemplate = 'body-and-tldr';
    } else {
      messageTemplate = 'body-only';
    }
  } else {
    if (options.showTLDRTranslation) {
      messageTemplate = 'tldr-only';
    } else {
      messageTemplate = 'link-only';
    }
  }

  return messageTemplate;
};

export const humaniseDiagnostic = (
  diagnostic: vscode.Diagnostic,
  options: Options,
): vscode.MarkdownString[] => {
  if (diagnostic.source !== 'ts') {
    return [];
  }
  const errors = parseErrors(diagnostic.message);

  const markdownStrings: vscode.MarkdownString[] = [];

  errors.forEach((error, index, array) => {
    const errorBodies: string[] = [];

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

      const messageTemplate = getMessageTemplate(options);

      const linkToTranslation = `[See full translation](https://ts-error-translator.vercel.app/?error=${compressToEncodedURIComponent(
        diagnostic.message,
      )})`;

      switch (messageTemplate) {
        case 'body-and-tldr':
          {
            errorBodies.push(
              `**Translation**: ${excerpt}`,
              body,
              linkToTranslation,
            );
          }
          break;
        case 'body-only':
          errorBodies.push(linkToTranslation, body);
          break;
        case 'link-only':
          errorBodies.push(linkToTranslation);
          break;
        case 'tldr-only':
          errorBodies.push(`**Translation**: ${excerpt}`, linkToTranslation);
          break;
      }
    } else {
      errorBodies.push(
        `[Contribute a translation for \`#${error.code}\`](https://github.com/mattpocock/ts-error-translator/blob/main/CONTRIBUTING.md)`,
      );
    }

    markdownStrings.push(new vscode.MarkdownString(errorBodies.join('\n\n')));
  });

  return markdownStrings;
};
