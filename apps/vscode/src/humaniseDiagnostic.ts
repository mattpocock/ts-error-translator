import * as vscode from 'vscode';

import {
  fillExcerptWithItems,
  parseErrors,
} from '@total-typescript/error-translation-engine';
import * as bundleErrors from './bundleErrors.json';
import { Options } from './types';

export const humaniseDiagnostic = (
  diagnostic: vscode.Diagnostic,
  options: Options,
): vscode.MarkdownString[] => {
  if (diagnostic.source !== 'ts') {
    return [];
  }
  const errors = parseErrors(diagnostic.message);

  const messageBodies: string[] = [];

  errors.forEach((error, index, array) => {
    const fullError = (bundleErrors as Record<string, { excerpt: string }>)[
      error.code
    ];

    const prepended = (str: string) => {
      return `- ${str}`;
    };

    // if (fullError) {
    //   const { excerpt } = fillExcerptWithItems(
    //     fullError.excerpt,
    //     error.parseInfo.items,
    //   );

    //   messageBodies.push(
    //     // TODO: Prettify the excerpt here
    //     prepended(excerpt),
    //   );
    // } else {
    //   messageBodies.push(
    //     // TODO: Prettify the raw error here
    //     prepended(error.parseInfo.rawError),
    //   );
    // }

    // messageBodies.push(
    //   `'Component' cannot be used as a [JSX component](https://totaltypescript.com/concepts/jsx-component).`,
    //   `Its return type 'ReactNode' is not a valid JSX element.`,
    //   `Type 'undefined' is [not assignable to](https://totaltypescript.com/concepts/not-assignable-to) type 'Element | null'.`,
    // );
  });

  messageBodies.push(
    `- The type 'undefined' is [not assignable to](https://totaltypescript.com/concepts/not-assignable-to) type 'Element | null'.`,
    '- Only certain types can be used as [JSX elements](https://totaltypescript.com/concepts/jsx-components).',
  );

  return [new vscode.MarkdownString(messageBodies.join('\n'))];
};
