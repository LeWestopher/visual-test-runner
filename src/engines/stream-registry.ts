import { TransformStream } from './transform-stream';
import { JestDuplexStream } from './jest/jest-stream';
import { KarmaDuplexStream } from './karma/karma-stream';

export class TestStreamRegistry {

  private _streams: { [key: string]: any } = {
    'jest': JestDuplexStream,
    'karma': KarmaDuplexStream
  };

  static init() {
    return new TestStreamRegistry();
  }

  public get(stream: string) {
    const StreamClass: any = this._streams[stream];
    if (!StreamClass) {
      return;
    }
    const transformStream: TransformStream = new StreamClass();
    return transformStream;
  }

}