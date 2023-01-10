import { SourceLocation } from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const ReadonlyObjectProperty = z.object({
  loc: SourceLocationSchema,
  key: IdentifierSchema,
  readonly: z.literal(true),
});

export const readonlyProperty = createTip(
  'readonly-object-property',
  (push) => {
    return {
      TSPropertySignature(path) {
        safeParse(() => {
          const node = ReadonlyObjectProperty.parse(path.node);
          push({
            type: 'readonly-object-property',
            loc: node.key.loc,
          });
        });
      },
    };
  },
);
