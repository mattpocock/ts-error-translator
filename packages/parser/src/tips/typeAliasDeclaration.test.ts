import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
    type Wow2 = {}
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual(['type-alias-declaration', 'ts-object-type']);
});
