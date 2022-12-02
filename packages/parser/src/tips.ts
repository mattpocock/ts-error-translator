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
];

export type Tip = ReturnType<typeof allTips[number]>['type'] | _Tip;

type _Tip =
  | {
      type: 'readonly-object-property';
      loc: t.SourceLocation;
    }
  | {
      type: 'variable-type-annotation';
      loc: t.SourceLocation;
    }
  | {
      type: 'conditional-type';
      loc: t.SourceLocation;
    }
  | {
      type: 'nested-conditional-type';
      loc: t.SourceLocation;
    };
