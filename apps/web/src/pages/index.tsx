import { ErrorInfo, parseErrors } from "@ts-error-messages/engine";
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";
import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import * as path from "path";
import React from "react";
import ReactMarkdown from "react-markdown";
import { z } from "zod";

export default function Web(props: { error: string; errors: ErrorInfo[] }) {
  const router = useRouter();

  console.log(props.errors);
  return (
    <div className="px-6 py-6 pt-0 pb-20">
      <div className="py-20">
        <h2 className="mb-8 text-xl font-medium tracking-tight text-center text-indigo-600">
          TypeScript errors in Plain English
        </h2>
        <h1 className="text-6xl font-bold tracking-tight text-center">
          TypeScript Error Translator
        </h1>
        <form
          className="flex flex-col items-center mt-12"
          onSubmit={(e) => {
            e.preventDefault();

            const error = new FormData(e.currentTarget).get("error") as string;

            router.push("?error=" + compressToEncodedURIComponent(error));
          }}
        >
          <textarea
            className="block w-full h-32 max-w-lg px-4 py-3 mb-6 font-mono rounded resize-y bg-indigo-50 focus:outline-none focus:ring-4 ring-yellow-400"
            name="error"
            autoFocus
            defaultValue={props.error}
          ></textarea>
          <div>
            <button className="px-6 py-2 font-semibold tracking-tight text-white rounded from-purple-500 to-indigo-600 bg-gradient-to-r focus:outline-none focus:ring-4 ring-yellow-400">
              Submit your Error
            </button>
          </div>
        </form>
      </div>

      <div className="max-w-2xl mx-auto space-y-16 text-xl leading-relaxed text-gray-800">
        {props.errors?.map((error, index) => {
          return (
            <div>
              <div className="prose prose-code:before:hidden prose-code:after:hidden">
                {/* <span className="inline-block px-2 py-1 mb-2 text-xs text-indigo-900 bg-indigo-100 rounded">
                  #{error.code}
                </span> */}
                <h1>Error #{index + 1}</h1>
                <div className="relative p-4 py-3 font-mono text-sm leading-relaxed text-gray-100 bg-gray-800 rounded">
                  {error.parseInfo.rawError}
                </div>
                {error.improvedError && (
                  <>
                    <h2>Translation</h2>
                    <div className="p-4 py-3 font-light text-gray-100 bg-gray-800 rounded prose-code:text-white prose-p:m-0">
                      <ReactMarkdown>
                        {error.improvedError.excerpt}
                      </ReactMarkdown>
                    </div>
                    <h2>Explanation</h2>
                    <ReactMarkdown>{error.improvedError?.body}</ReactMarkdown>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* <div className="max-w-xl mx-auto space-y-6">
        {props?.errors.map((error) => {
          return (
            <div className="relative space-y-6">
              <div>
                <h3 className="mb-2 text-xl font-semibold">Old</h3>
                <p className="pt-0 font-mono text-sm">
                  {error.parseInfo.rawError}
                </p>
              </div>
              <div>
                <h3 className="mb-2 text-xl font-semibold">Translation</h3>
                {error.improvedError && (
                  <div className="pt-0">
                    <ReactMarkdown>
                      {error.improvedError?.excerpt}
                    </ReactMarkdown>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
      {props?.errors.map((error) => {
        if (!error.improvedError) return null;
        return (
          <div className="prose">
            <h1>{error.code}</h1>
            <ReactMarkdown>{error.improvedError.excerpt}</ReactMarkdown>
            <ReactMarkdown>{error.improvedError.body}</ReactMarkdown>
          </div>
        );
      })} */}
    </div>
  );
}

const Query = z.object({
  error: z.string().optional(),
});

export const getServerSideProps = (ctx: GetServerSidePropsContext) => {
  const query = Query.parse(ctx.query);
  if (query.error) {
    const decodedError = decompressFromEncodedURIComponent(query.error)!;
    return {
      props: {
        errors: parseErrors(decodedError, {
          dir: path.resolve(process.cwd(), "../../packages/engine/errors"),
        }),
        error: decodedError,
      },
    };
  }
  return {
    props: {
      errors: [],
      error: `Conversion of type 'string' to type 'string[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.`,
    },
  };
};
