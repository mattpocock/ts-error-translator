import * as t from '@babel/types';
import { genericSlotsInFunctions } from './tips/genericSlotsInFunctions';
import { functionReturnType } from './tips/functionReturnType';
import { interfaceDeclaration } from './tips/interfaceDeclaration';
import { interfaceOrTypeWithGenerics } from './tips/interfaceOrTypeWithGenerics';
import { interfaceOrTypeWithMultipleGenerics } from './tips/interfaceOrTypeWithMultipleGenerics';
import { multipleGenericSlotsInFunctions } from './tips/multipleGenericSlotsInFunctions';
import { optionalObjectProperty } from './tips/optionalObjectProperty';

/**
 * As you add tips, add them here!
 */
export const allTips = [
  genericSlotsInFunctions,
  functionReturnType,
  interfaceDeclaration,
  interfaceOrTypeWithGenerics,
  interfaceOrTypeWithMultipleGenerics,
  multipleGenericSlotsInFunctions,
  optionalObjectProperty,
];

export type Tip = ReturnType<typeof allTips[number]>['_tip'] | _Tip;

type _Tip =
  /**
   * Learning what a type alias is
   */
  | {
      type: 'type-alias-declaration';
      name: string;
      loc: t.SourceLocation;
    }
  | {
      type: 'readonly-object-property';
      propertyName: string;
      loc: t.SourceLocation;
    }
  | {
      type: 'variable-type-annotation';
      loc: t.SourceLocation;
      variableName: string;
    }
  | {
      type: 'conditional-type';
      loc: t.SourceLocation;
    }
  | {
      type: 'nested-conditional-type';
      loc: t.SourceLocation;
    };
