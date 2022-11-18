import { createTip } from '../createTip';
import * as t from '@babel/types';
import { safeParse, SourceLocationSchema } from '../utils';
import { z } from 'zod';

const schema = z.object({
  typeParameters: z.object({
    type: z.literal('TSTypeParameterDeclaration'),
    params: z
      .array(
        z.object({
          type: z.literal('TSTypeParameter'),
          loc: SourceLocationSchema,
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
        const result = schema.parse(path.node);

        push({
          type: 'generic-slots-in-functions',
          loc: result.typeParameters.params[0].loc,
        });
      });
    },
    FunctionDeclaration: (path) => {
      safeParse(() => {
        const result = schema.parse(path.node);

        push({
          type: 'generic-slots-in-functions',
          loc: result.typeParameters.params[0].loc,
        });
      });
    },
  };
});
