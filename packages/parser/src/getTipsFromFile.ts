import { parse } from '@babel/parser';
import traverse, { TraverseOptions } from '@babel/traverse';
import * as t from '@babel/types';
import { z } from 'zod';
import { allTips, Tip } from './tips';
import { IdentifierSchema, safeParse, SourceLocationSchema } from './utils';

const NestedConditionalType = z
  .object({
    loc: SourceLocationSchema,
  })
  .and(
    z.union([
      z.object({
        trueType: z.object({
          type: z.literal('TSConditionalType'),
          loc: SourceLocationSchema,
        }),
      }),
      z.object({
        falseType: z.object({
          loc: SourceLocationSchema,
          type: z.literal('TSConditionalType'),
        }),
      }),
    ]),
  );

const TypeSchema = z.object({
  loc: SourceLocationSchema,
  id: IdentifierSchema,
});

const IdentifierWithTypeAnnotationSchema = IdentifierSchema.extend({
  typeAnnotation: z.object({
    loc: SourceLocationSchema,
  }),
});

const VariableDeclaratorSchema = z.object({
  id: IdentifierWithTypeAnnotationSchema,
});

const ReadonlyObjectProperty = z.object({
  loc: SourceLocationSchema,
  key: IdentifierSchema,
  readonly: z.literal(true),
});

type TipFunctions = Partial<
  Record<t.Node['type'], Array<(opts: any[]) => void>>
>;

export const parseFileContents = (fileContents: string) => {
  const parseResult = parse(fileContents, {
    sourceType: 'module',
    plugins: [
      'typescript',
      'jsx',
      ['decorators', { decoratorsBeforeExport: false }],
    ],
  }) as t.File;

  return parseResult;
};

export const getTipsFromFile = (fileContents: string) => {
  const parseResult = parseFileContents(fileContents);
  const tips: Tip[] = [];

  const tipFunctions: TipFunctions = {};

  const push = (tip: Tip) => tips.push(tip);

  const opts: TraverseOptions = {
    TSTypeAliasDeclaration(path) {
      safeParse(() => {
        const node = TypeSchema.parse(path.node);
        tips.push({
          type: 'type-alias-declaration',
          name: node.id.name,
          loc: node.id.loc,
        });
      });
    },
    TSPropertySignature(path) {
      safeParse(() => {
        const node = ReadonlyObjectProperty.parse(path.node);
        tips.push({
          type: 'readonly-object-property',
          propertyName: node.key.name,
          loc: node.loc,
        });
      });
    },

    VariableDeclarator(path) {
      safeParse(() => {
        const node = VariableDeclaratorSchema.parse(path.node);
        tips.push({
          type: 'variable-type-annotation',
          loc: node.id.typeAnnotation.loc,
          variableName: node.id.name,
        });
      });
    },
    TSConditionalType(path) {
      safeParse(() => {
        const node = z.object({ loc: SourceLocationSchema }).parse(path.node);
        tips.push({
          type: 'conditional-type',
          loc: node.loc,
        });
      });

      safeParse(() => {
        const node = NestedConditionalType.parse(path.node);

        tips.push({
          type: 'nested-conditional-type',
          loc: node.loc,
        });
      });
    },
  };

  allTips.forEach((tipFunction) => {
    const { opts } = tipFunction(push);

    Object.entries(opts).forEach(([_key, func]) => {
      const key = _key as keyof typeof tipFunctions;
      if (!tipFunctions[key]) {
        tipFunctions[key] = [];
      }

      tipFunctions[key]!.push(func);
    });
  });

  traverse(parseResult, tipFunctionsToTraverseOptions(tipFunctions, opts));

  return tips;
};

const tipFunctionsToTraverseOptions = (
  tipFunctions: TipFunctions,
  initialTraverseOptions: TraverseOptions,
): TraverseOptions => {
  const opts: TraverseOptions = initialTraverseOptions;

  Object.entries(tipFunctions).forEach(([key, funcs]) => {
    (opts as any)[key] = (path: any) => {
      funcs.forEach((func) => func(path));
    };
  });

  return opts;
};
