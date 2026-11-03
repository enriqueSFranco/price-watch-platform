"""Registro de tiendas soportadas.

Es el unico lugar que conoce, para cada tienda, las dos cosas que la distinguen:

    ready_selector: selector CSS de un elemento que SOLO existe cuando la página de
        producto ya se pintó (lo usa fetch_html para saber cuándo leer el HTML).
    parse: función pura (html, url) -> ScrapedProduct.

Agregar una tienda = un módulo nuevo en stores/ + una entrada en STORES. El resto del
sistema (navegación, reintentos, diagnóstico) no cambia.

Se usa una pareja de datos y no una clase base con herencia porque entre tiendas solo
varían estas dos cosas, y un parser es una sola función: una jerarquía de clases
sería ceremonia sin beneficio.
"""

from collections.abc import Callable
from dataclasses import dataclass

from pricewatch.scraping.models import ScrapedProduct, Store
from pricewatch.scraping.stores import liverpool


@dataclass(frozen=True, slots=True)
class StoreSpec:
    """Lo que el sistema necesita saber de una tienda."""

    ready_selector: str
    parse: Callable[[str, str], ScrapedProduct]


STORES: dict[Store, StoreSpec] = {
    Store.LIVERPOOL: StoreSpec(ready_selector=liverpool.PRICE_BOX, parse=liverpool.parse_product)
}
