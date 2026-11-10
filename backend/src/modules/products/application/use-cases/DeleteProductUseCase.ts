import { Id } from "../../../../core/domain/Id";
import { IProductRepository } from "../ports/IProductRepositoryPort";

export class DeleteProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(userId: Id, productId: Id) {
    const product = await this.productRepo.delete(productId);
    if (!product) throw new Error("");
    if (product.UserId !== userId) throw new Error("");
    return product;
  }
}
