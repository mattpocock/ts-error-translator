import { TraverseOptions } from '@babel/traverse';

export interface TipResult<TTip extends { type: string }> {
  _tip: TTip;
  opts: TraverseOptions;
}

export const createTip =
  <TTip extends { type: string }>(
    createOpts: (push: (tip: TTip) => void) => TraverseOptions,
  ) =>
  (push: (tip: TTip) => void) => {
    return { opts: createOpts(push) } as TipResult<TTip>;
  };
