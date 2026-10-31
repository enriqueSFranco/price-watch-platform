from typing import ClassVar

"""
Cada tipo de error existe porque el programa reacciona distinto ante él.
"""


class ScraperError(Exception):
    """Base de errores de scraping. `retryable` indica si tiene sentido reintentar."""

    # ¿Tiene sentido volver a intentar? Por defecto NO: si alguien agrega un error
    # nuevo y olvida configurarlo, preferimos no reintentar a insistir contra una
    # tienda que podría estar bloqueándonos.
    retryable: ClassVar[bool] = (
        False  # Lo marcamos ClassVar[bool] para que mypy sepa que es de la clase.
    )


class NavigationError(ScraperError):
    """Timeout, DNS, conexión o error 5xx: suele ser transitorio."""

    retryable: ClassVar[bool] = True


class BlockedError(ScraperError):
    """La tienda nos bloqueó (captcha, 403/429/503). Reintentar rápido empeora el bloqueo."""


class ProductNotFoundError(ScraperError):
    """404/410: el producto ya no existe."""


class ParseError(ScraperError):
    """La página cargó pero no pudimos extraer datos válidos: probablemente cambió el HTML."""
