import { CustomError } from "@/shared/custom-error";
import { EcommerceEnum } from "@/shared/types/e-commerce.enum";
import { ScrapedProduct } from "@/shared/types/product";

const API_BASE_URL = '';

/**
 * Servicio para obtener datos de un producto mediante web scraping.
 * Utiliza AbortSignal para gestionar la cancelación de la petición.
 * @param site Tipo de sitio de comercio electrónico.
 * @param productUrl URL del producto a scrapear.
 * @param signal AbortSignal para cancelar la petición.
 * @returns Los datos del producto scrapeado.
 * @throws Error si la petición falla o los datos no son válidos.
 */
export async function fetchScrapedProduct(site: EcommerceEnum, productUrl: string,  signal?: AbortSignal): Promise<ScrapedProduct | null> {
  try {
    const url = new URL("/scrape", API_BASE_URL);
    url.searchParams.set("site", site);
    url.searchParams.set("product_url", productUrl);

    console.log(`[Frontend Scraper Service]: Fetching data from: ${url.toString()}`);

    const response = await fetch(url.toString(), {signal});

    if (!response.ok) {
      const errorBody = await response.json().catch(() => ({}));
      const errorMessage = errorBody.message || response.statusText || `HTTP Error ${response.status}`;
      throw new CustomError(`Failed to scrape product: ${errorMessage}`, {
        code: 'SCRAPER_ERROR'
      })
    }

    const data = await response.json();
    if (!data || typeof data.name !== 'string' || typeof data.currentPrice !== 'number') {
      throw new CustomError("Invalid data received from scraper.", {code: 'SCRAPER_ERROR', cause: data});
    }

    return data as ScrapedProduct;
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      console.log('Abortando petición:', error.message);
      return Promise.reject(error);
    }

    const friendlyError = (error instanceof Error)
      ? error.message
      : `Ocurrio un error desconocido: ${JSON.stringify(error)}`;

    console.error(`[Scraper Service]:`, friendlyError);
    throw new CustomError('Scraping failed unexpectedly.', {code: 'SCRAPER_ERROR', cause: error});
  }
}
