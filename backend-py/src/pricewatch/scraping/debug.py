"""Volcado de diagnóstico: guarda lo que el navegador vio cuando algo falló.

Cuando un scrapeo falla (típicamente con ParseError), el mensaje de error no basta
para arreglar el parser: hay que ver qué página recibió el scraper. Este módulo guarda
el HTML renderizado y una captura de pantalla. Ese mismo HTML es la materia prima para
crear un fixture de tests nuevo.

"""

import asyncio
import logging
from datetime import UTC, datetime
from pathlib import Path

from playwright.async_api import Error as PlaywrightError
from playwright.async_api import Page

log = logging.getLogger(__name__)

DEFAULT_DEBUG_DIR = Path(".debug")


def _write_text(path: Path, text: str) -> None:
    """Escribe un archivo de texto, creando la carpeta si hace falta."""

    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(text, encoding="utf-8")


async def save_debug_snapshot(page: Page, directory: Path, label: str) -> Path | None:
    """Guarda el HTML y una captura de la página, para investigar un fallo.

    Se crean dos archivos con el mismo nombre base: `<label>-<fecha>.html` y
    `<label>-<fecha>.png`. La fecha incluye microsegundos para que dos fallos en el
    mismo segundo no se sobrescriban.

    Args:
        page: la página tal como quedó tras el fallo (todavía abierta).
        directory: carpeta de destino; se crea si no existe.
        label: prefijo del nombre, para reconocer el volcado de un vistazo
            (por ejemplo "liverpool-ParseError"). Lo elige quien llama; no debe
            contener separadores de ruta.

    Returns:
        La ruta del archivo .html guardado, o None si no se pudo guardar.

    Esta función NO lanza errores de Playwright ni de disco (ver el docstring del
    módulo). El HTML se guarda primero porque es lo valioso; si la captura falla, el
    HTML se conserva igual.
    """

    stem = f"{label}-{datetime.now(UTC).strftime('%Y%m%d-%H%M%S-%f')}"
    html_path = directory / f"{stem}.html"

    try:
        html = await page.content()

        # to_thread manda la escritura a otro hilo: escribir a disco bloquea, y en
        # código async bloquear frenaría todo el programa mientras tanto.
        await asyncio.to_thread(_write_text, html_path, html)
    except (PlaywrightError, OSError) as exc:
        log.warning("No se pudo guardar el HTML de diagnóstico (%s): %s", label, exc)
        return None

    try:
        await page.screenshot(path=directory / f"{stem}.png", full_page=True)
    except PlaywrightError as exc:
        log.warning("No se pudo guardar la captura de diagnóstico (%s): %s", label, exc)

    log.info("Volcado de diagnóstico guardado en %s", html_path)
    return html_path
