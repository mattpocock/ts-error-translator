export type HashKey = string;

export interface DiagnosticJsonMessage {
	code: number;
	category: string;
}
export interface DiagnosticMatcher extends DiagnosticJsonMessage {
	hashKey: string;
	message: string;
	matcher: RegExp;
	parameters: string[];
}
export interface Diagnostic extends DiagnosticJsonMessage {
	hashKey: HashKey;
	message: string;
	matched: string;
	parameters: string[];
}
