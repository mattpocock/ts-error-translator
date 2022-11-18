import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  loc: SourceLocationSchema,
  typeParameters: z.object({
    loc: SourceLocationSchema,
    params: z
      .array(
        z.object({
          type: z.literal('TSTypeParameter'),
        }),
      )
      .min(1),
  }),
});

export const interfaceWithGenerics = createTip<{
  type: 'interface-with-generics';
  loc: t.SourceLocation;
}>((push) => {
  return {
    TSInterfaceDeclaration(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'interface-with-generics',
          loc: node.typeParameters.loc,
        });
      });
    },
  };
});
