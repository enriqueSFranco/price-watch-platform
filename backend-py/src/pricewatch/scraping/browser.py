"""Navegador (Playwright): entrega páginas aisladas y garantiza que todo se cierre.

Responsabilidad: "dame una página limpia y asegúrate de limpiar al terminar".

Lo que este módulo NO hace:
    - No conoce tiendas ni selectores (eso vive en stores/).
    - No reintenta ni interpreta códigos HTTP (eso es de base.py, que sí sabe qué
      es "un scrapeo").
    - No camufla el navegador (user-agent, stealth...). Todavía no se ha medido
      ningún bloqueo, y agregar camuflaje sin evidencia es complejidad injustificada.
      Si algún día hace falta, se añade aquí, en `new_context`.

Conceptos de Playwright:
    Browser: el proceso de Chromium. Caro: ~1 s de arranque y >100 MB de RAM.
    Context: un "perfil de incógnito" con cookies y storage propios. Barato.
    Page:    una pestaña dentro de un contexto.

Por eso usamos un navegador por sesión y un contexto por scrapeo: las cookies de un
scrapeo no contaminan al siguiente, y cerrar el contexto limpia todo.
"""

from collections.abc import AsyncIterator
from contextlib import asynccontextmanager
from types import TracebackType
from typing import Self
from urllib.parse import urlparse

from playwright.async_api import Browser, Page, Playwright, Route, async_playwright

# Solo necesitamos el TEXTO de la página. De las imágenes basta el atributo `src`
# (que viene en el HTML), no los bytes: descargarlas solo gasta tiempo y datos.
BLOCKED_RESOURCES_TYPES = frozenset({"image", "media", "font"})

BLOCKED_HOSTS = (
    "doubleclick.net",
    "googlesyndication.com",
    "google-analytics.com",
    "facebook.net",
    "criteo.com",
    "scorecardresearch.com",
)

NAVIGATION_TIMEOUT_MS = 20_000


def is_blocked(url: str, resource_type: str) -> bool:
    """Decide si una petición debe cancelarse. Función pura: se prueba sin navegador.

    Se compara contra el HOST de la URL, no contra un substring. Con substrings,
    "facebook" bloquearía "facebook-fans.mx" y "doubleclick.net" bloquearía
    "https://tienda.mx/?ref=doubleclick.net". Aquí solo coincide el dominio exacto
    o uno de sus subdominios (por ejemplo, "stats.g.doubleclick.net").
    """
    if resource_type in BLOCKED_RESOURCES_TYPES:
        return True
    host = urlparse(url).hostname or ""
    return any(host == blocked or host.endswith(f".{blocked}") for blocked in BLOCKED_HOSTS)


async def _handle_route(route: Route) -> None:
    """Playwright llama a esto por CADA petición que hace la página."""
    request = route.request

    if is_blocked(request.url, request.resource_type):
        await route.abort()
    else:
        await route.continue_()


class BrowserSession:
    """Un Chromium compartido que reparte páginas aisladas.

    Se usa siempre con `async with`, que garantiza el cierre aunque haya errores:

        async with BrowserSession() as session:
            async with session.page() as page:
                await page.goto(url)
    """

    def __init__(self, *, headless: bool = True) -> None:
        self.headless = headless
        self._playwright: Playwright | None = None
        self._browser: Browser | None = None

    async def __aenter__(self) -> Self:
        # incializamos playwright
        self._playwright = await async_playwright().start()

        try:
            # abrir el navegador de chrome
            self._browser = await self._playwright.chromium.launch(headless=self.headless)
        except BaseException:
            # Si __aenter__ falla, Python NO llama a __aexit__. Sin este bloque,
            # el proceso de Playwright quedaría vivo.
            await self._playwright.stop()
            self._playwright = None
            raise

        return self

    async def __aexit__(
        self,
        exc_type: type[BaseException | None],
        exc_val: BaseException | None,
        exc_tb: TracebackType | None,
    ) -> None:
        # Se ejecuta SIEMPRE al salir del `async with`, con o sin error.
        # Volver a None hace que reutilizar la sesión ya cerrada falle con un
        # mensaje claro, en vez de un error críptico de Playwright.

        if self._browser is not None:
            await self._browser.close()
            self._browser = None
        if self._playwright is not None:
            await self._playwright.stop()
            self._playwright = None

    @asynccontextmanager
    async def page(self) -> AsyncIterator[Page]:
        """Entrega una página en un contexto nuevo y aislado.

        Cómo leerlo: lo que va antes de `yield` es la preparación; el código que
        recibe `yield` se ejecuta dentro del `async with` del llamador; lo que va en
        `finally` corre siempre al salir, incluso si el llamador lanzó una excepción.
        Cerrar el contexto cierra también sus páginas y borra cookies y storage.
        """
        if self._browser is None:
            raise RuntimeError("BrowserSession debe usarse dentro de 'async with'")

        ctx = await self._browser.new_context(
            locale="es-MX",
            timezone_id="America/Mexico_City",
            viewport={"width": 1366, "height": 768},
        )

        try:
            await ctx.route("**/*", _handle_route)
            page = await ctx.new_page()
            page.set_default_navigation_timeout(NAVIGATION_TIMEOUT_MS)
            yield page
        finally:
            await ctx.close()
