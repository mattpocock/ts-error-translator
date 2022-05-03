import fs from 'fs';
import { logger } from './logger';
import tsErrorJSON from '../../packages/engine/src/tsErrorMessages.json';

export type TSErrorType = {
  code: number;
  message: string;
  category: string;
};

export type TSErrorListByTranslationStatus = {
  needTranslation: TSErrorType[];
  translated: TSErrorType[];
};

export function getAllErrorsByMessage() {
  return tsErrorJSON;
}

export function getTranslatedErrorCodes(): Set<number> {
  const translatedErrorCodes = new Set<number>();

  fs.readdirSync('packages/engine/errors').forEach((filename) => {
    const [name, extension] = filename.split('.');

    if (extension.toLowerCase() !== 'md') {
      logger.info(`Skipping ${filename} because extension is not .md`);
    } else {
      translatedErrorCodes.add(Number(name));
    }
  });

  return translatedErrorCodes;
}

export function getErrorListsByTranslationStatus(): TSErrorListByTranslationStatus {
  const translatedErrorCodes = getTranslatedErrorCodes();
  const allErrorsByMessage = getAllErrorsByMessage();

  return Object.entries(allErrorsByMessage).reduce(
    (acc, [message, { category, code }]) => {
      if (translatedErrorCodes.has(code)) {
        acc.translated.push({ message, category, code });
      } else {
        acc.needTranslation.push({ message, category, code });
      }
      return acc;
    },
    { translated: [], needTranslation: [] } as TSErrorListByTranslationStatus,
  );
}
