import { Id } from "../../../../../core/domain/Id";
import { db } from "../../../../../shared/config/database";
import { Product } from "../../../../products/domain/entities/Product";
import { products } from "../../../../products/infrastructure/persistence/drizzle/products.schema";
import { IScraperProductPort } from "../../../domain/ports/IScraperProductPort";
import { scrapedProducts } from "./scrapedProducts.schema";

export class DrizzleScraperPersistence implements IScraperProductPort {
  /**
   * @description Guarda el historial de precios/disponibilidad
   * @param product
   */
  public save = async (input: {
    userId: Id;
    product: Product;
  }): Promise<void> => {
    // 1.- definir que hace unico al scrapedProduct (id + scrapedAt)
    const [product] = await db
      .insert(products)
      .values({
        userId: input.product.userId,
        name: input.product.Name,
        initialPrice: input.product.InitialPrice,
        currentPrice: input.product.CurrentPrice,
        provider: input.product.Provider,
        imageUrl: input.product.ImageUrl,
        url: input.product.Url,
        monitoringStatus: "Active",
        inStock: input.product.InStock,
      })
      .returning();

    await db
      .insert(scrapedProducts)
      .values({
        productId: input.product.Id,
        name: input.product.Name,
        price: input.product.CurrentPrice,
        inStock: input.product.InStock,
        rawData: null,
        scrapedAt: new Date(),
      })
      .onConflictDoUpdate({
        target: products.id,
        set: { currentPrice: product.CurrentPrice },
      });
  };
}
