import { SourceLocation } from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  typeName: z.object({
    loc: SourceLocationSchema,
    name: z.literal('Promise'),
  }),
  typeParameters: z.object({
    params: z.array(z.any()).min(1),
  }),
});

export const promiseType = createTip<{
  type: 'promise-type';
  loc: SourceLocation;
}>((push) => {
  return {
    TSTypeReference(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'promise-type',
          loc: node.typeName.loc,
        });
      });
    },
  };
});
