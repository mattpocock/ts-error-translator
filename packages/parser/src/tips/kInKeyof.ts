import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  typeParameter: z.object({
    type: z.literal('TSTypeParameter'),
    constraint: z.object({
      operator: z.literal('keyof'),
    }),
    loc: SourceLocationSchema,
  }),
});

export const kInKeyof = createTip('k-in-keyof', (push) => {
  return {
    TSMappedType(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'k-in-keyof',
          loc: node.typeParameter.loc,
        });
      });
    },
  };
});
