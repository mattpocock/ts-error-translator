import * as vscode from 'vscode';
import XRegExp from 'xregexp';
export const COMMAND = 'ts-fill-object.command';

export class AddMissingTypeProps implements vscode.CodeActionProvider {

	public static readonly providedCodeActionKinds = [
		vscode.CodeActionKind.QuickFix
	];

	private static CODES = [2345, 2739, 2741];

	provideCodeActions(document: vscode.TextDocument, range: vscode.Range | vscode.Selection, context: vscode.CodeActionContext, token: vscode.CancellationToken): vscode.CodeAction[] {
		return context.diagnostics
			.filter(diagnostic => AddMissingTypeProps.CODES.includes(diagnostic.code as number))
			.map(diagnostic => this.createCommandCodeAction(diagnostic));
	}

	private createCommandCodeAction(diagnostic: vscode.Diagnostic): vscode.CodeAction {
		const action = new vscode.CodeAction(
			'Add missing type properties',
			vscode.CodeActionKind.QuickFix
		);
		action.command = {
			command: COMMAND,
			title: 'Fill object with missing type properties',
			tooltip: 'This will add undefined properties to the object.',
			arguments: [diagnostic]
		};
		action.diagnostics = [diagnostic];
		action.isPreferred = true;
		return action;
	}

	/* Code Action Implementation */

	static Run(diagnostic: vscode.Diagnostic) {
		// Error codes:
		// 2345: The error is raised on the object itself
		// 2739: The error is raised on the parameter name (in case of nested objects)
		// 2741: The error is raised on the nested parameter name (in case of doubly nested objects)
		
		let editor = vscode.window.activeTextEditor;
		if (!editor) return;

		let text = '';
		let range = diagnostic.range;

		if (diagnostic.code === 2345) {
			text = editor.document.getText(diagnostic.range);
		}
		else {
			let obj = ParseObjectFromParamName(editor, diagnostic.range);
			if (!obj) return;
			text = obj.text;
			range = obj.range;
		}

		let info = GetObjInfo(text, range.start, diagnostic.code === 2345);
		let params = ExtractParams(diagnostic.message);

		let params_text = params.map(p =>
			(info.multiline?'\n':'') + ' '.repeat(info.offset) + p + ': ?'
		).join(',');

		let ending = ' ';
		if (info.multiline) {
			if (diagnostic.code === 2345) ending = '\n';
			else ending = '\n'+' '.repeat(diagnostic.range.start.character);
		}
		let comma = info.empty?'':',';

		text = text.replace(/{(.*?),?( *\n*)*}$/s, `{$1${comma}${params_text}${ending}}`);
		editor.edit((edit: vscode.TextEditorEdit) => {
			edit.replace(range, text)
		})
	}
}

function ExtractParams(message: string): string[] {
	// Message models:
	// - Property 'name' is missing in type '{}' but required in type '{ name: string; }'
	// - Type '{}' is missing the following properties from type '{ name: string; age: number; }': name, age
	
	let params: string[] = [];
	let single = /Property '(.*)' is missing/.exec(message);
	if (single) params.push(single[1]);
	else {
		let many = /Type '.*' is missing .*: (.*)/.exec(message);
		if (many) params.push(...many[1].split(/, ?/));
	}
	return params;
}

function GetTextUntilEOF(editor: vscode.TextEditor, start: vscode.Position) {
	let last_line = editor.document.lineAt(editor.document.lineCount - 1);
	return editor.document.getText(new vscode.Range(start, last_line.range.end));
}

function StringRange(start: vscode.Position, string: string) {
	let lines = string.split('\n');
	let n = lines.length-1;
	let last_line = lines[n];

	let end_char = last_line.length;
	if (n == 0) end_char += start.character;

	return new vscode.Range(
		start,
		new vscode.Position(start.line + n, end_char)
	)
}

function ParseObjectFromParamName(editor: vscode.TextEditor, range: vscode.Range) {
	let text = GetTextUntilEOF(editor, range.start);
	
	let param = text.match(/(.*?):.*?{/s);
	let param_name_range = StringRange(range.start, param![0]);

	let obj = XRegExp.matchRecursive(text,'{','}');
	text = '{' + obj[0] + '}';

	let obj_start = param_name_range.end.translate(undefined,-1);
	let obj_range = StringRange(obj_start, text);

	return {text, range: obj_range};
}

function GetObjInfo(text: string, start: vscode.Position, root: boolean) {
	let empty = text.match(/{(\n* *)*}/) != null;
	let multiline = text.match(/{ *\n/) != null;	
	let offset = root ? 4 : 1;
	
	if (empty) {
		multiline = true;
		if (!root) offset = (Math.ceil(start.character/4)-1)*4;
	}
	else if (multiline) {
		let first_param_offset = /( *)\S+:/.exec(text);
		offset = first_param_offset ? first_param_offset[1].length : 0;
	}

	return { empty, multiline, offset }
}