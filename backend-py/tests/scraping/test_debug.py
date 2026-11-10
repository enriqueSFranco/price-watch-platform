"""Tests del volcado de diagnóstico.

Usan un Chromium real pero sin red (set_content). `tmp_path` es una carpeta temporal
que pytest borra al terminar, así que los tests no dejan archivos en el proyecto.
"""

from pathlib import Path

import pytest

from pricewatch.scraping.browser import BrowserSession
from pricewatch.scraping.debug import save_debug_snapshot


@pytest.mark.browser
async def test_snapshot_saves_html_and_screenshot(tmp_path: Path) -> None:
    # La carpeta "debug" NO existe todavía: también se comprueba que se crea sola.
    directory = tmp_path / "debug"

    async with BrowserSession() as session, session.page() as page:
        await page.set_content("<h1>hola mundo</h1>")
        html_path = await save_debug_snapshot(page, directory, "liverpool-ParseError")

    assert html_path is not None
    assert html_path.name.startswith("liverpool-ParseError-")
    assert "hola mundo" in html_path.read_text(encoding="utf-8")
    assert html_path.with_suffix(".png").exists()


@pytest.mark.browser
async def test_snapshot_never_raises_when_the_page_is_already_closed(tmp_path: Path) -> None:
    """Protege la regla de oro: el diagnóstico no debe tapar el error original."""
    async with BrowserSession() as session:
        async with session.page() as page:
            pass  # al salir, el contexto y la página se cierran

        assert await save_debug_snapshot(page, tmp_path, "x") is None
