import { getTipsFromFile, Tip, TipType } from '@ts-error-messages/parser';
import * as fg from 'fast-glob';
import { readFile } from 'fs/promises';
import path from 'path';
import os from 'os';

type AbsoluteFilePath = string;

export const run = async (tipType: TipType) => {
  const files: AbsoluteFilePath[] = await fg.default(
    path.resolve(os.homedir(), `repos/oss/**/*.{ts,tsx}`),
    {
      ignore: ['**/node_modules/**', '**/dist/**', '**/DefinitelyTyped/**'],
    },
  );
  let erroredFileCount = 0;

  for (const file of files) {
    const fileContents = await readFile(file, 'utf-8');

    try {
      const tips = getTipsFromFile(fileContents);

      const filteredTips = tips.filter((tip) => tip.type === tipType);

      if (filteredTips.length > 0) {
        filteredTips.forEach((tip) => {
          console.log(`${file}:${tip.loc.start.line}:${tip.loc.start.column}`);
        });
      }
    } catch (e) {
      erroredFileCount++;
    }
  }

  console.log(`Total files: ${files.length}`);
  console.log(`Errored files: ${erroredFileCount}`);
};
