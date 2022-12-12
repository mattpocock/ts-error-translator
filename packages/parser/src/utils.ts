import { z } from 'zod';

export const SourceLocationSchema = z.object({
  start: z.object({
    line: z.number(),
    column: z.number(),
  }),
  end: z.object({
    line: z.number(),
    column: z.number(),
  }),
});

export const TypeReferenceWithName = z.object({
  start: z.object({
    line: z.number(),
    column: z.number(),
  }),
  end: z.object({
    line: z.number(),
    column: z.number(),
  }),
});

export const safeParse = (fn: () => void) => {
  try {
    fn();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return;
    }
    throw error;
  }
};

export const IdentifierSchema = z.object({
  loc: SourceLocationSchema,
  name: z.string(),
});
