import tsErrorMessages from './tsErrorMessages.json';
import * as Diagnostic from './rfc/Diagnostic';

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

let regexCache: Record<string, RegExp> = {};

const toRegex = (key: string): RegExp => {
  if (regexCache[key]) {
    return regexCache[key];
  }
  const regex = escapeRegExp(key).replace(/\\\{(\d)\\\}/g, '(.{1,})');

  regexCache[key] = new RegExp(regex, 'g');

  return regexCache[key];
};

const toNonGlobalRegex = (key: string): RegExp => {
  const adjustedKey = key + '_non_global';
  if (regexCache[adjustedKey]) {
    return regexCache[adjustedKey];
  }
  const regex = escapeRegExp(key).replace(/\\\{(\d)\\\}/g, '(.{1,})');

  regexCache[adjustedKey] = new RegExp(regex);

  return regexCache[adjustedKey];
};

interface ParseInfo {
  rawError: string;
  startIndex: number;
  endIndex: number;
  items: string[];
}

export interface ErrorInfoWithoutImprovedError {
  code: number;
  error: string;
  parseInfo: ParseInfo;
}

export interface ErrorInfo extends ErrorInfoWithoutImprovedError {
  improvedError: {
    body: string;
    excerpt: string;
  } | null;
}

export interface ParseErrorsOpts {}

export const parseErrors = (
  message: string,
): ErrorInfoWithoutImprovedError[] => {
  /**
   * Just a facade to that's compatible with the existing implementation to demonstrate how it works
   * without breaking current app.
   */
  return Diagnostic.ParseMessage(message).map<ErrorInfoWithoutImprovedError>(
    (diagnostic) => ({
      code: diagnostic.code,
      error: diagnostic.message,
      parseInfo: {
        startIndex: 0,
        endIndex: 0,
        rawError: diagnostic.matched,
        items: diagnostic.parameters,
      },
    }),
  );

  const errorMessageByKey: Record<string, ErrorInfoWithoutImprovedError> = {};

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

          let [, ...items] = matchElem.match(nonGlobalRegex)!;

          items = Array.from(new Set(items));

          const errorObj: ErrorInfoWithoutImprovedError = {
            code: tsErrorMessages[newError].code,
            error: newError,
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
