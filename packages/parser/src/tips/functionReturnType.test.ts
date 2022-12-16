import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work with function-return-types', () => {
  const fileContents = `
  const func = (): boolean => {};

function yeah(): boolean {};
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'function-return-type',
    'basic-types',
    'function-return-type',
    'basic-types',
  ]);
});
