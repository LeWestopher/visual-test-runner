import * as vscode from 'vscode';
import { TestSuiteFile } from './test-suite-file';
import { TestSuiteAssertionResult } from './test-suite-assertion-result';
import { TestProcessor } from './engines/processor';
import { TransformStream } from './engines/transform-stream';

export class TestSuiteProvider implements vscode.TreeDataProvider<TestSuiteFile | TestSuiteAssertionResult> {
	private _runningTestProcess: any;
	/*
	 * Private event emitter for onDidChangeTreeData
	 */
	private _onDidChangeTreeData: vscode.EventEmitter<TestSuiteFile | undefined> 
		= new vscode.EventEmitter<TestSuiteFile | undefined>();
	/**
	 * Implements onDidChangeTreeData for TreeDataProvider interface
	 */
	readonly onDidChangeTreeData: vscode.Event<TestSuiteFile | undefined> 
		= this._onDidChangeTreeData.event;
	/**
	 * Constructs the TestRunnerView object for consumption by vscode
	 * @param _workspaceRoot file root of the current workspace
	 * @param _transformer transformer for translating results from chosen test processor
	 * @param _processor processor to return test assertion view items
	 */
	constructor(
		private _workspaceRoot: string,
		private _transformer: TransformStream,
		private _processor: TestProcessor
	) {
		// Refreshes the TreeView
		this.refresh();
		
		// Initializes our stream transformer for consuming our test report from stdout
		this._transformer.setCallback((results: any) => {
			this._processor.setResults(results);
			this.refresh();
		});
		
		// Starts the test ongoing test process in the shell
		this._spawnOngoingTestsProcess(
			this._processor.getCmd(), 
			this._processor.getOpts(), 
			this._workspaceRoot 
		);
	}
	public init(): TestSuiteProvider {
		this.refresh();
		this._spawnOngoingTestsProcess(
			this._processor.getCmd(), 
			this._processor.getOpts(), 
			this._workspaceRoot 
		);
		return this;
	}
	/**
	 * Sends refresh event to rerender the list
	 */
	refresh(): void {
		this._refresh();
	}
	/**
	 * Dispose of the running test process
	 */
	destroy(): void {
		this._runningTestProcess.kill('SIGINT');
	}
	/**
	 * Transforms each element of the list into an element
	 * @param element the list element to transform to a new list item
	 */
	getTreeItem(element: TestSuiteFile): vscode.TreeItem {
		return element;
	}
	/**
	 * Implements TreeDataProvider interface for returning a list of children for element of list
	 * @param element element in list to return children for
	 */
	getChildren(element?: TestSuiteFile | TestSuiteAssertionResult): TestSuiteFile[] | TestSuiteAssertionResult[] {
		try {
			return this._processor.getChildren(element);
		}
		catch (e) {
			vscode.window.showErrorMessage(
				'Visual Test Runner Error: Could not render test files.  This could be due to improper configuration.'
			);
			return [];
		}
	}
	private _refresh() {
		return this._onDidChangeTreeData.fire();
	}
	/**
	 * Executes a shell command to spawn the running test process
	 * @param cmd the shell command to run for the test process
	 * @param args the array of shell args to feed into command
	 * @param cwd current working directory to run the shell command in
	 */
	private _spawnOngoingTestsProcess(cmd: string, args: Array<string>, cwd: string) {
		try {
			const { spawn } = require('child_process');
			this._runningTestProcess = spawn(cmd, args, { cwd, maxBuffer: 1024 * 5000, encoding: 'utf8' });
	
			// Pipe stdout into our Jest stream object to backpressure JSON until it's a valid json response
			this._runningTestProcess.stdout.pipe(this._transformer);
		}
		catch (e) {
			vscode.window.showErrorMessage(
				`Visual Test Runner Error: Test runner failed to start.  This could be due to improper configuration.`
			);
		}
	}
}
