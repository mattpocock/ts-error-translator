import { createTip } from '../createTip';
import * as t from '@babel/types';
import { z } from 'zod';
import { safeParse, SourceLocationSchema } from '../utils';

const ReturnTypeAnnotationSchema = z.object({
  returnType: z.object({
    loc: SourceLocationSchema,
    typeAnnotation: z.object({
      loc: SourceLocationSchema,
    }),
  }),
});

export const functionReturnType = createTip('function-return-type', (push) => {
  return {
    ArrowFunctionExpression(path) {
      safeParse(() => {
        const node = ReturnTypeAnnotationSchema.parse(path.node);
        push({
          type: 'function-return-type',
          loc: node.returnType.typeAnnotation.loc,
        });
      });
    },
    FunctionDeclaration(path) {
      safeParse(() => {
        const node = ReturnTypeAnnotationSchema.parse(path.node);
        push({
          type: 'function-return-type',
          loc: node.returnType.typeAnnotation.loc,
        });
      });
    },
    FunctionExpression(path) {
      safeParse(() => {
        const node = ReturnTypeAnnotationSchema.parse(path.node);
        push({
          type: 'function-return-type',
          loc: node.returnType.typeAnnotation.loc,
        });
      });
    },
  };
});
