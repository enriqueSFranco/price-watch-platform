"""Interfaz de línea de comandos: un ADAPTADOR delgado sobre el caso de uso.

Su único trabajo es traducir entre la terminal y `scrape_product`:
    argumentos de texto -> tipos del dominio,
    resultado           -> JSON en stdout,
    errores             -> mensaje en stderr + código de salida.

No contiene lógica de negocio. Prueba de fuego: si mañana el mismo caso de uso se
expone como API HTTP, este archivo es lo único que se descarta.

Convenciones que se respetan a propósito (permiten usarlo en scripts y cron):
    - stdout lleva SOLO el dato (JSON): `pricewatch scrape ... | jq .price` funciona.
    - stderr lleva todo lo demás: logs y mensajes de error.
    - Códigos de salida: 0 = ok, 1 = el scrapeo falló, 2 = uso incorrecto (este último
      lo emite Typer/Click, por convención).
"""

import asyncio
import logging
from pathlib import Path
from typing import Annotated

import typer

from pricewatch.scraping.browser import BrowserSession
from pricewatch.scraping.debug import DEFAULT_DEBUG_DIR
from pricewatch.scraping.errors import ScraperError
from pricewatch.scraping.models import ScrapedProduct, Store
from pricewatch.scraping.retry import DEFAULT_MAX_ATTEMPTS
from pricewatch.scraping.service import ScrapeConfig, scrape_product
from pricewatch.scraping.stores import STORES

app = typer.Typer(no_args_is_help=True, add_completion=False)


@app.callback()
def main(
    verbose: Annotated[
        bool, typer.Option("--verbose", "-v", help="Mostrar el log detallado.")
    ] = False,
) -> None:
    """PriceWatch: monitor de precios."""
    # Un callback corre ANTES de cualquier subcomando: aquí va lo global. Además, tener
    # un callback evita que Typer, con un único comando, lo trate como el comando
    # principal y desaparezca la palabra `scrape`.
    # basicConfig escribe en stderr por defecto, que es lo que queremos (ver arriba).
    logging.basicConfig(
        level=logging.INFO if verbose else logging.WARNING,
        format="%(asctime)s %(levelname)s %(name)s: %(message)s",
    )


async def _scrape(
    store: Store,
    url: str,
    *,
    headed: bool,
    max_attempts: int,
    debug_dir: Path,
) -> ScrapedProduct:
    # La sesión se abre AQUÍ y no dentro de scrape_product: quien conoce cuánto vive el
    # recurso es quien lo abre y lo cierra. Hoy vive una llamada; con un lote de
    # productos viviría todo el lote.
    async with BrowserSession(headless=not headed) as session:
        return await scrape_product(
            session, store, url, config=ScrapeConfig(max_attempts=max_attempts, debug_dir=debug_dir)
        )


@app.command()
def scrape(
    store: Annotated[Store, typer.Option(help="Tienda a la que pertenece la URL.")],
    url: Annotated[str, typer.Option(help="URL de la página del producto.")],
    headed: Annotated[
        bool, typer.Option("--headed", help="Mostrar la ventana del navegador.")
    ] = False,
    attempts: Annotated[
        int, typer.Option(min=1, help="Intentos totales ante fallos transitorios.")
    ] = DEFAULT_MAX_ATTEMPTS,
    debug_dir: Annotated[
        Path, typer.Option(help="Carpeta para los volcados de diagnóstico.")
    ] = DEFAULT_DEBUG_DIR,
) -> None:
    """Scrapea un producto y lo imprime como JSON."""
    # Validación en la FRONTERA. Una tienda que está en el enum pero aún no tiene
    # scraper es un error de uso (código 2), no un bug. scrape_product también lo
    # comprueba, pero con otra intención: protege su contrato frente a cualquier
    # llamador; aquí lo traducimos a un mensaje útil para quien teclea.
    if store not in STORES:
        available = ", ".join(sorted(STORES))
        raise typer.BadParameter(
            f"esa tienda aún no tiene scraper. Disponibles: {available}", param_hint="--store"
        )

    try:
        product = asyncio.run(
            _scrape(store, url, headed=headed, max_attempts=attempts, debug_dir=debug_dir)
        )
    except ScraperError as exc:
        typer.echo(f"{type(exc).__name__}: {exc}", err=True)
        raise typer.Exit(code=1) from exc

    # Decimal se serializa como texto ("1359.20"), no como número: así ningún lector
    # JSON lo convierte a float y pierde exactitud.
    typer.echo(product.model_dump_json(indent=2))
