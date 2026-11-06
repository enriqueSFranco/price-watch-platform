"""Caso de uso: scrapear un producto de punta a punta.

Es la ÚNICA pieza que conoce a las demás y las conecta:

    BrowserSession --(una página nueva por intento)--> fetch_html --> parse
         ^                                                  |
         |                  retry_async  <--- errores tipados (retryable)
         |
    save_debug_snapshot  (solo cuando ver la página ayuda a diagnosticar)

Ninguna de las piezas conoce a las otras: fetch_html no sabe de tiendas, retry_async no
sabe de navegadores, parse no sabe de la red. Aquí se componen.
"""

import logging
from dataclasses import dataclass
from pathlib import Path

from tenacity.wait import wait_base

from pricewatch.scraping.browser import BrowserSession
from pricewatch.scraping.debug import save_debug_snapshot
from pricewatch.scraping.errors import BlockedError, ParseError, ScraperError
from pricewatch.scraping.models import ScrapedProduct, Store
from pricewatch.scraping.retry import DEFAULT_MAX_ATTEMPTS, retry_async
from pricewatch.scraping.scraper import fetch_html
from pricewatch.scraping.stores import STORES, StoreSpec

log = logging.getLogger(__name__)

SNAPSHOT_ERRORS = (ParseError, BlockedError)


@dataclass(frozen=True, slots=True)
class ScrapeConfig:
    max_attempts: int = DEFAULT_MAX_ATTEMPTS
    debug_dir: Path | None = None
    wait: wait_base | None = None


def _spec_for(store: Store) -> StoreSpec:
    """
    Busca la especificacion de la tienda o falla si no está registrada

    Lanza ValueError y no un ScraperError: una tienda sin scraper es un error de quien
    llama (un bug), no un fallo de la tienda. Así tampoco se reintenta.
    """
    spec = STORES.get(store)

    if spec is None:
        supported = ", ".join(sorted(STORES)) or "ninguna"
        raise ValueError(f"No hay scraper registrado para '{store}'. Disponibles: {supported}")

    return spec


async def scrape_product(
    session: BrowserSession, store: Store, url: str, *, config: ScrapeConfig | None = None
) -> ScrapedProduct:
    """
        Descargar y parsea la página de un producto con reintentos y diagnostico.

        Cada intento abre una página nueva (en un contexto aislado), navega, comprueba el
    código HTTP, espera a que el producto se pinte y parsea.
    """
    spec = _spec_for(store)
    conf = config or ScrapeConfig()

    async def attempt() -> ScrapedProduct:
        async with session.page() as page:
            try:
                html = await fetch_html(page, url, ready_selector=spec.ready_selector)
                return spec.parse(html, url)
            except ScraperError as exc:
                if conf.debug_dir is not None and isinstance(exc, SNAPSHOT_ERRORS):
                    await save_debug_snapshot(page, conf.debug_dir, f"{store}-{type(exc).__name__}")
                raise

    product = await retry_async(attempt, max_attempts=conf.max_attempts, wait=conf.wait)
    log.info("%s | %s | %s %s", store, product.name, product.price, product.currency)
    return product
