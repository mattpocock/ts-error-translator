import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  literal: z.object({
    type: z.literal('TemplateLiteral'),
    loc: SourceLocationSchema,
  }),
});

export const templateLiteral = createTip('template-literal', (push) => {
  return {
    TSLiteralType(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);

        push({
          type: 'template-literal',
          loc: node.literal.loc,
        });
      });
    },
  };
});
