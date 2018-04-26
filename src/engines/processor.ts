
export abstract class TestProcessor {
  public abstract setResults(results: any): any;
  public abstract getChildren(element: any): any;
  public abstract getCmd(): string;
  public abstract getOpts(): Array<string>;
}