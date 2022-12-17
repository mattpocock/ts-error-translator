import { describe, expect, it } from 'vitest';
import { getTipsFromFile } from '../getTipsFromFile';

type Mutable<T> = {
  -readonly [K in keyof T]: T[K];
};

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
        "type-alias-declaration",
      ]
    `);
  });
});
