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


# SELECTORES


from decimal import Decimal

from parsel import Selector

from pricewatch.scraping.parsing import parse_price, text_of

TITLE_CANDIDATES = (".ml-product-info h1", "h1")  # de más a menos específico

# contenedor del precio
PRICE_BOX = '[data-testid$="-configurator-price"]'
DISCOUNTED = f'{PRICE_BOX} [data-testid="discounted"]'
ORIGINAL = f'{PRICE_BOX} [data-testid="original"]'

IMAGES_CANDIDATES = (
    '[data-testid$="-gallery__main__image__image"]::atr(src)',  # imagen principal movile
    '[data-testid$="-gallery__gallery-0__image__image"]::atr(src)'  # primera imagen desktop
    'meta[property="og:image"]::atr(content)',  # respaldo
)

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

