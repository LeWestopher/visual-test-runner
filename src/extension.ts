'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TestSuiteProvider } from './test-runner-view';
import { TestProcessorRegistry } from './engines/registry';
import { TestStreamRegistry } from './engines/stream-registry';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
    const rootPath = vscode.workspace.rootPath || '';

    // Get the name of our test processor from jestTestRunner.engine and 
    // build the relevant processor object to inject into TestSuiteProvider
    const testProcessorName: string | undefined = vscode.workspace
        .getConfiguration('jestTestRunner')
        .get('engine');
    if (!testProcessorName) {
        throw new Error(
            'Visual Test Runner Error: You must configure an engine using the jestTestRunner.engine configuration setting'
        );
    }
    const processorRegistry = TestProcessorRegistry.init();
    const testProcessor: any = processorRegistry.get(testProcessorName);

    // Build our relevant stdout stream object to receive json for injecting
    // into TestSuiteProvider
    const streamRegistry = TestStreamRegistry.init();
    const testStream: any = streamRegistry.get(testProcessorName);
    
    // Create our TreeView for our list of test suites and assertion results
    // and register it with vscode
    const jestTestSuiteProvider = new TestSuiteProvider(
        rootPath,
        testStream,
        testProcessor
    );
    vscode.window.registerTreeDataProvider('jestTestRunner', jestTestSuiteProvider.init());

    // Register our commands to use with the test runner
    vscode.commands.registerCommand('jestTestRunner.refreshEntry', () => jestTestSuiteProvider.refresh());
    vscode.commands.registerCommand('jestTestRunner.runTests', () => console.log('HELLO'));
	vscode.commands.registerCommand('jestTestRunner.openTestFile', (filePath, line, column) => {
        vscode.workspace
            .openTextDocument(filePath)
            .then((doc: any) => vscode.window.showTextDocument(doc))
            .then(() => {
                const editor = vscode.window.activeTextEditor;
                if (!editor) {
                    // Early return if there is no active editor
                    return false;
                }

                // Change position of cursor in document to our assertion
                const position = editor.selection.active;
                const newPosition = position.with(line, column);
                var newSelection = new vscode.Selection(newPosition, newPosition);
                editor.selection = newSelection;

                // Reveal range of document to ensure that we can view our repositioned cursor
                editor.revealRange(new vscode.Range(newPosition, newPosition));
            });
	});
}

// this method is called when your extension is deactivated
export function deactivate() {

}