import { getImprovedMessage } from "./getImprovedMessage";
import tsErrorMessages from "./tsErrorMessages.json";

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
}

let regexCache: Record<string, RegExp> = {};

const toRegex = (key: string): RegExp => {
  if (regexCache[key]) {
    return regexCache[key];
  }
  const regex = escapeRegExp(key).replace(/'\\\{(\d)\\\}'/g, "'(.{1,})'");

  regexCache[key] = new RegExp(regex, "g");

  return regexCache[key];
};

const toNonGlobalRegex = (key: string): RegExp => {
  const adjustedKey = key + "_non_global";
  if (regexCache[adjustedKey]) {
    return regexCache[adjustedKey];
  }
  const regex = escapeRegExp(key).replace(/'\\\{(\d)\\\}'/g, "'(.{1,})'");

  regexCache[adjustedKey] = new RegExp(regex);

  return regexCache[adjustedKey];
};

interface ParseInfo {
  rawError: string;
  startIndex: number;
  endIndex: number;
  items: string[];
}

export interface ErrorInfo {
  code: number;
  error: string;
  parseInfo: ParseInfo;
  improvedError: {
    body: string;
    excerpt: string;
  } | null;
}

export interface ParseErrorsOpts {
  dir?: string;
}

export const parseErrors = (
  message: string,
  opts?: ParseErrorsOpts,
): ErrorInfo[] => {
  const dir = opts?.dir ?? process.cwd();
  // if ((tsErrorMessages as Record<string, any>)[message]) {
  //   const code = (tsErrorMessages as Record<string, any>)[message].code;
  //   return [
  //     {
  //       error: message,
  //       code: (tsErrorMessages as Record<string, any>)[message].code,
  //       parseInfo,
  //       improvedError: getImprovedMessage(dir, code, parseInfo.items),
  //     },
  //   ];
  // }

  const errorMessageByKey: Record<string, ErrorInfo> = {};

  (Object.keys(tsErrorMessages) as (keyof typeof tsErrorMessages)[]).forEach(
    (newError) => {
      const regex = toRegex(newError);

      const match = message.match(regex);

      if (match) {
        match.forEach((matchElem) => {
          const startIndex = message.indexOf(matchElem);
          const endIndex = startIndex ?? 0 + matchElem.length;
          const key = `${startIndex}_${endIndex}`;

          const nonGlobalRegex = toNonGlobalRegex(newError);

          const [, ...items] = matchElem.match(nonGlobalRegex)!;

          const errorObj: ErrorInfo = {
            code: tsErrorMessages[newError].code,
            error: newError,
            improvedError: getImprovedMessage(
              dir,
              tsErrorMessages[newError].code,
              items,
            ),
            parseInfo: {
              rawError: matchElem,
              startIndex,
              endIndex,
              items,
            },
          };

          if (errorMessageByKey[key]) {
            const existingRule = errorMessageByKey[key];

            /**
             * If the new rule is longer than the existing rule,
             * replace the existing rule with the new rule.
             */
            errorMessageByKey[key] =
              newError.length > existingRule.error.length
                ? errorObj
                : existingRule;
          } else {
            errorMessageByKey[key] = errorObj;
          }
        });
      }
    },
  );

  return Object.values(errorMessageByKey).sort(
    (a, b) => a.parseInfo.startIndex - b.parseInfo.startIndex,
  );
};
