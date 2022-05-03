import fs from 'fs';
import {
  getErrorListsByTranslationStatus,
  TSErrorListByTranslationStatus,
  TSErrorType,
} from './utils/translations';

const template = (translationStatusLists: TSErrorListByTranslationStatus) =>
  `
# Translation Statuses

This file was generated with a GitHub Action and lists the translations status of each TypeScript error.

## Need Translation

${translationStatusLists.needTranslation
  .map(makeErrorStatusMarkdown)
  .join('\n')}

## Translated

${translationStatusLists.translated.map(makeErrorStatusMarkdown).join('\n')}

`.trim();

function writeMarkdownFile(
  translationStatuses: TSErrorListByTranslationStatus,
) {
  fs.writeFileSync('TRANSLATION_STATUS.md', template(translationStatuses));
}

function makeErrorStatusMarkdown(tsError: TSErrorType) {
  return `- (${tsError.code}) ${tsError.message}`;
}

writeMarkdownFile(getErrorListsByTranslationStatus());
