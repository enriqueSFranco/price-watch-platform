import { BaseQueryFn } from '@reduxjs/toolkit/query/react';
import { mockProducts } from '@/data/mockProducts';
import type { Product } from '../modules/products/domain/Product.schema';
import { v4 as uuidv4 } from 'uuid';

let productDB: Product[] = [...mockProducts]

const delay = (ms: number = 500) => new Promise((resolve) => setTimeout(resolve, ms))

export const mockBaseQuery: BaseQueryFn<{ url: string; method?: string; body?: any }, unknown, unknown> = async ({url, method, body}) => {
  await delay()
  console.log(`[MOCK API] Intercepted: ${method} ${url}`);

  if (url === "/api/products" && method === "GET") {
    return {data: productDB}
  }

  if (url === "/api/products" && method === "POST") {
    if (!body || !body.name || !body.url || !body.currentPrice) {
      return {
        error: { status: 400, data: { message: 'Missing required fields for new product' } },
      };
    }
    const newProduct: Product = {
      id: uuidv4(),
      userId: body.userId || uuidv4(),
      name: body.name,
      initialPrice: body.initialPrice || null,
      currentPrice: body.currentPrice,
      url: body.url,
      store: body.store || 'MockStore',
      imageUrl: body.imageUrl || 'https://placehold.co/400x400/38B2AC/FFFFFF?text=Nuevo+Producto',
      inStock: true,
      monitoringStatus: 'active',
      priceHistory: [{ price: body.currentPrice, date: new Date() }],
      lastScrapedAt: new Date(),
      createdAt: new Date(),
    }
    productDB.unshift(newProduct)
    return { data: newProduct };
  }

  return {
    error: { status: 404, data: { message: `Route not mocked: ${method} ${url}` } },
  };
}

