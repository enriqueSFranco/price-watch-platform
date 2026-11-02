"""Obtención del HTML de una página de producto.

Responsabilidad: abrir una URL en una página del navegador, comprobar que la
respuesta es utilizable y devolver el HTML YA RENDERIZADO. Nada más.

Lo que este módulo NO hace:
    - No interpreta el HTML (eso es de stores/*: HTML -> ScrapedProduct).
    - No conoce tiendas: lo que varía entre ellas llega como parámetro.
    - No reintenta: cuánto y cuándo reintentar es otra responsabilidad, que se apoya
      en ScraperError.retryable y se añade aparte.
"""

from playwright.async_api import Error as PlaywrightError
from playwright.async_api import Page
from playwright.async_api import TimeoutError as PlaywrightTimeoutError

from pricewatch.scraping.errors import (
    BlockedError,
    NavigationError,
    ParseError,
    ProductNotFoundError,
)

# Códigos con una decisión tomada. Todo lo demás (2xx, 3xx y 4xx no listados) pasa:
# no tenemos evidencia de qué hacer con ellos, y si la página no es de producto, el
# selector de "página lista" fallará y quedará reportado como ParseError.
NOT_FOUND_STATUES = frozenset({404, 410})

# 403 y 429 son bloqueo explícito. 503 es AMBIGUO: puede ser un servidor caído o un
# bloqueo (algunas tiendas responden 503 a los bots).
BLOCKED_STATUS = frozenset({403, 429, 503})

# Cuánto esperar a que aparezca el elemento que indica "la página de producto ya se
# renderizo".
READY_TIMEOUT_MS = 10_000


def raise_for_status(status: int) -> None:
    """Lanza el error tipado que corresponde a un código HTTP, o no hace nada.

        404, 410               -> ProductNotFoundError  (el producto ya no existe)
        403, 429, 503          -> BlockedError          (la tienda nos frenó)
        resto de los 5xx       -> NavigationError       (fallo del servidor, transitorio)
        cualquier otro código  -> no lanza nada

    Raises:
        ProductNotFoundError, BlockedError, NavigationError: según la tabla.
    """

    if status in NOT_FOUND_STATUES:
        raise ProductNotFoundError(f"HTTP {status}")
    if status in BLOCKED_STATUS:
        raise BlockedError(f"HTTP {status}")
    if status >= 500:
        raise NavigationError(f"HTTP {status}")


async def fetch_html(
    page: Page, url: str, ready_selector: str, *, ready_timeout_ms: int = READY_TIMEOUT_MS
) -> str:
    """Abre `url` y devuelve el HTML renderizado, o lanza un error tipado.

    Pasos:
        1. Navegar. Un fallo de red o un timeout de navegación es NavigationError.
        2. Revisar el código HTTP. Si es 404, 403, 5xx..., fallamos YA: esperar 10 s
           a un selector que no va a existir solo retrasaría el error y lo
           disfrazaría de ParseError.
        3. Esperar a `ready_selector`. Si no aparece, ParseError.
        4. Devolver `page.content()`.

    Args:
        page: página aislada entregada por BrowserSession.page().
        url: URL del producto.
        ready_selector: selector CSS de un elemento que SOLO existe cuando la página
            de producto cargó de verdad. Lo aporta cada tienda (es lo que varía),
            por eso es un parámetro y no una constante de este módulo.
        ready_timeout_ms: espera máxima por ese elemento. Es inyectable para que los
            tests no esperen 10 s.

    Por qué `wait_until="domcontentloaded"` y no "load" o "networkidle": las tiendas
    modernas (Liverpool es una app de React) pintan el contenido con JavaScript
    DESPUÉS de que llega el HTML, así que ningún evento del navegador dice "ya está
    el precio"; esperar a un elemento concreto sí. "networkidle" además es poco
    fiable: la analítica mantiene la red ocupada y se espera de más.

    Los errores inesperados de Playwright (el navegador se cierra o se cae durante la
    espera) NO se convierten en ScraperError: son fallos de infraestructura, no de la
    tienda, y conviene verlos explotar tal cual.

    Raises:
        NavigationError: no se pudo cargar la página (red, timeout) o HTTP 5xx.
        BlockedError: HTTP 403, 429 o 503.
        ProductNotFoundError: HTTP 404 o 410.
        ParseError: la página cargó pero el elemento de "lista" nunca apareció.
    """

    try:
        response = await page.goto(url, wait_until="domcontentloaded")
    except PlaywrightError as exc:
        raise NavigationError(f"No se pudo cargar {url}: {exc}") from exc

    # goto devuelve None solo en navegaciones sin respuesta de red (p. ej. about:blank).
    if response is not None:
        raise_for_status(response.status)

    try:
        await page.wait_for_selector(ready_selector, timeout=ready_timeout_ms)
    except PlaywrightTimeoutError as exc:
        title = await page.title()

        raise ParseError(
            f"No apareció '{ready_selector}' en {url} (título de la página: {title!r}). "
            "¿Cambió el HTML de la tienda, o la tienda mostró otra página (bloqueo, captcha)?"
        ) from exc

    return await page.content()
