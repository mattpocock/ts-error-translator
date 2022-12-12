import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
    type Yeah = {}[keyof {}];
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'type-alias-declaration',
    'keyof-indexed-access',
    'keyof',
  ]);
});
