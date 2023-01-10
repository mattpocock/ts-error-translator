import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
  const func = <T1, T2>() => {}
  function func2<T1, T2>() {}
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'generic-slots-in-functions',
    'multiple-generic-slots-in-functions',
    't-prefix-in-generic-arguments',
    't-prefix-in-generic-arguments',
    'generic-slots-in-functions',
    'multiple-generic-slots-in-functions',
    't-prefix-in-generic-arguments',
    't-prefix-in-generic-arguments',
  ]);
});
