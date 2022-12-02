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
import { promiseType } from './tips/promiseType';
import { interfaceWindowInDeclareGlobal } from './tips/interfaceWindowInDeclareGlobal';
import { declareGlobal } from './tips/declareGlobal';
import { spreadIntoTupleType } from './tips/spreadIntoTupleType';
import { keyofIndexedAccess } from './tips/keyofIndexedAccess';
import { templateLiteral } from './tips/templateLiteral';
import { createInlineTip } from './createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from './utils';
import { z } from 'zod';

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
  promiseType,
  interfaceWindowInDeclareGlobal,
  spreadIntoTupleType,
  keyofIndexedAccess,
  templateLiteral,
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
];

export const tipsAsStrings = allTips.map((tip) => tip.type);

export type TipType = typeof allTips[number]['type'];
export type Tip = { type: TipType; loc: t.SourceLocation };
