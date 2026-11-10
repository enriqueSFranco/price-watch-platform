"""Tests de scrape_product: la orquestación completa, contra un servidor LOCAL.

La tienda real se sustituye por una "tienda de mentira" registrada con monkeypatch
(que restaura STORES al terminar cada test). Así se prueba CÓMO se conectan las
piezas (reintentos, volcados, errores) sin depender del HTML de ninguna tienda; el
parser de Liverpool ya tiene sus propios tests.
"""

from decimal import Decimal
from pathlib import Path

import pytest
from pydantic import HttpUrl
from tenacity import wait_none

from pricewatch.scraping.browser import BrowserSession
from pricewatch.scraping.errors import (
    BlockedError,
    NavigationError,
    ParseError,
    ProductNotFoundError,
)
from pricewatch.scraping.models import ScrapedProduct, Store
from pricewatch.scraping.service import ScrapeConfig, scrape_product
from pricewatch.scraping.stores import STORES, StoreSpec

pytestmark = pytest.mark.browser


def fake_parse(html: str, url: str) -> ScrapedProduct:
    return ScrapedProduct(
        store=Store.LIVERPOOL,
        url=HttpUrl(url),
        name="Producto de prueba",
        price=Decimal("10"),
    )


def broken_parse(html: str, url: str) -> ScrapedProduct:
    raise ParseError("selector roto")


def use_fake_store(monkeypatch: pytest.MonkeyPatch, parse) -> None:  # type: ignore[no-untyped-def]
    spec = StoreSpec(ready_selector="#ready", parse=parse)
    monkeypatch.setitem(STORES, Store.LIVERPOOL, spec)


async def test_returns_the_parsed_product(
    monkeypatch: pytest.MonkeyPatch, server_url: str, tmp_path: Path
) -> None:
    use_fake_store(monkeypatch, fake_parse)

    async with BrowserSession() as session:
        product = await scrape_product(
            session,
            Store.LIVERPOOL,
            f"{server_url}/ok",
            config=ScrapeConfig(debug_dir=tmp_path / "debug"),
        )

    assert product.name == "Producto de prueba"
    assert product.price == Decimal("10")


async def test_retries_transient_failures(
    monkeypatch: pytest.MonkeyPatch, server_url: str, requests_log: list[str]
) -> None:
    use_fake_store(monkeypatch, fake_parse)

    async with BrowserSession() as session:
        with pytest.raises(NavigationError):  # el último error original, no un RetryError
            await scrape_product(
                session,
                Store.LIVERPOOL,
                f"{server_url}/boom",
                config=ScrapeConfig(
                    max_attempts=2,
                    wait=wait_none(),
                    debug_dir=None,
                ),
            )

    assert requests_log.count("/boom") == 2  # se intentó dos veces


async def test_does_not_retry_a_block(
    monkeypatch: pytest.MonkeyPatch, server_url: str, requests_log: list[str]
) -> None:
    use_fake_store(monkeypatch, fake_parse)

    async with BrowserSession() as session:
        with pytest.raises(BlockedError):
            await scrape_product(
                session,
                Store.LIVERPOOL,
                f"{server_url}/forbidden",
                config=ScrapeConfig(
                    max_attempts=3,
                    wait=wait_none(),
                    debug_dir=None,
                ),
            )

    assert requests_log.count("/forbidden") == 1  # insistir empeoraría el bloqueo


async def test_parse_error_saves_a_snapshot_and_is_not_retried(
    monkeypatch: pytest.MonkeyPatch,
    server_url: str,
    requests_log: list[str],
    tmp_path: Path,
) -> None:
    use_fake_store(monkeypatch, broken_parse)
    debug_dir = tmp_path / "debug"

    async with BrowserSession() as session:
        with pytest.raises(ParseError, match="selector roto"):
            await scrape_product(
                session,
                Store.LIVERPOOL,
                f"{server_url}/ok",
                config=ScrapeConfig(wait=wait_none(), debug_dir=debug_dir),
            )

    # El parseo vive DENTRO del intento, pero no se repite: ParseError no es reintentable.
    assert requests_log.count("/ok") == 1

    snapshots = list(debug_dir.glob("liverpool-ParseError-*.html"))
    assert len(snapshots) == 1
    assert 'id="ready"' in snapshots[0].read_text(encoding="utf-8")


async def test_block_saves_a_snapshot(
    monkeypatch: pytest.MonkeyPatch, server_url: str, tmp_path: Path
) -> None:
    use_fake_store(monkeypatch, fake_parse)
    debug_dir = tmp_path / "debug"

    async with BrowserSession() as session:
        with pytest.raises(BlockedError):
            await scrape_product(
                session,
                Store.LIVERPOOL,
                f"{server_url}/forbidden",
                config=ScrapeConfig(wait=wait_none(), debug_dir=debug_dir),
            )

    assert len(list(debug_dir.glob("liverpool-BlockedError-*.html"))) == 1


async def test_not_found_does_not_save_a_snapshot(
    monkeypatch: pytest.MonkeyPatch, server_url: str, tmp_path: Path
) -> None:
    use_fake_store(monkeypatch, fake_parse)
    debug_dir = tmp_path / "debug"

    async with BrowserSession() as session:
        with pytest.raises(ProductNotFoundError):
            await scrape_product(
                session,
                Store.LIVERPOOL,
                f"{server_url}/missing",
                config=ScrapeConfig(wait=wait_none(), debug_dir=debug_dir),
            )

    # Una página 404 no enseña nada: no se guarda volcado ni se crea la carpeta.
    assert not debug_dir.exists()


@pytest.mark.parametrize("store", [Store.AMAZON])
@pytest.mark.filterwarnings("ignore")
async def test_unregistered_store_fails_before_opening_anything(
    monkeypatch: pytest.MonkeyPatch, store: Store
) -> None:
    monkeypatch.delitem(STORES, store, raising=False)
    session = BrowserSession()  # sin abrir: si se intentara usar, fallaría de otra forma

    with pytest.raises(ValueError, match=store.value):
        await scrape_product(session, store, "https://example.com/x")
