type ErrorName =
  | "SCRAPER_ERROR"
  | "NETWORK_ERROR"
  | "VALIDATION_ERROR"
  | "AUTH_ERROR"
  | "UNKNOWN";

export class CustomError extends Error {
  readonly code: ErrorName;
  readonly cause?: unknown;

  constructor(
    message: string,
    options?: { code?: ErrorName; cause?: unknown }
  ) {
    super(message);
    this.name = "Custom Error";
    this.code = options?.code ?? "UNKNOWN";
    this.cause = options?.cause;
    Object.setPrototypeOf(this, CustomError.prototype);
  }
}
