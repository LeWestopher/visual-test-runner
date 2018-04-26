class VisualTestRunnerError extends Error {
  public flash: string | undefined = '';
}

export function throwError(msg: string, flash?: string) {
  let error = new VisualTestRunnerError(msg);
  error.flash = flash;
  throw error;
}