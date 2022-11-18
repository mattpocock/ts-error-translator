import { expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

it('Should work', () => {
  const fileContents = `
  declare global {
    interface Another {}
    interface Window {

    }
  }
  `;

  const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

  expect(tips).toEqual([
    'declare-global',
    'interface-window-in-declare-global',
    'interface-declaration',
    'interface-declaration',
  ]);
});
