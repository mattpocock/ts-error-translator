import { createTip } from '../createTip';
import * as t from '@babel/types';
import { z } from 'zod';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const InterfaceSchema = z.object({
  loc: SourceLocationSchema,
  id: IdentifierSchema,
});

export const interfaceDeclaration = createTip(
  'interface-declaration',
  (push) => {
    return {
      TSInterfaceDeclaration(path) {
        safeParse(() => {
          const node = InterfaceSchema.parse(path.node);
          push({
            type: 'interface-declaration',
            loc: node.id.loc,
          });
        });
      },
    };
  },
);
