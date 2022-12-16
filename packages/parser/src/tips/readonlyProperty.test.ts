import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
  interface Wow {
    readonly optional: boolean;
  }

  type Wow2 = {
    readonly optional: boolean;
  }
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'interface-declaration',
    'readonly-object-property',
    'basic-types',
    'type-alias-declaration',
    'ts-object-type',
    'readonly-object-property',
    'basic-types',
  ]);
});
