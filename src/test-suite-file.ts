import * as vscode from 'vscode';
import * as path from 'path';

export class TestSuiteFile extends vscode.TreeItem {

	constructor(
		public readonly label: string,
		collapsibleState: vscode.TreeItemCollapsibleState,
		public meta: any,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
	}

	iconPath = {
		light: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg'),
		dark: path.join(__filename, '..', '..', 'resources', 'light', 'dependency.svg')
	}; 
}