"""Parser de páginas de producto de Liverpool (liverpool.com.mx).

Este módulo contiene TODO lo que se sabe de la estructura HTML de Liverpool, y
nada más. Son funciones puras (HTML -> datos): no abren navegador ni usan red,
así que se prueban con texto. Cómo se descarga la página es asunto de otro módulo.

Cuando Liverpool rediseñe su sitio, este archivo es el único que debería cambiar.
Empieza por las constantes de selectores.

Estrategia de selectores
------------------------
Liverpool usa clases de Tailwind (`flex`, `text-heading-2xl`...) que describen
estilo, no significado, y cambian en cada rediseño visual. Por eso NO se usan.
Nos apoyamos en `data-testid`, que existe para pruebas automáticas y es más estable.

El `data-testid` de muchos elementos empieza con el SKU del producto
("1200445364-configurator-price"), que cambia por producto. Por eso se busca por
cómo TERMINA, con el operador CSS `$=`.
"""

from decimal import Decimal

from parsel import Selector
from pydantic import HttpUrl, ValidationError

from pricewatch.scraping.errors import ParseError
from pricewatch.scraping.models import ScrapedProduct, Store
from pricewatch.scraping.parsing import parse_price, text_of

# SELECTORES

# contenedor del precio
PRICE_BOX = '[data-testid$="-configurator-price"]'
DISCOUNTED = f'{PRICE_BOX} [data-testid="discounted"]'
ORIGINAL = f'{PRICE_BOX} [data-testid="original"]'


def extract_prices(sel: Selector) -> tuple[Decimal | None, Decimal | None]:
    """
    Lee el precio actual y el precio original (tachado) de la pagina

    Returns:
        Una tupla `(price, original_price)`:

        - `price`: precio al que se vende HOY, o None si no se pudo leer
        - `original_price`: precio antes del descuento, o None si no hay descuento


    """
    if sel.css(ORIGINAL):
        price = parse_price(text_of(sel, DISCOUNTED))
        original = parse_price(text_of(sel, ORIGINAL))
    else:
        price = parse_price(text_of(sel, PRICE_BOX))
        original = None

    # Un "original" que no supera al precio actual no es un descuento: es un dato
    # raro de la página. Lo descartamos para no producir descuentos negativos.
    if price is not None and original is not None and original <= price:
        original = None

    return price, original


NAME_SELECTORS = (".ml-product-info h1", "h1")  # de más a menos específico

IMAGE_SELECTORS = (
    '[data-testid$="-gallery__main__image__image"]',  # imagen principal movile
    '[data-testid$="-gallery__gallery-0__image__image"]',  # primera imagen desktop
    'meta[property="og:image"]',  # respaldo
)


def extract_name(sel: Selector) -> str | None:
    """Devuelve el nombre del producto, o None si ningún selector lo encuentra."""

    for css in NAME_SELECTORS:
        name = text_of(sel, css)

        if name:
            return name

    return None


def extract_image(sel: Selector) -> str | None:
    """Devuelve la URL de la imagen principal, o None si ningún selector la encuentra."""

    for css in IMAGE_SELECTORS:
        ele = sel.css(css).get()

        if not ele:
            continue

        if css.startswith("meta"):
            src = sel.css(css).attrib.get("content")
        else:
            src = sel.css(css).attrib.get("src")

        if src:
            return src.strip()

    return None


def parse_product(html: str, url: str) -> ScrapedProduct:
    """Convierte el HTML de una página de producto de Liverpool en un ScrapedProduct.

    Args:
        html: HTML completo de la página, ya renderizado.
        url: URL de donde salió ese HTML. Se guarda en el resultado.

    Raises:
        ParseError: si faltan datos obligatorios (nombre o precio) o si no cumplen
            las reglas de ScrapedProduct. Casi siempre significa que Liverpool
            cambió su HTML y hay que actualizar los selectores de arriba.

    Falla de forma ruidosa a propósito: preferimos un error claro a guardar un
    producto con datos inventados (por ejemplo, un precio de 0).
    """

    sel = Selector(text=html)

    name = extract_name(sel)
    price, original = extract_prices(sel)

    if name is None:
        raise ParseError("NO se encontro el nombre del producto, revisar NAME_SELECTORS")

    if price is None:
        raise ParseError(
            "NO se encontro el precio original del producto, revisar los selectores de precio"
        )

    try:
        return ScrapedProduct(
            store=Store.LIVERPOOL,
            url=HttpUrl(url),
            name=name,
            price=price,
            original_price=original,
            image_url=extract_image(sel),
            in_stock=None,  # TODO: Revisar la estructura del HTML de un producto que no tenga stock
        )
    except ValidationError as exc:
        # Datos presentes pero inválidos (por ejemplo, un precio de 0).
        raise ParseError(f"Datos invalidos del producto: {exc}") from exc
