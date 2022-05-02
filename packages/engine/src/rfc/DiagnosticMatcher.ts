import * as crypto from "node:crypto";
import DiagnosticJsonMessages from "../tsErrorMessages.json";
import type {HashKey} from "./types";
import type {DiagnosticMatcher} from "./types";
import type {DiagnosticJsonMessage} from "./types";

const MatchRegExpEscape = /[.*+?^${}()|[\]\\]/g;
const MatchDoubleQuoted = /"([^"]*)"/g;
const MatchSingleQuoted = /'([^']*)'/g;
const MatchEscapedQuote = /\\"/g;
const MatchAnyParameter = /({.+})/g;
const MatchIntParameter = /({\d})/g;
const MatchEscapedParam = /\\\{(\d)\\\}/g;
const DiagnosticHashMap = new Map<string, DiagnosticMatcher[]>();

function ConvertToRegExpSource(text: string): string {
	return text.replace(MatchRegExpEscape, "\\$&");
}
function ConvertDiagnosticMessageToHashKey(message: string): HashKey {
	const noTypeArgumentsMessage = message
		.replace(MatchEscapedQuote, "EQ") //  '\\" | "A"'  -> 'EQ | "A"'
		.replace(MatchDoubleQuoted, "DQ") //  'EQ | "A"'   -> 'EQ | DQ'
		.replace(MatchSingleQuoted, "'T'") // 'EQ | DQ'    -> 'T'
		.replace(MatchAnyParameter, "{?}"); // '{0}' is {2} -> '{?}' is {?}

	return crypto.createHash("sha256").update(noTypeArgumentsMessage).digest("hex");
}
function CreateDiagnosticMatcher(message: string, {code, category}: DiagnosticJsonMessage): DiagnosticMatcher {
	const hashKey = ConvertDiagnosticMessageToHashKey(message);
	const matchSource = ConvertToRegExpSource(message).replace(MatchEscapedParam, "(.+)"); // \{0\} -> (.+)

	const matcher = new RegExp(`^${matchSource}$`);
	const parameters = message.match(MatchIntParameter) ?? [];

	return {
		code,
		category,
		hashKey,
		message,
		matcher,
		parameters,
	};
}
function EnsureHashMapBuilt() {
	if (DiagnosticHashMap.size === 0) {
		const messages: Record<string, DiagnosticJsonMessage> = DiagnosticJsonMessages;

		for (const message in messages) {
			const diagnosticMatcher = CreateDiagnosticMatcher(message, messages[message]);
			const groupedByHashKey = DiagnosticHashMap.get(diagnosticMatcher.hashKey) ?? [];

			groupedByHashKey.push(diagnosticMatcher);

			DiagnosticHashMap.set(diagnosticMatcher.hashKey, groupedByHashKey);
		}
	}
}
export function Find(message: string): DiagnosticMatcher | null {
	EnsureHashMapBuilt();

	const messageHashKey = ConvertDiagnosticMessageToHashKey(message);
	const diagnosticMatcherGroup = DiagnosticHashMap.get(messageHashKey);

	/**
	 * In the best case (most cases), there'll be a single element in the group.
	 * However, hash collisions are possible for diagnostics that look-alike
	 * after cleaning up their arguments (e.g: quoted values).
	 * In few worst cases, a group contains multiple diagnostics (~2-3) with same hash,
	 * this is still faster that iterating over all +1000 diagnostics vs ~3 diagnostics.
	 */
	if (diagnosticMatcherGroup) {
		for (const diagnosticMatcher of diagnosticMatcherGroup) {
			if (message.match(diagnosticMatcher.matcher)) {
				return diagnosticMatcher;
			}
		}
	}

	return null;
}
/**
 * Associate a diagnostic message parameters with a matched message parameters,
 * returning an array of unique parameter associations.
 * @example
 * ```ts
 * AssociateParameters(["{0}", "{1}", "{0}", "{2}"], ["T", "U", "T", "T"]); // ["T", "U", "T"]
 * ```
 */
export function AssociateParameters(parameters: string[], matchedParameters: string[]): string[] {
	const params: Record<string, string> = Object.create(null);

	for (let i = 0; i < matchedParameters.length; i++) {
		const parameter = parameters[i];
		/**
		 * If a user provides a made-up diagnostic message (that matches), parameters may not be associable,
		 * so we'll just ignore them by defaulting to displaying "unknown".
		 */
		params[parameter] ??= String(matchedParameters[i] ?? "unknown");
	}

	return Object.values(params);
}
