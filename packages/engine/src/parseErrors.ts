import tsErrorMessages from './tsErrorMessages.json';
import prettier from 'prettier';

type TsErrorMessageDb = Record<string, { code: number }>;

interface TSDiagnosticMatcher {
  regexGlobal: RegExp;
  regexLocal: RegExp;
  parameters: string[];
}

const DiagnosticHashMap = new Map<string, TSDiagnosticMatcher>();

const escapeRegex = /[.*+?^${}()|[\]\\]/g;

function escapeRegExp(str: string) {
  return str.replace(escapeRegex, '\\$&'); // $& means the whole matched string
}

const parameterRegex = /{(\d)}/g;
const escapedParameterRegex = /\\\{(\d)\\\}/g;

function getDiagnosticMatcher(text: string): TSDiagnosticMatcher {
  const existing = DiagnosticHashMap.get(text);

  if (existing) return existing;

  const regexSource = escapeRegExp(text).replace(escapedParameterRegex, '(.+)');
  const regexLocal = new RegExp(regexSource);
  const regexGlobal = new RegExp(regexSource, 'g');
  const parameters = text.match(parameterRegex) ?? [];

  const diagnosticMatcher = {
    regexLocal,
    regexGlobal,
    parameters,
  };

  DiagnosticHashMap.set(text, diagnosticMatcher);

  return diagnosticMatcher;
}

function associateMatchedParameters(
  parameters: string[],
  matchedParams: string[],
): (string | number)[] {
  const params: Record<string, string | number> = Object.create(null);

  for (let i = 0; i < matchedParams.length; i++) {
    const parameter = parameters[i];
    if (!params.parameter) {
      params[parameter] = matchedParams[i] ?? '';
    }
  }

  return Object.values(params);
}

const myTypeStarting = /^type MyType =/;
const newlineEnding = /\n$/g;
const semicolonEnding = /;$/g;

interface ParseInfo {
  rawError: string;
  startIndex: number;
  endIndex: number;
  items: (string | number)[];
  prettyItems: string[];
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

export const parseErrorsWithDb = async (
  db: TsErrorMessageDb,
  message: string,
) => {
  const errorMessageByKey: Record<string, ErrorInfoWithoutImprovedError> = {};

  const keys = Object.keys(db);

  for (const newError of keys) {
    const { regexLocal, regexGlobal, parameters } =
      getDiagnosticMatcher(newError);

    const match = message.match(regexGlobal);

    if (match) {
      for (const matchElem of match) {
        const startIndex = message.indexOf(matchElem);
        const endIndex = startIndex ?? 0 + matchElem.length;
        const key = `${startIndex}_${endIndex}`;

        const items = associateMatchedParameters(
          parameters,
          matchElem.match(regexLocal)?.slice(1) ?? [],
        );

        const prettyItems: string[] = [];

        for (const item of items) {
          try {
            const prettyItem = await prettier.format(`type MyType = ${item}`, {
              plugins: ['typescript'],
              parser: 'babel',
              singleQuote: true,
              printWidth: 60,
            });
            prettyItems.push(
              prettyItem
                .replace(myTypeStarting, '')
                .replace(newlineEnding, '')
                .replace(semicolonEnding, '')
                .trim(),
            );
          } catch (e) {
            prettyItems.push(`${item}`);
          }
        }

        const errorObj: ErrorInfoWithoutImprovedError = {
          code: db[newError].code,
          error: newError,
          parseInfo: {
            rawError: matchElem,
            startIndex,
            endIndex,
            items,
            prettyItems,
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
      }
    }
  }

  return Object.values(errorMessageByKey).sort(
    (a, b) => a.parseInfo.startIndex - b.parseInfo.startIndex,
  );
};

export const parseErrors = async (
  message: string,
): Promise<ErrorInfoWithoutImprovedError[]> => {
  return parseErrorsWithDb(tsErrorMessages, message);
};
