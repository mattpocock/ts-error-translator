import * as vscode from 'vscode';

import { findHintsInError } from '@total-typescript/error-hint-engine';
import { Options } from './types';

export const humaniseDiagnostic = (
  diagnostic: vscode.Diagnostic,
  options: Options,
): vscode.MarkdownString[] => {
  if (diagnostic.source !== 'ts') {
    return [];
  }
  const hints = findHintsInError(diagnostic.message);

  const messageBodies: string[] = [];

  hints.forEach((hint, index, array) => {
    const prepended = (str: string) => {
      return `- ${str}`;
    };

    messageBodies.push(prepended(hint));
  });

  return [new vscode.MarkdownString(messageBodies.join('\n'))];
};
