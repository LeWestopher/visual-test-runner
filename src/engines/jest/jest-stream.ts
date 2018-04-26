import { TransformStream } from "../transform-stream";

export class JestDuplexStream extends TransformStream {
  public currentJson = '';
  
  public toJson(): any {
    return JSON.parse(this.currentJson);
  }
}