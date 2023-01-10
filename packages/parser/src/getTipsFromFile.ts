import { parse } from '@babel/parser';
import traverse, { TraverseOptions } from '@babel/traverse';
import * as t from '@babel/types';
import { allTips, Tip, TipType } from './tips';

type TipFunctions = Partial<
  Record<t.Node['type'], Array<(opts: any[]) => void>>
>;

export const parseFileContents = (fileContents: string) => {
  const parseResult = parse(fileContents, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'jsx',
      ['decorators', { decoratorsBeforeExport: false }],
    ],
  }) as t.File;

  return parseResult;
};

export const getTipsFromFile = (
  fileContents: string,
  tipToFilter?: TipType,
) => {
  const parseResult = parseFileContents(fileContents);
  const tips: Tip[] = [];

  const tipFunctions: TipFunctions = {};

  const push = (tip: Tip) => tips.push(tip);

  allTips.forEach((tipFunction) => {
    if (tipToFilter && tipToFilter !== tipFunction.type) {
      return;
    }

    const opts = tipFunction.createOpts(push);

    Object.entries(opts).forEach(([_key, func]) => {
      const key = _key as keyof typeof tipFunctions;
      if (!tipFunctions[key]) {
        tipFunctions[key] = [];
      }

      tipFunctions[key]!.push(func);
    });
  });

  traverse(parseResult, tipFunctionsToTraverseOptions(tipFunctions));

  return tips;
};

const tipFunctionsToTraverseOptions = (
  tipFunctions: TipFunctions,
): TraverseOptions => {
  const opts: TraverseOptions = {};

  Object.entries(tipFunctions).forEach(([key, funcs]) => {
    (opts as any)[key] = (path: any) => {
      funcs.forEach((func) => func(path));
    };
  });

  return opts;
};
