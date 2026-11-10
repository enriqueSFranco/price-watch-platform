import { Id } from "../../../../core/domain/Id.ts";
import { CreateProductDTO } from "../../../scraper/application/dto/createProduct.dto.ts";
import { Product } from "../../domain/entities/Product.ts";

// Interfaz que define las operaciones de DB para Product
export interface IProductRepository {
  findById(id: Id): Promise<Product | null>;
  findByName(name: string): Promise<Product[]>;
  findAllActiveForScraping(): Promise<Product[]>;
  findAllByUser(userId: Id): Promise<Product[]>;
  save({
    userId,
    product,
  }: {
    userId: Id;
    product: CreateProductDTO;
  }): Promise<Product>;
  delete(id: Id): Promise<Product | null>;
}
