import { JestProcessor } from './jest/jest-processor';
import { KarmaProcessor } from './karma/karma-processor';
import { TestProcessor } from './processor';

interface Constructable<T> {
  new() : T;
}

export class TestProcessorRegistry {

  private _processors: { [key: string]: Constructable<TestProcessor> } = {
    jest: JestProcessor,
    karma: KarmaProcessor
  };

  static init() {
    return new TestProcessorRegistry();
  }

  public get(processor: string) {
    const Processor: any = this._processors[processor];
    if (!Processor) {
      return;
    }
    const TestProcessor: TestProcessor = new Processor();
    return TestProcessor;
  }

}