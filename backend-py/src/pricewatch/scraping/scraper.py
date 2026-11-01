"""Obtencion de un HTML de una pagina de producto"""

from pricewatch.scraping.errors import BlockedError, NavigationError, ProductNotFoundError

# Códigos con una decisión tomada. Todo lo demás (2xx, 3xx y 4xx no listados) pasa:
# no tenemos evidencia de qué hacer con ellos, y si la página no es de producto, el
# selector de "página lista" fallará y quedará reportado como ParseError.
NOT_FOUND_STATUES = frozenset({404, 410})

# 403 y 429 son bloqueo explícito. 503 es AMBIGUO: puede ser un servidor caído o un
# bloqueo (algunas tiendas responden 503 a los bots).
BLOCKED_STATUS = frozenset({403, 429, 503})


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
