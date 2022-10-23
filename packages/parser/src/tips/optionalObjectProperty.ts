import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  loc: SourceLocationSchema,
  key: IdentifierSchema,
  optional: z.literal(true),
});

export const optionalObjectProperty = createTip<{
  type: 'optional-object-property';
  propertyName: string;
  loc: t.SourceLocation;
}>((push) => {
  return {
    TSPropertySignature(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'optional-object-property',
          propertyName: node.key.name,
          loc: node.loc,
        });
      });
    },
  };
});
