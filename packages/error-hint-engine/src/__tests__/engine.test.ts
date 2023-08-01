import { describe, expect, it } from 'vitest';
import { findHintsInError } from '../errorHintEngine';

it('REPL', () => {
  const errors = findHintsInError(
    `Type 'string' is not assignable to type 'number'.`,
  );
  expect(errors).toMatchInlineSnapshot(`
    [
      "[Not Assignable To](https://totaltypescript.com/concepts/assignability): I expected one thing, but you passed another.",
    ]
  `);
});
