import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
  interface Wow<T1, T2> {}
  type Wow2<T1, T2> = T1;
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'interface-declaration',
    'interface-with-generics',
    'interface-with-multiple-generics',
    't-prefix-in-generic-arguments',
    't-prefix-in-generic-arguments',
    'type-alias-declaration',
    'type-alias-with-generics',
    'type-alias-with-multiple-generics',
    't-prefix-in-generic-arguments',
    't-prefix-in-generic-arguments',
  ]);
});
