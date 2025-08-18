import { and, asc, count, desc, eq, ilike, sql } from "drizzle-orm";
import { db } from "../../../../config/database";
import {
  ProductInsert,
  ProductMonitoringStatus,
  products,
} from "../../../../db/schema";
import { ApiError } from "../../../../core/errors/api.error";
import { Product } from "../../../../core/domain/products/Product";
import { IProductRepository } from "../../../../core/ports/repositories/IProductRepository";
import { ProductMapper } from "../../../mappers/ProductMapper";
import { ProductUrl } from "../../../../core/domain/products/ProductUrl";
import { SearchProductType } from "../../../../schemas/search-product.schema";

// Acceden directamente a la base de datos. Nada de lógica de negocio.
export class DrizzleProductRepository implements IProductRepository {
  async findAllActive(): Promise<Product[]> {
    const rows = await db.query.products.findMany({
      where: eq(products.monitoringStatus, ProductMonitoringStatus.ACTIVE),
    });
    return ProductMapper.toDomainList(rows);
  }

  async findByUrl(url: ProductUrl): Promise<Product | null> {
    const { urlHost, urlPath } = ProductUrl.extractHostAndPath(url.toString());

    // Intento exact match usando índice compuesto
    let result = await db.query.products.findFirst({
      where: and(eq(products.urlHost, urlHost), eq(products.urlPath, urlPath)),
    });

    if (!result) {
      result = await db.query.products.findFirst({
        where: sql`${products.productUrl} ILIKE ${"%" + url + "%"}`,
      });
    }
    return result ? ProductMapper.toDomain(result) : null;
  }

  /**
   * @description Obtiene un producto por su identificador único
   * @param id - El identificador único del producto
   * @returns Un objeto de tipo Product o null si no se encuentra
   */
  async findOneById(id: string): Promise<Product | null> {
    const result = await db.query.products.findFirst({
      where: eq(products.id, id),
    });
    return result ? ProductMapper.toDomain(result) : null;
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

    return ProductMapper.toDomainList(results);
  }

  /**
   * @description Obtiene todos los productos de la base de datos
   * @returns Un array con todos los productos o null si no hay ninguno
   */
  async findAll(): Promise<Product[]> {
    const results = await db.query.products.findMany();
    if (!results || results.length === 0) return [];
    return ProductMapper.toDomainList(results);
  }

  /**
   * @description Busca productos con paginación en la base de datos con paginación, filtrado y ordenación
   * La búsqueda es insensible a mayúsculas/minúsculas y segura contra inyección SQL
   * @param query - El término de búsqueda para el nombre del producto
   * @param page - El número de página (0-based) para la paginación
   * @param perPage - La cantidad de elementos por página
   * @returns Un objeto que contiene un array de productos y el conteo total de registros que coinciden
   */
  async search({
    q,
    page,
    per_page: perPage,
    sortBy = "name",
    sortOrder = "asc",
  }: SearchProductType): Promise<{ data: Product[]; totalCount: number }> {
    const offset = (page - 1) * perPage;
    const sanitizedQuery = q.replace(/[%_]/g, "\\$&");
    const searchCondition = sql`${products.name} ILIKE ${
      "%" + sanitizedQuery + "%"
    } ESCAPE '\\'`;

    // consulta para obtner el conteo total de productos que coinciden
    const countQuery = await db
      .select({ count: count() })
      .from(products)
      .where(searchCondition);
    const totalCount = countQuery[0].count;

    // consulta para obtener los productos paginados y filtrados
    const orderByColum = products[sortBy] || products.name;
    const orderByDirection =
      sortOrder === "asc" ? asc(orderByColum) : desc(orderByColum);

    const results = await db.query.products.findMany({
      where: searchCondition,
      limit: perPage,
      offset,
      orderBy: [orderByDirection],
    });
    const data = results ? ProductMapper.toDomainList(results) : [];

    return { data, totalCount };
  }

  /**
   * @description Crea un nuevo producto en la base de datos
   * @param product - Objeto con los datos del nuevo producto, sin id, fechas de creacion y fecha de scraper
   * @returns Objeto del producto creado
   */
  async create(
    product: Omit<Product, "id" | "createdAt" | "lastScrapedAt">,
    userId: string
  ): Promise<Product> {
    const persistenceProduct = ProductMapper.toPersistence(product, userId);
    const [result] = await db
      .insert(products)
      .values(persistenceProduct)
      .returning();

    if (!result) {
      throw new ApiError("No se pudo crear el producto", 500, "CREATE_FAILED");
    }
    return ProductMapper.toDomain(result);
  }

  /**
   * @description Actualiza un producto existente por su ID.
   * @param id - El ID del producto a actualizar.
   * @param product Objeto con los campos a actualizar.
   * @returns Objeto del producto actualizado o `null` si no se encuentra.
   */
  async update(id: string, updates: Partial<Product>): Promise<Product> {
    const updatedData = {
      ...updates,
      lastScrapedAt: new Date(),
    };

    const result = await db
      .update(products)
      .set(updatedData as Partial<ProductInsert>)
      .where(eq(products.id, id))
      .returning();

    return ProductMapper.toDomain(result[0]);
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
