import * as DiagnosticMatcher from "./DiagnosticMatcher";
import type {Diagnostic} from "./types";

export function CreateMessageChain(messageChain: string): string[] {
	const diagnosticMessageChain: string[] = messageChain
		.split("\n")
		.map((message) => message.trim())
		.filter((messageChainItem) => messageChainItem.length > 5);
	return Array.from(new Set(diagnosticMessageChain));
}
export function Create(message: string): Diagnostic | null {
	const diagnosticMatcher = DiagnosticMatcher.Find(message);

	if (!diagnosticMatcher) return null;

	const parameters = message.match(diagnosticMatcher.matcher) ?? [];

	return {
		code: diagnosticMatcher.code,
		category: diagnosticMatcher.category,
		hashKey: diagnosticMatcher.hashKey,
		message: diagnosticMatcher.message,
		matched: message,
		parameters: DiagnosticMatcher.AssociateParameters(diagnosticMatcher.parameters, parameters.slice(1)),
	};
}
export function ParseMessage(text: string): Diagnostic[] {
	const messageChain = CreateMessageChain(text);
	const diagnostics = messageChain.map(Create).filter((d): d is Diagnostic => d !== null);
	return diagnostics;
}
