import { SourceLocation } from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  id: z.object({
    name: z.literal('global'),
    loc: SourceLocationSchema,
  }),
  declare: z.literal(true),
  global: z.literal(true),
});

export const declareGlobal = createTip<{
  type: 'declare-global';
  loc: SourceLocation;
}>((push) => {
  return {
    TSModuleDeclaration(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'declare-global',
          loc: node.id.loc,
        });
      });
    },
  };
});
