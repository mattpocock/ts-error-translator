import { SourceLocation } from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  id: z.object({
    name: z.literal('global'),
  }),
  declare: z.literal(true),
  global: z.literal(true),
  body: z.object({
    body: z
      .array(
        z
          .object({
            type: z.literal('TSInterfaceDeclaration'),
            id: z.object({
              name: z.literal('Window'),
              loc: SourceLocationSchema,
            }),
          })
          .or(z.any().transform(() => undefined)),
      )
      .nonempty()
      .transform(
        (arr) =>
          arr.filter((x) => {
            return x !== undefined;
          })[0]!,
      ),
  }),
});

export const interfaceWindowInDeclareGlobal = createTip<{
  type: 'interface-window-in-declare-global';
  loc: SourceLocation;
}>((push) => {
  return {
    TSModuleDeclaration(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'interface-window-in-declare-global',
          loc: node.body.body.id.loc,
        });
      });
    },
  };
});
