import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  indexType: z.object({
    type: z.literal('TSNumberKeyword'),
    loc: SourceLocationSchema,
  }),
});

export const numberIndexedAccess = createTip<{
  type: 'number-indexed-access';
  loc: t.SourceLocation;
}>((push) => {
  return {
    TSIndexedAccessType(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'number-indexed-access',
          loc: node.indexType.loc,
        });
      });
    },
  };
});
