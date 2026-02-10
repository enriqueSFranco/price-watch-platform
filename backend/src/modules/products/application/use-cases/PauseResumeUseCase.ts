import { IProductRepository } from "../ports/IProductRepositoryPort";

export class PauseResumeUseCase {
  constructor(private readonly productRepo: IProductRepository) {}

  async execute() {}
}
