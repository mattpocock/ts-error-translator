import { parseErrors } from "@ts-error-messages/engine";
import { InferGetStaticPropsType } from "next";
import * as path from "path";
import ReactMarkdown from "react-markdown";

export default function Web(
  props: InferGetStaticPropsType<typeof getStaticProps>,
) {
  if (typeof window !== "undefined") {
    console.log(props.errors);
  }
  return (
    <div>
      {props.errors.map((error) => {
        if (!error.improvedError) return null;
        return (
          <>
            <ReactMarkdown>{error.improvedError.excerpt}</ReactMarkdown>
            <ReactMarkdown>{error.improvedError.body}</ReactMarkdown>
          </>
        );
      })}
    </div>
  );
}

export const getStaticProps = () => {
  return {
    props: {
      errors: parseErrors(
        `Conversion of type 'string' to type 'string[]' may be a mistake because neither type sufficiently overlaps with the other. If this was intentional, convert the expression to 'unknown' first.`,
        {
          dir: path.resolve(process.cwd(), "../../packages/engine/errors"),
        },
      ),
    },
  };
};
