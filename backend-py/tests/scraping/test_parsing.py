from decimal import Decimal

import pytest

from pricewatch.scraping.parsing import parse_price


@pytest.mark.parametrize(("raw", "expected"), [
    ("$1,299.00", Decimal("1299.00")),
    ("$1,349.85", Decimal("1349.85")),
    ("$299", Decimal("299")),
    ("$ 1,299.00", Decimal("1299.00")),
    ("MXN 899.50", Decimal("899.50")),
    ("$1,299.00 - $1,399.00", Decimal("1299.00")), # rango: toma el primero
    ("$0.00", Decimal("0.00")),  # no juzga: rechazar 0 es trabajo del modelo
])
def test_parse_price_reads_number(raw: str, expected: Decimal) -> None:
    assert parse_price(raw) == expected

@pytest.mark.parametrize("raw", ["Agotado", "", " ", None])
def test_parse_price_returns_none_when_no_number(raw: str | None):
    assert parse_price(raw) is None