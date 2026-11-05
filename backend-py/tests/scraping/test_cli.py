"""Tests del CLI: se prueba el ADAPTADOR (argumentos, stdout, stderr, códigos de salida).

Son tests síncronos a propósito: el CLI llama a asyncio.run, que no puede ejecutarse
dentro del event loop de un test `async def`.

Se usa una tienda de mentira (monkeypatch) y el servidor local de conftest.py, porque
el parser de cada tienda ya tiene sus propios tests.
"""

import json
from collections.abc import Callable
from decimal import Decimal
from pathlib import Path

import pytest
from pydantic import HttpUrl
from typer.testing import CliRunner

from pricewatch.cli import app
from pricewatch.scraping.errors import ParseError
from pricewatch.scraping.models import ScrapedProduct, Store
from pricewatch.scraping.stores import STORES, StoreSpec

runner = CliRunner()


def fake_parse(html: str, url: str) -> ScrapedProduct:
    return ScrapedProduct(
        store=Store.LIVERPOOL,
        url=HttpUrl(url),
        name="Producto de prueba",
        price=Decimal("10"),
    )


def broken_parse(html: str, url: str) -> ScrapedProduct:
    raise ParseError("selector roto")


def use_fake_store(
    monkeypatch: pytest.MonkeyPatch, parse: Callable[[str, str], ScrapedProduct]
) -> None:
    monkeypatch.setitem(STORES, Store.LIVERPOOL, StoreSpec(ready_selector="#ready", parse=parse))


# --- Sin navegador: validación de argumentos -------------------------------


def test_help_lists_the_scrape_command() -> None:
    result = runner.invoke(app, ["--help"])

    assert result.exit_code == 0
    assert "scrape" in result.stdout


def test_missing_required_options_is_a_usage_error() -> None:
    assert runner.invoke(app, ["scrape"]).exit_code == 2


def test_attempts_must_be_at_least_one() -> None:
    args = ["scrape", "--store", "liverpool", "--url", "https://x.mx/p", "--attempts", "0"]

    assert runner.invoke(app, args).exit_code == 2


def test_store_without_a_scraper_is_a_usage_error(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.delitem(STORES, Store.AMAZON, raising=False)

    result = runner.invoke(app, ["scrape", "--store", "amazon", "--url", "https://x.mx/p"])

    assert result.exit_code == 2
    assert "liverpool" in result.stderr  # lista las tiendas disponibles


# --- Con navegador real contra el servidor local ---------------------------


@pytest.mark.browser
def test_scrape_prints_only_the_json_product_on_stdout(
    monkeypatch: pytest.MonkeyPatch, server_url: str, tmp_path: Path
) -> None:
    use_fake_store(monkeypatch, fake_parse)
    args = [
        "scrape",
        "--store",
        "liverpool",
        "--url",
        f"{server_url}/ok",
        "--debug-dir",
        str(tmp_path / "debug"),
    ]

    result = runner.invoke(app, args)

    assert result.exit_code == 0
    # Si cualquier otra cosa (un log, un aviso) se escribiera en stdout, esto fallaría:
    # es lo que protege que la salida se pueda encadenar con otras herramientas.
    data = json.loads(result.stdout)
    assert data["name"] == "Producto de prueba"
    assert data["price"] == "10"  # Decimal como texto, no como float


@pytest.mark.browser
def test_scrape_failure_exits_with_1_and_reports_on_stderr(
    monkeypatch: pytest.MonkeyPatch, server_url: str, tmp_path: Path
) -> None:
    use_fake_store(monkeypatch, broken_parse)
    args = [
        "scrape",
        "--store",
        "liverpool",
        "--url",
        f"{server_url}/ok",
        "--debug-dir",
        str(tmp_path / "debug"),
    ]

    result = runner.invoke(app, args)

    assert result.exit_code == 1
    assert "ParseError: selector roto" in result.stderr
    assert result.stdout == ""  # en un fallo, stdout queda vacío
