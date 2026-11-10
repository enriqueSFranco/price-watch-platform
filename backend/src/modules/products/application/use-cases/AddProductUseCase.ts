import { IProductRepository } from "../ports/IProductRepositoryPort.ts";
import { Id } from "../../../../core/domain/Id.ts";
import { CreateProductDTO } from "../../../scraper/application/dto/createProduct.dto.ts";

export class AddProductUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute(userId: Id, dto: CreateProductDTO) {
    // guardar el producto principal
    const product = await this.productRepo.save({ userId, product: dto });
    // guardar el historial inicial
  }
}
