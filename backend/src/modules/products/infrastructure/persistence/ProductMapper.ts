import { Store } from "../../../scraper/domain/store.enums";
import { Product } from "../../domain/entities/Product";
import { ProductMonitoringStatus } from "../product-monitoring.enum";
import { ProductRow } from "./drizzle/products.schema";

export class ProductMapper {
  static toDomain(row: ProductRow): Product {
    return Product.create({
      id: row.id,
      name: row.name,
      currentPrice: row.currentPrice,
      url: row.url,
      provider: row.provider as Store,
      imageUrl: row.imageUrl ?? "",
      inStock: row.inStock,
      monitoringStatus: row.monitoringStatus as ProductMonitoringStatus,
      createdAt: row.createdAt ?? new Date(),
    });
  }

  static toDomainInList(rows: ProductRow[]): Product[] {
    return rows.map((rowData) =>
      Product.create({
        id: rowData.id,
        name: rowData.name,
        currentPrice: rowData.currentPrice,
        url: rowData.url,
        provider: rowData.provider as Store,
        imageUrl: rowData.imageUrl ?? "",
        inStock: rowData.inStock,
        monitoringStatus: rowData.monitoringStatus as ProductMonitoringStatus,
        createdAt: rowData.createdAt ?? new Date(),
      })
    );
  }
}
