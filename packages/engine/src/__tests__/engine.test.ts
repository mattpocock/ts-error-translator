import { describe, expect, it } from 'vitest';
import { parseErrors, parseErrorsWithDb } from '../parseErrors';

describe('parseErrors', async () => {
  it('Should catch multiple of the same error', async () => {
    const errors = await parseErrors(
      `Types of property 'URL_NAVIGATION' are incompatible.
    Types of property 'actions' are incompatible.`,
    );

    expect(errors).toHaveLength(2);
  });

  it('should match diagnostic variadic arguments for quoted types and arbitrary (non-quoted) values', async () => {
    const input = `
      Generic type 'T' requires between 5 and 10 type arguments.
      Type 'B' is missing the following properties from type 'A': two, three
      'T' refers to a value, but is being used as a type here. Did you mean 'typeof T'?
    `;
    const errors = await parseErrors(input);

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
            "prettyItems": [
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
            "prettyItems": [
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
            "prettyItems": [
              "T",
            ],
            "rawError": "'T' refers to a value, but is being used as a type here. Did you mean 'typeof T'?",
            "startIndex": 149,
          },
        },
      ]
    `);
  });

  it('Should handle multiple params of ALL the same value', async () => {
    const result = await parseErrorsWithDb(
      {
        [`'{0}', '{1}', '{2}'`]: {
          code: 1,
        },
      },
      `'A', 'A', 'A'`,
    );
    expect(result[0].parseInfo.items).toEqual(['A', 'A', 'A']);
  });

  it('Should handle multiple params of SOME the same value', async () => {
    const result = await parseErrorsWithDb(
      {
        [`'{0}', '{1}', '{2}'`]: {
          code: 1,
        },
      },
      `'A', 'A', 'B'`,
    );
    expect(result[0].parseInfo.items).toEqual(['A', 'A', 'B']);
  });

  it('Should handle non-quoted params', async () => {
    const result = await parseErrorsWithDb(
      {
        [`Imported via {0} from file '{1}'`]: {
          code: 1,
        },
      },
      `Imported via A from file 'B'`,
    );

    expect(result[0].parseInfo.items).toEqual(['A', 'B']);
  });

  it.skip('Should handle params in the incorrect order', async () => {
    const result = await parseErrorsWithDb(
      {
        [`{2}, {0}, {1}`]: {
          code: 1,
        },
      },
      `C, A, B`,
    );

    expect(result[0].parseInfo.items).toEqual(['A', 'B', 'C']);
  });

  it('Should handle params specified multiple times', async () => {
    const result = await parseErrorsWithDb(
      {
        [`{0}, {1}, {1}, {2}`]: {
          code: 1,
        },
      },
      `A, B, B, C`,
    );

    expect(result[0].parseInfo.items).toEqual(['A', 'B', 'C']);
  });

  describe('When two sections match, but one is longer', async () => {
    it('Should choose the longer one', async () => {
      const result = await parseErrorsWithDb(
        {
          [`{0}, {1}, {2}`]: {
            code: 1,
          },
          [`{0}, {1}, {2}, {3}`]: {
            code: 1,
          },
        },
        `A, B, C, D`,
      );

      /**
       * It should not have matched {0}, {1}, {2}, because
       * {0}, {1}, {2}, {3} was a better match
       */
      expect(result).toHaveLength(1);
      expect(result[0].parseInfo.items).toEqual(['A', 'B', 'C', 'D']);
    });
  });

  it('Should handle cases where there are no params', async () => {
    const result = await parseErrorsWithDb(
      {
        [`Hello!`]: {
          code: 1,
        },
      },
      `Hello!`,
    );

    expect(result[0].parseInfo.items).toEqual([]);
  });

  it('Should prettify values where possible', async () => {
    const result = await parseErrorsWithDb(
      {
        [`'{0}' is bad`]: {
          code: 1,
        },
      },
      `'{ something: true; wonderful: 'nice'} | { something: false}' is bad`,
    );

    expect(result[0].parseInfo.prettyItems[0]).toMatchInlineSnapshot(`
      "| { something: true, wonderful: 'nice' }
        | { something: false }"
    `);
  });
});
