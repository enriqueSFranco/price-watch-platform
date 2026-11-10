from decimal import Decimal

import pytest
from parsel import Selector

from pricewatch.scraping.parsing import parse_price, text_of


@pytest.mark.parametrize(
    ("raw", "expected"),
    [
        ("$1,299.00", Decimal("1299.00")),
        ("$1,349.85", Decimal("1349.85")),
        ("$299", Decimal("299")),
        ("$ 1,299.00", Decimal("1299.00")),
        ("MXN 899.50", Decimal("899.50")),
        ("$1,299.00 - $1,399.00", Decimal("1299.00")),  # rango: toma el primero
        ("$0.00", Decimal("0.00")),  # no juzga: rechazar 0 es trabajo del modelo
    ],
)
def test_parse_price_reads_number(raw: str, expected: Decimal) -> None:
    assert parse_price(raw) == expected


@pytest.mark.parametrize("raw", ["Agotado", "", " ", None])
def test_parse_price_returns_none_when_no_number(raw: str | None):
    assert parse_price(raw) is None


def make_selector(html: str) -> Selector:
    return Selector(text=f"<html><body>{html}</body></html>")


LIVERPOOL_PRICE = """
<div data-testid="1200445364-configurator-price">
  <span><span>$<!-- -->499</span><span><span class="invisible">.</span>00</span></span>
</div>
"""


def test_text_of_nested_spans_and_ignores_comments() -> None:
    sel = make_selector(LIVERPOOL_PRICE)

    assert text_of(sel, '[data-testid$="-configurator-price"]') == "$499.00"


def test_text_of_normalizes_whitespace() -> None:
    sel = make_selector("<p>  Hola \n    mundo  </p>")

    assert text_of(sel, "p") == "Hola mundo"


def test_text_of_returns_first_match() -> None:
    sel = make_selector("<p>uno</p><p>dos</p>")

    assert text_of(sel, "p") == "uno"


def test_returns_none_when_nothing_matches() -> None:
    sel = make_selector("<p>hola</p>")

    assert text_of(sel, "h1") is None


def test_text_of_returns_none_when_element_is_blank() -> None:
    sel = make_selector("<p>    </p>")

    assert text_of(sel, "p") is None


def test_text_of_and_parse_price_work_together() -> None:
    # La combinación que usará el parser de Liverpool: leer texto, luego convertir.
    sel = make_selector(LIVERPOOL_PRICE)
    text = text_of(sel, '[data-testid$="-configurator-price"]')

    assert parse_price(text) == Decimal("499.00")
