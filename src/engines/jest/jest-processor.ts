import * as vscode from 'vscode';
import * as _ from 'lodash';
import { JestTestSuiteFile } from './jest-test-suite-file';
import { JestTestSuiteAssertionResult } from './jest-test-suite-assertion';
import { TestProcessor } from '../processor';

export class JestProcessor extends TestProcessor {

  private _results: any;

  public setResults(results: any): JestProcessor {
    this._results = results;
    return this;
  }

  public getCmd(): string {
    return './node_modules/.bin/jest';
  }

  public getOpts(userOpts: Array<string> = []): Array<string> {
    return _.uniqBy(userOpts.concat(['--json', '--silent', '--testLocationInResults', '--watchAll']), (target: any) => target);
  }

  public getChildren(element: any): any {
    if (!element) {
      return this._getTestSuiteFiles();
    }
    return this._getTestAssertionsForTestSuiteFile(element);
  }
	/**
	 * Returns the list of children for the root portion of the list
	 */
  private _getTestSuiteFiles(): any {
    if (!this._results) {
      return [];
    }
    return this._results
      .testResults
      .sort((result: any) => result.status === 'passed' ? 1 : -1)
      .map((result: any) => {
        // Set test suite file element to collapsed if passed || pending, open if has failing tests
        const collapsibleState = result.status === 'passed' || result.status === 'pending' ? 
          vscode.TreeItemCollapsibleState.Collapsed :
          vscode.TreeItemCollapsibleState.Expanded;
        // Split files by delimiter to leave only filename
        const fn = result.name.split('/');
        return new JestTestSuiteFile(fn[fn.length - 1], collapsibleState, result);
      });
  }
	/**
	 * Returns a list of assertion result children for a test suite file in the tree list
	 * @param element the TestSuiteFile object to return assertion results for from _results prop
	 */
  private _getTestAssertionsForTestSuiteFile(element: any): any {
    // Get our failed assertions and sort them by line number
    const failedAssertions = element.meta.assertionResults
      .filter((result: any) => result.status === 'failed')
      .sort((a: any, b: any) => a.location.line > b.location.line ? 1 : -1);

    // Get our passed assertions and sort them by line number
    const passedAssertions = element.meta.assertionResults 
      .filter((result: any) => result.status === 'passed')
      .sort((a: any, b: any) => a.location.line > b.location.line ? 1 : -1);

    // Concat failures with passes so that failures are first and map to result objects
    return failedAssertions.concat(passedAssertions)
      .map((assertionResult: any) => new JestTestSuiteAssertionResult(
        assertionResult.fullName, 
        vscode.TreeItemCollapsibleState.None, 
        assertionResult,
        element.meta.name
      ));
  }

}