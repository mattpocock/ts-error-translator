import { describe, expect, it } from 'vitest';
import { parseErrors } from '../parseErrors';

const opts = {
  dir: './errors',
};

describe('parseErrors', () => {
  it.skip('Should work', () => {
    expect(
      parseErrors(
        `Conversion of type 'string' to type 'string[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.`,
        opts,
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "code": 2352,
          "error": "Conversion of type '{0}' to type '{1}' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.",
          "improvedError": {
            "body": "It looks like you're trying to use \`as\` to 'cast' one type into another. Your first type:
      
      \`\`\`
      string
      \`\`\`
      
      doesn't match up with
      
      \`\`\`
      string[]
      \`\`\`
      
      because there isn't what I call 'sufficient overlap' between them. I.e. they don't look enough like each other.
      
      If you really meant to do this, you should cast \`string\` to \`unknown\` first. For example, if I wanted to cast \`string\` to \`string[]\`, I'd need to write this code:
      
      \`\`\`ts twoslash
      const a = \\"wow\\" as unknown as string[];
      \`\`\`
      ",
            "excerpt": "You can't use 'as' to convert 'string' into a 'string[]' - they don't share enough in common.",
          },
          "parseInfo": {
            "endIndex": 190,
            "firstItem": "string",
            "secondItem": "string[]",
            "startIndex": 0,
          },
        },
      ]
    `);

    expect(
      parseErrors(`Argument of type '{}' is not assignable to parameter of type '{ wow: { nice: boolean; }; }'.
    Property 'wow' is missing in type '{}' but required in type '{ wow: { nice: boolean; }; }'.`),
    ).toMatchInlineSnapshot(`
      [
        {
          "code": 2324,
          "error": "Property '{0}' is missing in type '{1}'.",
          "improvedError": null,
          "parseInfo": {
            "endIndex": 188,
            "firstItem": "wow",
            "secondItem": "{}' but required in type '{ wow: { nice: boolean; }; }",
            "startIndex": 97,
          },
        },
        {
          "code": 2345,
          "error": "Argument of type '{0}' is not assignable to parameter of type '{1}'.",
          "improvedError": null,
          "parseInfo": {
            "endIndex": 92,
            "firstItem": "{}",
            "secondItem": "{ wow: { nice: boolean; }; }",
            "startIndex": 0,
          },
        },
      ]
    `);

    expect(
      parseErrors(
        `The expected type comes from property 'nice' which is declared here on type '{ nice: boolean; }'`,
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "code": 6500,
          "error": "The expected type comes from property '{0}' which is declared here on type '{1}'",
          "improvedError": null,
          "parseInfo": {
            "endIndex": 96,
            "firstItem": "nice",
            "secondItem": "{ nice: boolean; }",
            "startIndex": 0,
          },
        },
      ]
    `);
  });

  it.skip('REPL 2', () => {
    expect(
      parseErrors(
        `Property 'wow' is missing in type '{}' but required in type '{ wow: { nice: boolean; }; }'.`,
      ),
    ).toMatchInlineSnapshot(`
      [
        {
          "code": 2741,
          "error": "Property '{0}' is missing in type '{1}' but required in type '{2}'.",
          "improvedError": null,
          "parseInfo": {
            "endIndex": 91,
            "items": [
              "wow",
              "{}",
              "{ wow: { nice: boolean; }; }",
            ],
            "startIndex": 0,
          },
        },
      ]
    `);
  });

  it('Should catch multiple of the same error', () => {
    const errors = parseErrors(
      `Types of property 'URL_NAVIGATION' are incompatible.
    Types of property 'actions' are incompatible.`,
      {
        dir: './errors',
      },
    );

    expect(errors).toHaveLength(2);
  });

  it('should match diagnostic variadic arguments for quoted types and arbitrary (non-quoted) values', () => {
    const input = `
      Generic type 'T' requires between 5 and 10 type arguments.
      Type 'B' is missing the following properties from type 'A': two, three
      'T' refers to a value, but is being used as a type here. Did you mean 'typeof T'?
    `;
    const errors = parseErrors(input);

    // TODO - assert based on the items, not on the snapshot
    expect(errors).toMatchInlineSnapshot(`
      [
        {
          "code": 2707,
          "error": "Generic type '{0}' requires between {1} and {2} type arguments.",
          "parseInfo": {
            "endIndex": 7,
            "items": [
              "T",
              "5",
              "10",
            ],
            "rawError": "Generic type 'T' requires between 5 and 10 type arguments.",
            "startIndex": 7,
          },
        },
        {
          "code": 2739,
          "error": "Type '{0}' is missing the following properties from type '{1}': {2}",
          "parseInfo": {
            "endIndex": 72,
            "items": [
              "B",
              "A",
              "two, three",
            ],
            "rawError": "Type 'B' is missing the following properties from type 'A': two, three",
            "startIndex": 72,
          },
        },
        {
          "code": 2749,
          "error": "'{0}' refers to a value, but is being used as a type here. Did you mean 'typeof {0}'?",
          "parseInfo": {
            "endIndex": 149,
            "items": [
              "T",
            ],
            "rawError": "'T' refers to a value, but is being used as a type here. Did you mean 'typeof T'?",
            "startIndex": 149,
          },
        },
      ]
    `);
  });
});
