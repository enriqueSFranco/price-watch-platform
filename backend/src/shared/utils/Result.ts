export class Result<T> {
  private readonly success: boolean;
  private readonly value?: T;
  private readonly error?: Error;

  private constructor(sucess: boolean, value?: T, error?: Error) {
    this.success = sucess;
    this.value = value;
    this.error = error;
  }

  static success<T>(value: T): Result<T> {
    return new Result<T>(true, value);
  }

  static error<T>(error: Error): Result<T> {
    return new Result<T>(false, undefined, error);
  }

  isSuccess() {
    return this.success;
  }

  isFailure() {
    return !this.isSuccess();
  }

  get Value() {
    return this.value
  }

  get Error() {
    return this.error
  }
}
