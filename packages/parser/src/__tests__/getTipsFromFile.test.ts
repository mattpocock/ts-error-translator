import { describe, expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

describe('getTipsFromFile', () => {
  it('REPL', () => {
    const fileContents = `
  type Wow<T1, T2> = {}
`;

    const tips = getTipsFromFile(fileContents);

    expect(tips.map((t) => t.type)).toMatchInlineSnapshot(`
      [
        "interface-or-type-with-generics",
        "interface-or-type-with-multiple-generics",
      ]
    `);
  });

  it('Should work with variable-type-annotations', () => {
    const fileContents = `
    const nice: true = {}
    `;

    const tips = getTipsFromFile(fileContents).map((tip) => tip.type);

    expect(tips).toEqual(['variable-type-annotation']);
  });
});
