import { SourceLocation } from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  typeParameters: z.object({
    type: z.literal('TSTypeParameterInstantiation'),
    loc: SourceLocationSchema,
    params: z.array(z.any()).min(1),
  }),
});

export const passingGenericsToTypes = createTip<{
  type: 'passing-generics-to-types';
  loc: SourceLocation;
}>((push) => {
  return {
    TSTypeReference(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'passing-generics-to-types',
          loc: node.typeParameters.loc,
        });
      });
    },
  };
});
