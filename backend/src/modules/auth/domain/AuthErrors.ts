import { AppError } from "../../../shared/utils/AppError";

export class AuthErrors {
  static readonly INVALID_CREDENTIALS = new AppError("INVALID_CREDENTIALS", "Invalid credentials");
}
