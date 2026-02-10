import { AppError } from "../../../../shared/utils/AppError";

export class ProductErrors {
  static readonly PRODUCT_NOT_FOUND = new AppError("PRODUCT_NOT_FOUND", "Product not found");
}
