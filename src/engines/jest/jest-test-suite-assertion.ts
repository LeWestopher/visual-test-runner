import * as vscode from 'vscode';
import * as path from 'path';
import { IAssertionResult } from '../../types/index';

export interface IIconPath {
	light: string;
	dark: string;
}

export class JestTestSuiteAssertionResult extends vscode.TreeItem {

	iconPath: IIconPath;

	constructor(
		public readonly label: string,
		public readonly collapsibleState: vscode.TreeItemCollapsibleState,
		public meta: IAssertionResult,
		public name: string,
		public readonly command?: vscode.Command
	) {
		super(label, collapsibleState);
		let line;
		let column;
		if (this.meta.location) {
			line = this.meta.location.line;
			column = this.meta.location.column;
		} else {
			line = 0;
			column = 0;
		}
		this.command = {
			command: 'jestTestRunner.openTestFile',
			title: '',
			arguments: [name, line, column]
		};
		const key: { [key: string]: string } = {
			passed: 'success.svg',
			failed: 'failure.svg',
			pending: 'pending.svg'
		};
		let svg: string = key[this.meta.status];
		this.iconPath = {
			light: path.join(__filename, '..', '..', '..', '..', 'resources', svg),
			dark: path.join(__filename, '..', '..', '..', '..', 'resources', svg),
		};
	}
}