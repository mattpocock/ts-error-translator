import tsErrorMessages from './tsErrorMessages.json';

type TsDiagnosticMessage = keyof typeof tsErrorMessages;
type TsDiagnosticParameters = string;

interface TSDiagnosticMatcher {
  regexGlobal: RegExp;
  regexLocal: RegExp;
  parameters: TsDiagnosticParameters[];
}

const DiagnosticHashMap = new Map<TsDiagnosticMessage, TSDiagnosticMatcher>();

function escapeRegExp(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
}

function getDiagnosticMatcher(text: TsDiagnosticMessage): TSDiagnosticMatcher {
  const existing = DiagnosticHashMap.get(text);

  if (existing) return existing;

  const regexSource = escapeRegExp(text).replace(/\\\{(\d)\\\}/g, '(.+)');
  const regexLocal = new RegExp(regexSource);
  const regexGlobal = new RegExp(regexSource, 'g');
  const parameters = text.match(/{(\d)}/g) ?? [];

  const diagnosticMatcher = {
    regexLocal,
    regexGlobal,
    parameters,
  };

  DiagnosticHashMap.set(text, diagnosticMatcher);

  return diagnosticMatcher;
}

function associateMatchedParameters(
  parameters: TsDiagnosticParameters[],
  matchedParams: string[],
): (string | number)[] {
  const params: Record<string, string | number> = Object.create(null);

  for (let i = 0; i < matchedParams.length; i++) {
    const parameter = parameters[i];
    params[parameter] ??= matchedParams[i] ?? '';
  }

  return Object.values(params);
}

interface ParseInfo {
  rawError: string;
  startIndex: number;
  endIndex: number;
  items: (string | number)[];
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

const tsMessages = Object.keys(tsErrorMessages) as TsDiagnosticMessage[];

export const parseErrors = (
  message: string,
): ErrorInfoWithoutImprovedError[] => {
  const errorMessageByKey: Record<string, ErrorInfoWithoutImprovedError> = {};

  tsMessages.forEach((newError) => {
    const { regexLocal, regexGlobal, parameters } =
      getDiagnosticMatcher(newError);

    const match = message.match(regexGlobal);

    if (match) {
      match.forEach((matchElem) => {
        const startIndex = message.indexOf(matchElem);
        const endIndex = startIndex ?? 0 + matchElem.length;
        const key = `${startIndex}_${endIndex}`;

        const items = associateMatchedParameters(
          parameters,
          matchElem.match(regexLocal)?.slice(1) ?? [],
        );

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
  });

  return Object.values(errorMessageByKey).sort(
    (a, b) => a.parseInfo.startIndex - b.parseInfo.startIndex,
  );
};
