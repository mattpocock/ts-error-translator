import { z } from "zod";

export const Error = z.object({
  code: z.union([z.string(), z.number()]),
  error: z.string(),
  parseInfo: z.object({
    startIndex: z.number(),
    endIndex: z.number(),
    rawError: z.string(),
  }),
  improvedError: z
    .object({
      body: z.string(),
      excerpt: z.string(),
    })
    .nullable(),
});

export const ErrorResult = z.object({
  errors: z.array(Error),
  rawError: z.string(),
});

export type TError = z.infer<typeof Error>;
export type TErrorResult = z.infer<typeof ErrorResult>;

/**
 * Type '{ rawError: string; startIndex: number; endIndex: number; items: string[]; }' is not assignable to type 'ParseInfo'.
  Object literal may only specify known properties, and 'rawError' does not exist in type 'ParseInfo'.
 */
