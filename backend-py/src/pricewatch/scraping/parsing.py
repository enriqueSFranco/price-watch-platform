import re
from decimal import Decimal

from parsel import Selector

_PRICE_RE = re.compile(r"\d[\d,]*(?:\.\d+)?")

"""Herramientas genéricas para leer datos "sucios" de HTML.

Son funciones PURAS: con el mismo input devuelven siempre el mismo output y no
tocan la red, el navegador ni el disco. Por eso se prueban en milisegundos.

Regla de este módulo: nada aquí sabe de una tienda concreta. Si algo solo sirve
para Liverpool, va en stores/liverpool.py. Si cualquier tienda lo necesitaría,
va aquí.

Convención: cuando no encuentran el dato devuelven None en lugar de lanzar un
error. Estas funciones no saben si el dato era obligatorio; eso lo decide quien
las llama (el parser de la tienda sabe que sin precio no hay producto).
"""


def parse_price(raw: str | None) -> Decimal | None:
    """
    Convierte el texto de un precio en Decimal.

    Asume el formato de México: la coma separa miles y el punto separa decimales.
    NO sirve para formatos europeos como "1.299,00".
    '$1,299.00' -> Decimal('1299.00'). Formato es-MX: coma = miles, punto = decimales.

    Args:
        - raw

    """
    if not raw:
        return None

    match = _PRICE_RE.search(raw)

    if match is None:
        return None

    return Decimal(match.group().replace(",", ""))


def text_of(sel: Selector, css: str) -> str | None:
    """
    Devuelve el texto completo del primero elemento que coincide con el selector css.

    Args:
        - sel
        - css

    Returns:
        None si nada coincide o so el elemento no tiene texto
    """

    val = sel.css(css).xpath("string(.)").get()

    if val is None:
        return None

    cleaned = " ".join(val.split())

    return cleaned or None
