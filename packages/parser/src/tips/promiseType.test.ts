import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it.only('Should work', () => {
  const fileContents = `
  

  type Wow2 = Promise<'a'>;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'type-alias-declaration',
    'passing-generics-to-types',
    'promise-utility-type',
    'literal-type',
  ]);
});
