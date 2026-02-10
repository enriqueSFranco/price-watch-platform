import { eq, ilike } from "drizzle-orm";
import { db } from "../../../../../shared/config/database.ts";
import { products } from "./products.schema.ts";
import { scrapedProducts } from "../../../../scraper/infrastructure/persistence/drizzle/scrapedProducts.schema.ts";
import { IProductRepository } from "../../../application/ports/IProductRepositoryPort.ts";
import { Product } from "../../../domain/entities/Product.ts";
import { ProductMapper } from "../ProductMapper.ts";
import { Id } from "../../../../../core/domain/Id.ts";
import { CreateProductDTO } from "../../../../scraper/application/dto/createProduct.dto.ts";
import { Store } from "../../../../scraper/domain/store.enums.ts";
// import { ApiError } from "../../../shared/errors/api.error.ts";
// import { SearchProductType } from "../../../search/domain/search.schema.ts";

// Acceden directamente a la base de datos. Nada de lógica de negocio.
export class DrizzleProductPersistence implements IProductRepository {
  async findAllActiveForScraping(): Promise<Product[]> {
    const rows = await db.query.products.findMany({
      where: eq(products.monitoringStatus, "Active"),
    });

    return ProductMapper.toDomainInList(rows);
  }

  /**
   * @description Obtiene un producto por su identificador único
   * @param id - El identificador único del producto
   * @returns Un objeto de tipo Product o null si no se encuentra
   */
  async findById(id: Id): Promise<Product | null> {
    const result = await db.query.products.findFirst({
      where: eq(products.id, id.value),
    });
    if (!result) return null;

    return ProductMapper.toDomain(result);
  }
  /**
   * @description Busca productos por una councidencia de nombre (insenisble a mayúsculas/minúsculas)
   * @param name - El término de búsqueda para el nombre del producto
   * @returns Un array de productos o null si no se encuentran coincidencias
   */
  async findByName(name: string): Promise<Product[]> {
    const results = await db.query.products.findMany({
      where: ilike(products.name, `%${name}%`),
    });
    if (!results || results.length === 0) return [];

    return ProductMapper.toDomainInList(results);
  }

  /**
   * @description Obtiene todos los productos de la base de datos
   * @returns Un array con todos los productos o null si no hay ninguno
   */
  async findAllByUser(userId: Id): Promise<Product[]> {
    const results = await db.query.products.findMany({
      where: eq(products.userId, userId.value),
    });
    return ProductMapper.toDomainInList(results);
  }

  async updateMonitoringStatus() {}

  async updateCurrentPrice() {}

  /**
   * @description Crea un nuevo producto en la base de datos y mantiene el estado actual del producto
   * @param product - Objeto con los datos del nuevo producto, sin id, fechas de creacion y fecha de scraper
   * @returns Objeto del producto creado
   */
  async save({
    userId,
    product,
  }: {
    userId: Id;
    product: CreateProductDTO;
  }): Promise<Product> {
    return await db.transaction(async (tx) => {
      // Ejecutar la inserción/actualización y OBTENER la fila actualizada.
      const [updatedRow] = await tx
        .insert(products)
        .values({
          userId: userId.value,
          name: product.name,
          initialPrice: product.price,
          currentPrice: product.price,
          provider: product.Store,
          imageUrl: product.imageUrl,
          url: product.url,
          monitoringStatus: "Active",
          inStock: product.inStock,
          lastScrapedAt: new Date(),
          createdAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [products.userId, products.url],
          set: {
            currentPrice: product.price,
            inStock: product.inStock,
            lastScrapedAt: new Date(),
          },
        })
        .returning();

      if (!updatedRow) throw new Error("Product insert failed");
      // Insertamos el historial el la tabla scrapedProducts
      await tx.insert(scrapedProducts).values({
        productId: updatedRow.id,
        price: updatedRow.currentPrice,
        inStock: updatedRow.inStock,
        rawData: null,
        scrapedAt: new Date(),
      });

      // Retornar el objeto de dominio mapeado desde la fila real de la DB.
      if (!updatedRow)
        throw new Error("Failed to save or update product in the database.");
      return ProductMapper.toDomain(updatedRow);
    });
  }
  /**
   * @description Elimina un producto por su ID.
   * @param id - El ID del producto a eliminar.
   * @returns Una promesa que resuelve con el objeto del producto eliminado o `null` si no se encuentra.
   */
  async delete(id: string): Promise<Product | null> {
    const result = await db
      .delete(products)
      .where(eq(products.id, id))
      .returning();
    return result.length ? ProductMapper.toDomain(result[0]) : null;
  }
}
