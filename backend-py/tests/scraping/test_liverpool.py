from decimal import Decimal

from parsel import Selector

from pricewatch.scraping.stores.liverpool import extract_prices


def make_selector(html: str) -> Selector:
    return Selector(text=f"<html><body>{html}</body></html>")

PRICE_REGULAR = """
<div class="flex items-center" data-testid="1200443809-configurator-price">
  <span class="text-heading-2xl font-bold text-price-primary font-bold"
    ><span>$<!-- -->6,999</span
    ><span class="align-super text-caption-xs font-semibold font-semibold"
      ><span class="invisible">.</span>00</span
    ></span
  >
</div>
"""

PRICE_DISCOUNT = """
<div
  class="flex flex-row items-center"
  data-testid="1200638987-configurator-price"
>
  <span style="font-size: 20px; white-space: nowrap; display: inline-block"
    ><span
      class="text-heading-2xl font-bold text-price-primary font-bold"
      data-testid="discounted"
      ><span>$<!-- -->1,359</span
      ><span class="align-super text-caption-xs font-semibold font-semibold"
        ><span class="invisible">.</span>20</span
      ></span
    ><span
      class="text-low-emphasis font-regular text-body-base"
      data-testid="original"
      style="padding-left: 4px"
      ><span class="line-through">$<!-- -->1,699</span
      ><span class="line-through text-caption-2xs font-regular align-super"
        ><span class="invisible">.</span>00</span
      >
    </span></span
  >
</div>
""" 

# Hay descuento pero el bloque "discounted" desapareció (la página cambió).
# Debemos NO devolver el precio tachado como si fuera el actual.
PRICE_DISCOUNT_BROKEN = """
<div data-testid="1200638987-configurator-price"><span>
  <span data-testid="original"><span class="line-through">$<!-- -->1,699</span></span>
</span></div>
"""

# "original" más barato que "discounted": dato incoherente.
PRICE_INCOHERENT = """
<div data-testid="1-configurator-price">
  <span data-testid="discounted">$500</span>
  <span data-testid="original">$400</span>
</div>
"""

def test_prices_without_discount() -> None:
    price, original = extract_prices(make_selector(PRICE_REGULAR))

    assert price == Decimal("6999.00")
    assert original is None

def test_prices_with_discount() -> None:
    price, original = extract_prices(make_selector(PRICE_DISCOUNT))

    assert price == Decimal("1359.20")
    assert original == Decimal("1699.00")

def test_broken_discount_block_does_not_fall_back_to_original_price() -> None:
    price, _ = extract_prices(make_selector(PRICE_DISCOUNT_BROKEN))

    assert price is None

def test_page_without_price_returns_none() -> None:
    price, original = extract_prices(make_selector("<h1>nada</h1>"))

    assert price is None
    assert original is None
