"""
Estos tests protegen una decisión de diseño: qué errores se reintentan.
Si alguien cambia `retryable` sin querer, el test falla y lo avisa.
"""

import pytest

from pricewatch.scraping.errors import (
    BlockedError,
    NavigationError,
    ParseError,
    ProductNotFoundError,
    ScraperError,
)


@pytest.mark.parametrize(
    ("error_class", "expected"),
    [
        (NavigationError, True),
        (BlockedError, False),  # insistir empeora el bloqueo
        (ProductNotFoundError, False),  # el producto no va a reaparecer
        (ParseError, False),  # el HTML cambió: reintentar da lo mismo
    ],
)
def test_retryable_flag(error_class: type[ScraperError], expected: bool) -> None:
    assert error_class.retryable is expected


def test_base_error_is_not_retryable_by_default() -> None:
    # Protege el "valor seguro por defecto": un error nuevo no se reintenta solo.
    assert ScraperError.retryable is False


@pytest.mark.parametrize(
    "error_class", [NavigationError, BlockedError, ProductNotFoundError, ParseError]
)
def test_catching_base_class_catches_every_error(error_class: type[ScraperError]) -> None:
    with pytest.raises(ScraperError):
        raise error_class("detalle")


def test_message_is_preserved() -> None:
    error = BlockedError("HTTP 403")

    assert str(error) == "HTTP 403"
