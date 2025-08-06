import { http, HttpResponse } from 'msw'
import mockScraperProduc from '@/mocks/data/mock-scraper.json'
import mockProducts from '@/mocks/data/mock-products-by-user.json'
import { AddProductDataType, ProductType, ScrapedProduct } from '@/shared/types/product';

const API_BASE_URL_MSW = 'http://localhost:3000';
const mockScrapedData: ScrapedProduct = mockScraperProduc;

export const handlers = [
  http.get('/api/v1/scrape', async ({request}) => {
    const url = new URL(request.url)
    const site = url.searchParams.get('site')
    const productUrl = url.searchParams.get('product_url')

    if (!site || !productUrl) {
      return HttpResponse.json({message: 'hacen falta el parametro site o product url'})
    }
    if (site === 'liverpool' && productUrl.includes("www.liverpool.com.mx")) {
      return HttpResponse.json(mockScrapedData, {status: 200})
    }

    return HttpResponse.json({ message: 'No se encontraron datos para los parámetros proporcionados.' }, { status: 404 });
  }),
  http.post<any, AddProductDataType>('/products', async({request}) => {
    const {url, name, rules} = await request.json()
    const newProduct: ProductType = {
        id: "f2f36252-3f9d-4a29-8c1d-ac4f6a147224",
        userId: "12345",
        name: "Xbox Series S All-Digital Console",
        originalUrl: "https://www.amazon.com/X-Box-S-All-Digital-Console/dp/B09PYTJXXQ/ref=sr_1_3?crid=24PMN6B9F09ZJ&dib=eyJ2IjoiMSJ9.1GY_wIP_RQBNN8WXDrf500YFu9mjtbu5W-XVvuevB1EjZG2t5amMh9EU9DjQiALzgKaDdUDBR7L-JtrxmwmnqGBgg-ie6ryUgl8XkYxI294LFudx_5WWh2J5lntc4GcgW8hC8ZrgZqpxJx9SaM-gNV_90o6y3uGXL8m5Cls5Jc9LVq34sgX4T8fjWf44EBjP3s7HwZUjZw3NBx8V1SOLZHTgpm8cdmm1EafXTtByh8s.Dox-5CRijWsuw4eataaOL4Ta58EuzY4UxsIKQboxsjc&dib_tag=se&keywords=xbox+series+s&qid=1754353846&sprefix=x%2Caps%2C144&sr=8-3",
        domain: "amazon",
        imageUrl: "https://m.media-amazon.com/images/I/61hbxViX8PL._SY679_.jpg",
        currentPrice: 6556.00,
        currency: "MXN",
        initialPrice: 6556.00,
        lastCheckedAt: "2025-07-19T18:00:00Z",
        createdAt: "2025-07-18T12:00:00Z",
        status: "paused",
        notificationRules: []
      }
    mockProducts.data.push(newProduct)
    return HttpResponse.json(newProduct, { status: 201 });
  })
]
