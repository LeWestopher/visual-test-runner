import { TransformStream } from "../transform-stream";

export class KarmaDuplexStream extends TransformStream {
  public currentJson = '';

  public toJson(): any {
    return {};
  }
}