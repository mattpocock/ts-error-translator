import { describe, expect, it } from 'vitest';
import { parseErrors, parseErrorsWithDb } from '../parseErrors';

describe('parseErrors', () => {
  it('Should catch multiple of the same error', () => {
    const errors = parseErrors(
      `Types of property 'URL_NAVIGATION' are incompatible.
    Types of property 'actions' are incompatible.`,
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

  it('Should handle multiple params of ALL the same value', () => {
    const result = parseErrorsWithDb(
      {
        [`'{0}', '{1}', '{2}'`]: {
          code: 1,
        },
      },
      `'A', 'A', 'A'`,
    );
    expect(result[0].parseInfo.items).toEqual(['A', 'A', 'A']);
  });

  it('Should handle multiple params of SOME the same value', () => {
    const result = parseErrorsWithDb(
      {
        [`'{0}', '{1}', '{2}'`]: {
          code: 1,
        },
      },
      `'A', 'A', 'B'`,
    );
    expect(result[0].parseInfo.items).toEqual(['A', 'A', 'B']);
  });

  it('Should handle non-quoted params', () => {
    const result = parseErrorsWithDb(
      {
        [`Imported via {0} from file '{1}'`]: {
          code: 1,
        },
      },
      `Imported via A from file 'B'`,
    );

    expect(result[0].parseInfo.items).toEqual(['A', 'B']);
  });

  it.skip('Should handle params in the incorrect order', () => {
    const result = parseErrorsWithDb(
      {
        [`{2}, {0}, {1}`]: {
          code: 1,
        },
      },
      `C, A, B`,
    );

    expect(result[0].parseInfo.items).toEqual(['A', 'B', 'C']);
  });

  it('Should handle params specified multiple times', () => {
    const result = parseErrorsWithDb(
      {
        [`{0}, {1}, {1}, {2}`]: {
          code: 1,
        },
      },
      `A, B, B, C`,
    );

    expect(result[0].parseInfo.items).toEqual(['A', 'B', 'C']);
  });

  it('If two sections match, it should choose the longer one', () => {
    const result = parseErrorsWithDb(
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
