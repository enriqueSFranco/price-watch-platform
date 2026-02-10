import { Id } from "../../../../core/domain/Id";
import { IProductRepository } from "../ports/IProductRepositoryPort";

export class ListProductsUseCase {
  constructor(private productRepo: IProductRepository) {}

  async execute(userId: Id) {
    const rows = await this.productRepo.findAllByUser(userId);
    return rows;
  }
}
