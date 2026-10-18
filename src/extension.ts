import * as vscode from 'vscode';
import * as JSON5 from 'json5';
import { randomUUID } from 'crypto';

export function activate(context: vscode.ExtensionContext) {

	const disposable = vscode.commands.registerCommand('save-as-snippet.save-to-snippet-file', () => {
		let editor = vscode.window.activeTextEditor;
		if ( editor ){
			let selection : vscode.Selection = editor.selection;
			let line_start : vscode.Position = editor.document.lineAt(selection.start.line).range.start;
			let delta_start = selection.start.character - line_start.character;

			let selection_range : vscode.Range = new vscode.Range(line_start, selection.end);
			let s_text = editor.document.getText(selection_range).split("\n").map(e => {
				return e.substring(delta_start);
			});
			const ident_size : number = typeof(editor.options.indentSize) == "number" ? editor.options.indentSize : 0;

			s_text = s_text.map((line : string) => {
				return line.replaceAll( " ".repeat(ident_size), "\t" );
			})

			let snippet_name = randomUUID().toString();

			vscode.window.showInputBox({"placeHolder": "Prefix", "value": "s_"}).then(prefix => {
				if (prefix === undefined) return;

				let snippet = {
					prefix: prefix,
					body: s_text,
					description: ""
				};
	
				vscode.commands.executeCommand("workbench.action.openSnippets").then( (res) => {
					if (!res) return;

					let new_editor = vscode.window.activeTextEditor;
					if (!new_editor) return;
	
					let text = new_editor.document.getText();
					let end_pos = new_editor.document.lineAt(new_editor.document.lineCount-1).range.end
					let snippet_json = JSON5.parse(text);
					snippet_json[snippet_name] = snippet;
					new_editor.edit( e => {
						e.replace(new vscode.Range(editor.document.positionAt(0), end_pos), JSON.stringify(snippet_json, null, 4));
						new_editor.revealRange(new vscode.Range(end_pos, end_pos));
					});
					new_editor.document.save();
				});
			})
		}
	});

	context.subscriptions.push(disposable);
}

// Called when extension is deactivated
export function deactivate() {}
