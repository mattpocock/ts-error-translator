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
  const { type, repos }: { type?: TipType; repos: string[] } = await prompts([
    {
      message: `What type of tip do you want to search for?`,
      type: 'autocomplete',
      name: 'type',
      choices: tipsAsStrings.map((type) => ({ title: type, value: type })),
    },
    {
      message: `Which repos do you want to search?`,
      type: 'autocompleteMultiselect',
      name: 'repos',
      choices: [
        { title: 'libraries', value: 'libraries', selected: false },
        { title: 'apps', value: 'apps', selected: true },
      ],
    },
  ]);

  if (!type) process.exit(0);

  const toIgnore = [
    '**/node_modules/**',
    '**/dist/**',
    '**/DefinitelyTyped/**',
  ];

  if (!repos.includes('libraries')) {
    toIgnore.push('**/trpc/**');
    toIgnore.push('**/zod/**');
    toIgnore.push('**/xstate/**');
    toIgnore.push('**/query/**');
    toIgnore.push('**/io-ts/**');
    toIgnore.push('**/redux/**');
    toIgnore.push('**/magic-regexp/**');
  }

  const files: AbsoluteFilePath[] = await fg.default(
    path.resolve(os.homedir(), `repos/oss/cal.com/**/*.{ts,tsx}`),
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
