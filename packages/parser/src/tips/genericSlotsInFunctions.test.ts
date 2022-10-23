import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
  const func = <T1>() => {}
  function func2<T1>() {}
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'generic-slots-in-functions',
    'generic-slots-in-functions',
  ]);
});
