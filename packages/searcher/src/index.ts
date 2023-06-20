import {
  getTipsFromFile,
  Tip,
  tipsAsStrings,
  TipType,
} from '@total-typescript/tips-parser';
import * as fg from 'fast-glob';
import { readFile } from 'fs/promises';
import path from 'path';
import os from 'os';
import prompts from 'prompts';

type AbsoluteFilePath = string;

export const run = async () => {
  const { type }: { type?: TipType } = await prompts([
    {
      message: `What type of tip do you want to search for?`,
      type: 'autocomplete',
      name: 'type',
      choices: tipsAsStrings.map((type) => ({ title: type, value: type })),
    },
  ]);

  if (!type) process.exit(0);

  const toIgnore = [
    '**/node_modules/**',
    '**/dist/**',
    '**/DefinitelyTyped/**',
  ];

  const files: AbsoluteFilePath[] = await fg.default(
    path.resolve(process.env.INIT_CWD || process.cwd(), `./**/*.{ts,tsx}`),
    {
      ignore: toIgnore,
    },
  );

  let erroredFileCount = 0;

  for (const file of files) {
    const fileContents = await readFile(file, 'utf-8');

    const fileContentsSplit = fileContents.split('\n');

    try {
      const tips = getTipsFromFile(fileContents, type);

      const filteredTips = tips.filter((tip) => tip.type === type);

      if (filteredTips.length > 0) {
        filteredTips.forEach((tip) => {
          let preview = ``;

          let lineIndex = tip.loc.start.line - 2;

          /**
           * For each line, concatenate to preview
           */

          while (lineIndex < tip.loc.end.line + 1) {
            if (typeof fileContentsSplit[lineIndex] === 'undefined') {
              break;
            }

            if (fileContentsSplit[lineIndex].trim()) {
              preview = `${preview}\n${fileContentsSplit[lineIndex]}`;
            }
            lineIndex++;
          }

          console.log(
            `${file}:${tip.loc.start.line}:${tip.loc.start.column + 1}`,
          );
          console.log(preview);

          console.log('');
        });
      }
    } catch (e) {
      erroredFileCount++;
    }
  }

  console.log(`Total files: ${files.length}`);
  console.log(`Errored files: ${erroredFileCount}`);
};
