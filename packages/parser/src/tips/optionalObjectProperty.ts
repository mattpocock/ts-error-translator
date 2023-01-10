import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  loc: SourceLocationSchema,
  key: IdentifierSchema,
  optional: z.literal(true),
});

export const optionalObjectProperty = createTip(
  'optional-object-property',
  (push) => {
    return {
      TSPropertySignature(path) {
        safeParse(() => {
          const node = Schema.parse(path.node);
          push({
            type: 'optional-object-property',
            loc: node.key.loc,
          });
        });
      },
    };
  },
);
