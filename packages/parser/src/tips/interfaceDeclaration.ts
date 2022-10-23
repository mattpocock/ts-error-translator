import { createTip } from '../createTip';
import * as t from '@babel/types';
import { z } from 'zod';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const InterfaceSchema = z.object({
  loc: SourceLocationSchema,
  id: IdentifierSchema,
});

export const interfaceDeclaration = createTip<{
  /**
   * Learning what an interface Whatever {} is
   */
  type: 'interface-declaration';
  name: string;
  loc: t.SourceLocation;
}>((push) => {
  return {
    TSInterfaceDeclaration(path) {
      safeParse(() => {
        const node = InterfaceSchema.parse(path.node);
        push({
          type: 'interface-declaration',
          name: node.id.name,
          loc: node.id.loc,
        });
      });
    },
  };
});
