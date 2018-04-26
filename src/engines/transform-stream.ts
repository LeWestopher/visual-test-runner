import { Duplex } from "stream";

export abstract class TransformStream extends Duplex {
  public currentJson = '';

  constructor(public cb: Function | undefined) {
    super();
  }

  public append(chunk: string): void {
    this.currentJson += chunk;
  }

  public clear(): void {
    this.currentJson = '';
  }

  public setCallback(cb: Function) {
    this.cb = cb;
  }
  
  public abstract toJson(): any;

  public write(chunk: any): boolean {
    if (!this.cb) {
      throw new Error('Visual Test Runner Error: TestStream callback not configured.');
    }
    const jsonStr = chunk.toString();
    if (jsonStr.length) {
      this.append(jsonStr);
    }
    if (this.checkJsonIsValid()) {
      this.cb(this.toJson());
      this.clear();
    }
    return true;
  }

  public checkJsonIsValid(): boolean {
    if (this.currentJson === '') {
      return false;
    }
    try {
      JSON.parse(this.currentJson);
      return true;
    }
    catch (e) {
      return false;
    }
  }
}