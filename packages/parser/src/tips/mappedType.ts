import { createTip } from '../createTip';
import * as t from '@babel/types';
import { z } from 'zod';
import { IdentifierSchema, safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  loc: SourceLocationSchema,
});

export const mappedType = createTip('mapped-type', (push) => {
  return {
    TSMappedType(path) {
      safeParse(() => {
        const node = Schema.parse(path.node);
        push({
          type: 'mapped-type',
          loc: node.loc,
        });
      });
    },
  };
});
