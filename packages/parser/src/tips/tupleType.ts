import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  loc: SourceLocationSchema,
});

export const tupleType = createTip<{
  type: 'tuple-type';
  loc: t.SourceLocation;
}>((push) => {
  return {
    TSTupleType(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'tuple-type',
          loc: node.loc,
        });
      });
    },
  };
});
