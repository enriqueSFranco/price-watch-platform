import { useCallback, useReducer } from "react";
import type { ScrapedProduct } from "@/modules/scraper/domain/ScrapedProduct.schema";
import { ScrapedProductUseCase } from "@/modules/scraper/application/ScrapeProduct.usecase";
import { HttpScraperServiceAdapter } from "@/modules/scraper/infrastructure/api/HttpScraperService.adapter";

interface ScraperState {
  loading: boolean
  error: string | null
  product: ScrapedProduct | null
}

type ScraperAction =
  | { type: 'SCRAPE_START' }
  | { type: 'SCRAPE_SUCCESS', payload: ScrapedProduct }
  | { type: 'SCRAPE_FAILURE', payload: string }
  | { type: 'SCRAPE_RESET' };


const initialState: ScraperState = {
  loading: false,
  error: null,
  product: null
}

function scraperReducer(state: ScraperState, action: ScraperAction): ScraperState {
  switch(action.type) {
    case 'SCRAPE_START':
      return { ...state, loading: true, error: null, product: null };
    case 'SCRAPE_SUCCESS':
      return {...state, loading: false, error: null, product: action.payload}
    case 'SCRAPE_FAILURE':
      return { ...state, loading: false, error: action.payload, product: null };
    case 'SCRAPE_RESET':
      return initialState
    default:
      return state
  }
}

export function useScraper() {
  const [state, dispatch] = useReducer(scraperReducer, initialState)

  const scrape = useCallback(async (url: string) => {
    dispatch({type: 'SCRAPE_START'})
    try {
      const service = new HttpScraperServiceAdapter("/api/scraper")
      const useCase = new ScrapedProductUseCase(service)
      const result = await useCase.execute(url)

      dispatch({type: 'SCRAPE_SUCCESS', payload: result})
      return result
    } catch (err){
      const errorMessage = err instanceof Error ? err.message : "Error desconocido"
      dispatch({type: 'SCRAPE_FAILURE', payload: errorMessage})
      return null;
    }
  }, [])

  return {
    product: state.product,
    loading: state.loading,
    error: state.error,
    scrape,
    reset: () => dispatch({type: 'SCRAPE_RESET'})
  }
}
