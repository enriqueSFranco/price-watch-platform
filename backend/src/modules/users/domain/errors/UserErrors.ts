import { AppError } from "../../../../shared/utils/AppError";

export class UserErrors {
  static readonly USER_ALREADY_EXISTS = new AppError("USER_ALREADY_EXISTS", "User already exists");
  static readonly INVALID_USER = new AppError("INVALID_USER", "Invalid User");
}
