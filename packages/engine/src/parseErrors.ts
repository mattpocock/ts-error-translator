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

  regexCache[key] = new RegExp(regex);

  return regexCache[key];
};

interface ParseInfo {
  rawError: string;
  startIndex: number;
  endIndex: number;
  items: string[];
}

interface TsErrorMessage {
  category: string;
  code: number;
  translate?: any
}

const parseErrorInfo = (errorToParse: string, regex: RegExp): ParseInfo => {
  const match = errorToParse.match(regex);

  if (!match || typeof match.index === "undefined") {
    throw new Error(`Could not parse error: ${errorToParse}`);
  }

  const startIndex = match.index;
  const endIndex = match.index + match[0].length;

  const [matchedError, ...items] = match;

  return {
    rawError: matchedError,
    startIndex,
    endIndex,
    items,
  };
};

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
  language?: string,
): ErrorInfo[] => {
  const dir = opts?.dir ?? process.cwd();
  if ((tsErrorMessages as Record<string, any>)[message]) {
    const code = (tsErrorMessages as Record<string, any>)[message].code;
    const parseInfo = parseErrorInfo(message, toRegex(message));
    return [
      {
        error: message,
        code: (tsErrorMessages as Record<string, any>)[message].code,
        parseInfo,
        improvedError: getImprovedMessage(dir, code, parseInfo.items),
      },
    ];
  }

  const errorMessageByKey: Record<string, keyof typeof tsErrorMessages> = {};

  (Object.keys(tsErrorMessages) as (keyof typeof tsErrorMessages)[]).forEach(
    (newError) => {
      const regex = toRegex(newError);

      const match = message.match(regex);

      if (match) {
        const key = `${match.index}${match.index ?? 0 + match[0].length}`;

        if (errorMessageByKey[key]) {
          const existingRule = errorMessageByKey[key];

          /**
           * If the new rule is longer than the existing rule,
           * replace the existing rule with the new rule.
           */
          errorMessageByKey[key] =
            newError.length > existingRule.length ? newError : existingRule;
        } else {
          errorMessageByKey[key] = newError as keyof typeof tsErrorMessages;
        }
      }
    },
  );

  return Object.values(errorMessageByKey)
    .map((error) => {
      const parseInfo = parseErrorInfo(message, toRegex(error));
      const tsErrorMessage: TsErrorMessage = tsErrorMessages[error]; 
      const code = tsErrorMessage.code;

      let response = {
        code,
        error: error,
        parseInfo,
        improvedError: getImprovedMessage(dir, code, parseInfo.items),
      };

      if(language && tsErrorMessage.translate) {
        response = {
          code,
          error: error,
          parseInfo: {
            endIndex: parseInfo.endIndex,
            items: parseInfo.items,
            rawError: tsErrorMessage.translate[language],
            startIndex: parseInfo.startIndex
          },
          improvedError: getImprovedMessage(dir, code, parseInfo.items),
        }
      }

      return response
    })
    .sort((a, b) => a.parseInfo.startIndex - b.parseInfo.startIndex);
};
