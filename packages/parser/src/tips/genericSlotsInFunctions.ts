import { createTip } from '../createTip';
import * as t from '@babel/types';
import { safeParse, SourceLocationSchema } from '../utils';
import { z } from 'zod';

const schema = z.object({
  loc: SourceLocationSchema,
  typeParameters: z.object({
    type: z.literal('TSTypeParameterDeclaration'),
    params: z
      .array(
        z.object({
          type: z.literal('TSTypeParameter'),
        }),
      )
      .min(1),
  }),
});

export const genericSlotsInFunctions = createTip<{
  type: 'generic-slots-in-functions';
  loc: t.SourceLocation;
}>((push) => {
  return {
    ArrowFunctionExpression: (path) => {
      safeParse(() => {
        const { loc } = schema.parse(path.node);
        push({
          type: 'generic-slots-in-functions',
          loc,
        });
      });
    },
    FunctionDeclaration: (path) => {
      safeParse(() => {
        const { loc } = schema.parse(path.node);
        push({
          type: 'generic-slots-in-functions',
          loc,
        });
      });
    },
  };
});
