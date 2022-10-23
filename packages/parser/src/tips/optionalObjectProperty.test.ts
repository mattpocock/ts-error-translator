import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
  interface Wow {
    optional?: boolean;
  }

  type Wow2 = {
    optional?: boolean;
  }
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'interface-declaration',
    'optional-object-property',
    'optional-object-property',
  ]);
});
