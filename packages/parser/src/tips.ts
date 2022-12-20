import * as t from '@babel/types';
import { genericSlotsInFunctions } from './tips/genericSlotsInFunctions';
import { functionReturnType } from './tips/functionReturnType';
import { interfaceDeclaration } from './tips/interfaceDeclaration';
import { interfaceWithGenerics } from './tips/interfaceWithGenerics';
import { multipleGenericSlotsInFunctions } from './tips/multipleGenericSlotsInFunctions';
import { optionalObjectProperty } from './tips/optionalObjectProperty';
import { typeAliasDeclaration } from './tips/typeAliasDeclaration';
import { readonlyProperty } from './tips/readonlyProperty';
import { mappedType } from './tips/mappedType';
import { kInKeyof } from './tips/kInKeyof';
import { numberIndexedAccess } from './tips/numberIndexedAccess';
import { tupleType } from './tips/tupleType';
import { interfaceWithMultipleGenerics } from './tips/interfaceWithMultipleGenerics';
import { typeAliasWithGenerics } from './tips/typeWithGenerics';
import { typeAliasWithMultipleGenerics } from './tips/typeWithMultipleGenerics';
import { passingGenericsToTypes } from './tips/passingGenericsToTypes';
import { interfaceWindowInDeclareGlobal } from './tips/interfaceWindowInDeclareGlobal';
import { declareGlobal } from './tips/declareGlobal';
import { spreadIntoTupleType } from './tips/spreadIntoTupleType';
import { keyofIndexedAccess } from './tips/keyofIndexedAccess';
import { templateLiteral } from './tips/templateLiteral';
import { createInlineTip } from './createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from './utils';
import { z } from 'zod';

const UTILITY_TYPES = [
  'Promise',
  'Extract',
  'Exclude',
  'Omit',
  'Pick',
  'NonNullable',
  'ReturnType',
  'InstanceType',
  'Required',
  'Readonly',
  'Partial',
  'Record',
  'Parameters',
  'Awaited',
  'Uppercase',
  'Lowercase',
  'Capitalize',
] as const;

const utilityTypeTips = UTILITY_TYPES.map((utilityType) => {
  return createInlineTip(
    `${
      utilityType.toLowerCase() as Lowercase<typeof utilityType>
    }-utility-type`,
    z.object({
      typeName: z.object({
        name: z.literal(utilityType),
        type: z.literal('Identifier'),
        loc: SourceLocationSchema,
      }),
    }),
    ({ parse, push }) => {
      return {
        TSTypeReference(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.typeName.loc);
          });
        },
      };
    },
  );
});

/**
 * As you add tips, add them here!G
 */
export const allTips = [
  declareGlobal,
  genericSlotsInFunctions,
  functionReturnType,
  interfaceDeclaration,
  interfaceWithGenerics,
  interfaceWithMultipleGenerics,
  multipleGenericSlotsInFunctions,
  optionalObjectProperty,
  typeAliasDeclaration,
  readonlyProperty,
  mappedType,
  kInKeyof,
  numberIndexedAccess,
  tupleType,
  typeAliasWithGenerics,
  typeAliasWithMultipleGenerics,
  passingGenericsToTypes,
  interfaceWindowInDeclareGlobal,
  spreadIntoTupleType,
  keyofIndexedAccess,
  templateLiteral,
  createInlineTip(
    'as-assertion',
    z.object({
      typeAnnotation: z.object({
        loc: SourceLocationSchema,
        typeName: z
          .object({
            name: z
              .any()
              .optional()
              .refine((name) => {
                if (name === 'const') return false;
              }),
          })
          .optional(),
      }),
    }),
    ({ parse, push }) => {
      return {
        TSAsExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.typeAnnotation.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'null-keyword',
    z.object({ loc: SourceLocationSchema }),
    ({ parse, push }) => {
      return {
        TSNullKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'in-operator-narrowing',
    z.object({
      left: z.object({
        type: z.literal('StringLiteral'),
      }),
      operator: z.literal('in'),
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        BinaryExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'type-predicate',
    z.object({ loc: SourceLocationSchema }),
    ({ parse, push }) => {
      return {
        TSTypePredicate(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'never-keyword',
    z.object({ loc: SourceLocationSchema }),
    ({ parse, push }) => {
      return {
        TSNeverKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'non-null-expression',
    z.object({ loc: SourceLocationSchema }),
    ({ parse, push }) => {
      return {
        TSNonNullExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'undefined-keyword',
    z.object({ loc: SourceLocationSchema }),
    ({ parse, push }) => {
      return {
        TSUndefinedKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'literal-type',
    z.object({ loc: SourceLocationSchema }),
    ({ parse, push }) => {
      return {
        TSLiteralType(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'array-type',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSArrayType(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'basic-types',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSStringKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
        TSNumberKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
        TSBooleanKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'bigint',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSBigIntKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'any-type',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSAnyKeyword(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'as-const-on-object',
    z.object({
      expression: z.object({
        type: z.literal('ObjectExpression'),
      }),
      typeAnnotation: z.object({
        loc: SourceLocationSchema,
        typeName: z.object({
          name: z.literal('const'),
        }),
      }),
    }),
    ({ parse, push }) => {
      return {
        TSAsExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.typeAnnotation.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'remapping-in-mapped-type',
    z.object({
      nameType: z.object({
        loc: SourceLocationSchema,
      }),
    }),
    ({ parse, push }) => {
      return {
        TSMappedType(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.nameType.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'union-type',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSUnionType(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'infer',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSInferType(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'ts-object-type',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSTypeLiteral(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'typing-function-parameters',
    z.object({
      params: z
        .array(
          z
            .object({
              typeAnnotation: z.object({
                loc: SourceLocationSchema,
              }),
            })
            .or(z.any().transform(() => undefined)),
        )
        .min(1)
        .transform((arr) => arr.filter(Boolean)),
    }),
    ({ parse, push }) => {
      return {
        FunctionDeclaration(path) {
          safeParse(() => {
            const node = parse(path.node);
            for (const param of node.params) {
              push(param!.typeAnnotation.loc);
            }
          });
        },
        ArrowFunctionExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            for (const param of node.params) {
              push(param!.typeAnnotation.loc);
            }
          });
        },
        FunctionExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            for (const param of node.params) {
              push(param!.typeAnnotation.loc);
            }
          });
        },
      };
    },
  ),
  createInlineTip(
    'infer-used-in-type-parameters',
    z.object({
      params: z
        .array(
          z.union([
            z.object({
              type: z.literal('TSInferType'),
              loc: SourceLocationSchema,
            }),
            z.any().transform(() => undefined),
          ]),
        )
        .refine((arr) => {
          return arr.every((item) => item !== undefined);
        })
        .transform((arr) => {
          for (const item of arr) {
            if (item !== undefined) {
              return item;
            }
          }
        }),
    }),
    ({ parse, push }) => {
      return {
        TSTypeParameterInstantiation(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.params!.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'passing-types-to-call-expressions',
    z.object({
      typeParameters: z.object({
        loc: SourceLocationSchema,
        params: z
          .array(
            z.object({
              loc: SourceLocationSchema,
            }),
          )
          .min(1),
      }),
    }),
    ({ parse, push }) => {
      return {
        CallExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.typeParameters.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'keyof',
    z.object({
      operator: z.literal('keyof'),
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSTypeOperator(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'typeof',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSTypeQuery(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'as-const',
    z.object({
      typeAnnotation: z.object({
        type: z.literal('TSTypeReference'),
        typeName: z.object({
          loc: SourceLocationSchema,
          name: z.literal('const'),
        }),
      }),
    }),
    ({ parse, push }) => {
      return {
        TSAsExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.typeAnnotation.typeName.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'typeof-import',
    z.object({
      exprName: z.object({
        type: z.literal('TSImportType'),
        // isTypeOf: z.literal(true),
        loc: SourceLocationSchema,
      }),
    }),
    ({ parse, push }) => {
      return {
        TSTypeQuery(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.exprName.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'template-as-const',
    z.object({
      loc: SourceLocationSchema,
      expression: z.object({
        type: z.literal('TemplateLiteral'),
      }),
      typeAnnotation: z.object({
        type: z.literal('TSTypeReference'),
        typeName: z.object({
          loc: SourceLocationSchema,
          name: z.literal('const'),
        }),
      }),
    }),
    ({ parse, push }) => {
      return {
        TSAsExpression(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'variable-type-annotation',
    z.object({
      id: IdentifierSchema.extend({
        typeAnnotation: z.object({
          loc: SourceLocationSchema,
        }),
      }),
    }),
    ({ parse, push }) => {
      return {
        VariableDeclarator(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.id.typeAnnotation.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'conditional-type',
    z.object({
      loc: SourceLocationSchema,
    }),
    ({ parse, push }) => {
      return {
        TSConditionalType(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  createInlineTip(
    'nested-conditional-type',
    z
      .object({
        loc: SourceLocationSchema,
      })
      .and(
        z.union([
          z.object({
            trueType: z.object({
              type: z.literal('TSConditionalType'),
              loc: SourceLocationSchema,
            }),
          }),
          z.object({
            falseType: z.object({
              loc: SourceLocationSchema,
              type: z.literal('TSConditionalType'),
            }),
          }),
        ]),
      ),
    ({ parse, push }) => {
      return {
        TSConditionalType(path) {
          safeParse(() => {
            const node = parse(path.node);
            push(node.loc);
          });
        },
      };
    },
  ),
  ...utilityTypeTips,
];

export const tipsAsStrings = allTips.map((tip) => tip.type);

export type TipType = typeof allTips[number]['type'];
export type Tip = { type: TipType; loc: t.SourceLocation };
