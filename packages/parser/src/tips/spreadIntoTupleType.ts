import * as t from '@babel/types';
import { z } from 'zod';
import { createTip } from '../createTip';
import { safeParse, SourceLocationSchema } from '../utils';

const Schema = z.object({
  // elementTypes: z
  //   .array(
  //     z.union([
  //       z.object({
  //         type: z.literal('TSRestType'),
  //         loc: SourceLocationSchema,
  //       }),
  //       z.any().transform(() => undefined),
  //     ]),
  //   )
  //   .transform((arr) =>
  //     arr.filter((x): x is NonNullable<typeof x> => x !== undefined),
  //   ),
});

export const spreadIntoTupleType = createTip<{
  type: 'spread-into-tuple-type';
  loc: t.SourceLocation;
}>((push) => {
  return {
    TSTupleType(path) {
      safeParse(() => {
        // TODO
        // const node = Schema.parse(path.node);
        // push({
        //   type: 'spread-into-tuple-type',
        //   loc: node.elementTypes[0].loc,
        // });
      });
    },
  };
});
