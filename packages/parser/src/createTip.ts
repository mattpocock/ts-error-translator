import { TraverseOptions } from '@babel/traverse';
import { SourceLocation } from '@babel/types';

export interface TipResult<TTipType extends string> {
  type: TTipType;
  opts: TraverseOptions;
}

type TipFromType<TTipType extends string> = {
  type: TTipType;
  loc: SourceLocation;
};

export const createTip =
  <TTipType extends string>(
    type: TTipType,
    createOpts: (push: (tip: TipFromType<TTipType>) => void) => TraverseOptions,
  ) =>
  (push: (tip: TipFromType<TTipType>) => void): TipResult<TTipType> => {
    return { opts: createOpts(push), type };
  };
