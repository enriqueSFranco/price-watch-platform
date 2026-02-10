import { Id } from "../../../../core/domain/Id";
import { IProductRepository } from "../ports/IProductRepositoryPort";

export class GetProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(userId: Id, productId: Id) {
    const product = await this.productRepo.findById(productId);
    if (!product) throw new Error("PRODUCT_NOT_FOUND");
    if (product.UserId !== userId) throw new Error("FORBIDDEN");
    return product;
  }
}
