import * as vscode from 'vscode';

export class TestRunnerStatusBar {

  private _statusBarObject: vscode.StatusBarItem;

  constructor() {
    this._statusBarObject = vscode.window.createStatusBarItem();
    this._statusBarObject.text = 'Run Tests';
  }

  static init() {
    return new TestRunnerStatusBar();
  }

  public dispose() {
    return this._statusBarObject.dispose();
  }
}