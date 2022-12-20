import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
    type Wow2<T> = {
      [K in keyof T]: T[K];
    }
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'type-alias-declaration',
    'type-alias-with-generics',
    't-prefix-in-generic-arguments',
    'mapped-type',
    'k-in-keyof',
    'keyof',
  ]);
});
