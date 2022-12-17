import { TraverseOptions } from '@babel/traverse';
import { SourceLocation } from '@babel/types';
import { z } from 'zod';

export type TipFromType<TTipType extends string> = {
  type: TTipType;
  loc: SourceLocation;
};

export const createTip = <TTipType extends string>(
  type: TTipType,
  createOpts: (push: (tip: TipFromType<TTipType>) => void) => TraverseOptions,
) => {
  return {
    type,
    createOpts,
  };
};

const schema = z.object({});

export const createInlineTip = <
  TTipType extends string,
  ZodSchema extends z.ZodType,
>(
  type: TTipType,
  schema: ZodSchema,
  createOpts: (params: {
    push: (loc: SourceLocation) => void;
    parse: (val: unknown) => z.infer<ZodSchema>;
  }) => TraverseOptions,
) => {
  return {
    type,
    createOpts: (push: (tip: TipFromType<TTipType>) => void) => {
      return createOpts({
        push: (loc) => {
          push({ type, loc });
        },
        parse: schema.parse,
      });
    },
  };
};
