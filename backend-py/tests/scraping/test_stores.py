"""Tests del registro de tiendas."""

from pathlib import Path

import pytest
from parsel import Selector

from pricewatch.scraping.models import Store
from pricewatch.scraping.stores import STORES, liverpool

FIXTURES = Path(__file__).parent.parent / "fixtures"


def test_liverpool_is_registered_with_is_own_parts() -> None:
    spec = STORES[Store.LIVERPOOL]

    assert spec.ready_selector == liverpool.PRICE_BOX
    assert spec.parse is liverpool.parse_product


@pytest.mark.parametrize("fixture", ["liverpool_discount.html", "liverpool_presale.html"])
def test_liverpool_ready_selector_matches_real_pages(fixture: str) -> None:
    """Si el selector de 'página lista' no existiera en la página real, fetch_html
    esperaría 10 s y fallaría. Este test lo detecta sin abrir un navegador."""

    html = (FIXTURES / fixture).read_text(encoding="utf-8")

    assert Selector(text=html).css(STORES[Store.LIVERPOOL].ready_selector)
