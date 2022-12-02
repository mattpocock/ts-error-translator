import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  indexType: z.object({
    loc: SourceLocationSchema,
    type: z.literal('TSTypeOperator'),
    operator: z.literal('keyof'),
  }),
});

export const keyofIndexedAccess = createTip<{
  type: 'keyof-indexed-access';
  loc: t.SourceLocation;
}>((push) => {
  return {
    TSIndexedAccessType(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);

        push({
          type: 'keyof-indexed-access',
          loc: node.indexType.loc,
        });
      });
    },
  };
});
