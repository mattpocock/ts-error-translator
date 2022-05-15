import {
  ErrorInfo,
  parseErrors,
  getImprovedMessageFromMarkdown,
} from '@ts-error-messages/engine';
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from 'lz-string';
import { GetServerSidePropsContext } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';
import * as path from 'path';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import { z } from 'zod';

export default function Web(props: { error: string; errors: ErrorInfo[] }) {
  const router = useRouter();

  const firstExcerpt = props.errors?.[0]?.improvedError?.excerpt;
  const firstErrorCode = props.errors?.[0]?.code;

  const title = `TypeScript Error Translator${
    firstErrorCode ? ` | Code #${firstErrorCode}` : ''
  }`;
  const description = firstExcerpt || 'Translate TypeScript Errors to plain English.';

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta
          name="description"
          content={description}
        />

        <meta property="og:type" content="website" />
        <meta
          property="og:url"
          content={`https://ts-error-translator.vercel.app`}
        />
        <meta property="og:title" content={title} />
        <meta
          property="og:description"
          content={description}
        />
        <meta
          property="og:image"
          content={`https://ts-error-translator.vercel.app/og-image.png`}
        />

        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:image"
          content={`https://ts-error-translator.vercel.app/og-image.png`}
        />
        <meta name="twitter:title" content={title} />
        <meta
          name="twitter:description"
          content={description}
        />
        <meta property="twitter:domain" content="vercel.app" />
        <meta
          property="twitter:url"
          content="https://ts-error-translator.vercel.app"
        />
      </Head>
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

              const error = new FormData(e.currentTarget).get(
                'error',
              ) as string;

              router.push('?error=' + compressToEncodedURIComponent(error));
            }}
          >
            <textarea
              className="block w-full h-36 max-w-lg px-4 py-3 mb-6 font-mono rounded resize-y bg-indigo-50 focus:outline-none focus:ring-4 ring-yellow-400"
              name="error"
              autoFocus
              defaultValue={props.error}
            />
            <div>
              <button className="px-6 py-2 font-semibold tracking-tight text-white rounded from-purple-500 to-indigo-600 bg-gradient-to-r focus:outline-none focus:ring-4 ring-yellow-400">
                Submit your Error
              </button>
            </div>
          </form>
        </div>

        <div className="max-w-2xl mx-auto space-y-16 text-xl leading-relaxed text-gray-800">
          {props.errors?.map((error, index, array) => {
            return (
              <div>
                <div className="prose prose-code:before:hidden prose-code:after:hidden">
                  {/* <span className="inline-block px-2 py-1 mb-2 text-xs text-indigo-900 bg-indigo-100 rounded">
                  #{error.code}
                </span> */}
                  <h1>Error #{array.length - index}</h1>
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
                  {!error.improvedError && (
                    <>
                      <h2>Translation</h2>
                      <p>
                        Could not find a translation for error code{' '}
                        <span className="font-semibold">#{error.code}</span>:
                      </p>
                      <code>{error.error}</code>
                      <p>
                        <a
                          href="https://github.com/mattpocock/ts-error-translator/blob/main/CONTRIBUTING.md"
                          target="_blank"
                          rel="noreferrer"
                        >
                          Add a translation
                        </a>
                      </p>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </>
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
        errors: parseErrors(decodedError)
          .reverse()
          .map((error): ErrorInfo => {
            return {
              ...error,
              improvedError: getImprovedMessageFromMarkdown(
                path.resolve(process.cwd(), '../../packages/engine/errors'),
                error.code,
                error.parseInfo.items,
              ),
            };
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
