import { TestProcessor } from "../processor";

export class KarmaProcessor extends TestProcessor {
  private _results: any = {};

  public setResults(results: any): KarmaProcessor {
    this._results = results;
    return this;
  }

  public getCmd(): string {
    return './node_modules/.bin/karma';
  }

  public getOpts(): Array<string> {
    return [];
  }

  public getChildren(element: any): any {
    if (!element) {
      return this._getBrowserElementsForRoot();
    }
    if (element.type === 'karma-browser') {
      return this._getTestSuiteFilesForBrowser(element);
    }
    if (element.type === 'karma-assertion') {
      return this._getTestAssertionsForTestSuiteFile(element);
    }
  }

  private _getBrowserElementsForRoot(): any {
    return this._results
      .map((result: any) => result);
  }

  private _getTestSuiteFilesForBrowser(element: any): any {

  }

  private _getTestAssertionsForTestSuiteFile(element: any): any {

  }
}