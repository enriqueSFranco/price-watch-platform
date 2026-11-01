from __future__ import annotations

from decimal import Decimal
from pathlib import Path

import pytest
from parsel import Selector

from pricewatch.scraping.errors import ParseError
from pricewatch.scraping.stores.liverpool import (
    extract_image,
    extract_name,
    extract_prices,
    parse_product,
)

# Carpeta de fixtures. __file__ es la ruta de ESTE archivo; subir dos niveles
# (scraping/ -> tests/) y entrar a fixtures/ funciona sin importar desde dónde
# se ejecute pytest.
FIXTURES = Path(__file__).parent.parent / "fixtures"


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


URL = "https://www.liverpool.com.mx/tienda/pdp/pok%c3%a9mon-lego-pok%c3%a9mon-pok%c3%a9bola-grandes-momentos-del-entrenador-72154-72154/1200443809"

TITLE = """
<div
  class="ml-product-info [&amp;_.ml-product-info-family]:leading-[1.70rem]"
  data-testid="1200638987-configurator"
>
  <a
    aria-label="LEGO"
    class="cursor-pointer focus-visible:outline-prim-500 underline flex w-fit mb-1 
        text-body-xl text-base ml-product-info-brand-link"
    data-testid="1200638987-brand-link"
    href="/tienda?s=LEGO"
    ><span class="flex items-center">LEGO</span></a
  >
  <h1 class="text-body-2xl text-heading-xs text-base">
    Pokémon Lego Pokémon Munchlax 72150 72150
  </h1>
</div>
"""

GALLERY = """
<div
  aria-label="Galería de imágenes del producto"
  class="w-full relative"
  data-testid="pdp-1200638987-gallery"
  role="region"
>
  <div class="flex flex-col gap-2 lg:lds-hidden">
    <button class="" data-testid="pdp-1200638987-gallery__main-image-btn">
      <figure
        class="!w-full !h-[484px] md:!h-[434px] lg:!h-[568px] relative"
        data-testid="pdp-1200638987-gallery__main__image"
      >
        <img
          alt="Pokémon Lego Pokémon Munchlax 72150 72150 1"
          class="object-cover w-full h-full !w-full !h-full"
          data-testid="pdp-1200638987-gallery__main__image__image"
          loading="lazy"
          src="https://sp424.liverpool.com.mx/i/1200638987.jpg"
        />
      </figure>
    </button>
   
    <ul
      class="overflow-x-auto flex flex-row w-full lg:lds-hidden"
      data-testid="pdp-1200638987-gallery__thumbnails"
      role="list"
    >
      <li class="flex-none cursor-pointer">
        <button
          aria-label="Pokémon Lego Pokémon Munchlax 72150 72150 1"
          tabindex="0"
          class="border-prim-500 w-16 h-22 border-t-2 relative"
          data-testid="pdp-1200638987-gallery__thumbnail-0"
        >
          <img
            alt="Pokémon Lego Pokémon Munchlax 72150 72150 1"
            class="object-cover w-full h-full w-full h-full"
            data-testid="pdp-1200638987-gallery__thumbnail-0__image"
            loading="lazy"
            src="https://sp424.liverpool.com.mx/i/1200638987.jpg"
          />
        </button>
      </li>
    </ul>
  </div>
</div>
"""

GALLERY_DESKTOP_ONLY = """
<figure
  class="!w-full !h-[484px] md:!h-[434px] lg:!h-[568px] relative"
  data-testid="pdp-1200638987-gallery__gallery-0__image"
>
  <img
    alt="Pokémon Lego Pokémon Munchlax 72150 72150 1"
    class="object-cover w-full h-full !w-full !h-full"
    data-testid="pdp-1200638987-gallery__gallery-0__image__image"
    loading="lazy"
    src="https://sp424.liverpool.com.mx/i/1200638987.jpg"
  />
</figure>
"""

OG_IMAGE = '<meta property="og:image" content="https://sp424.liverpool.com.mx/i/1200638987.jpg">'


def page(*blocks: str) -> str:
    return f"<html><body>{''.join(blocks)}</body></html>"


def test_extract_name_prefers_product_info_heading() -> None:
    html = '<h1>Banner de la tienda</h1><div class="ml-product-info"><h1>Nombre real</h1></div>'

    assert extract_name(make_selector(html)) == "Nombre real"


def test_extract_name_falls_back_to_generic_h1() -> None:
    assert extract_name(make_selector("<h1>Solo un h1</h1>")) == "Solo un h1"


def test_extract_name_returns_none_when_missing() -> None:
    assert extract_name(make_selector("<p>nada</p>")) is None


def test_extract_image_picks_main_image_not_thumbnail() -> None:
    image = extract_image(make_selector(GALLERY))

    assert image == "https://sp424.liverpool.com.mx/i/1200638987.jpg"


def test_extract_image_falls_back_to_desktop_gallery() -> None:
    image = extract_image(make_selector(GALLERY_DESKTOP_ONLY))

    assert image == "https://sp424.liverpool.com.mx/i/1200638987.jpg"


def test_extract_image_falls_back_to_og_image() -> None:
    assert (
        extract_image(make_selector(OG_IMAGE)) == "https://sp424.liverpool.com.mx/i/1200638987.jpg"
    )


def test_extract_image_returns_none_when_missing() -> None:
    assert extract_image(make_selector("<p>nada</p>")) is None


def test_parse_product_whitout_discount() -> None:
    product = parse_product(page(TITLE, PRICE_DISCOUNT, GALLERY), URL)

    assert product.price == Decimal("1359.20")
    assert product.original_price == Decimal("1699.00")
    assert product.discount_pct == Decimal("20.0")


def test_parse_product_without_image_still_works() -> None:
    product = parse_product(page(TITLE, PRICE_REGULAR), URL)

    assert product.image_url is None


def test_parse_product_without_price_raises() -> None:
    with pytest.raises(ParseError, match="precio"):
        parse_product(page(TITLE), URL)


def test_parse_product_without_name_raises() -> None:
    with pytest.raises(ParseError, match="nombre"):
        parse_product(page(PRICE_REGULAR), URL)


def test_parse_product_with_broken_discount_block_raises() -> None:
    # Con el bloque "discounted" roto debe fallar, no usar el precio tachado.
    with pytest.raises(ParseError):
        parse_product(page(TITLE, PRICE_DISCOUNT_BROKEN, GALLERY), URL)


def test_parse_product_with_zero_price_raises() -> None:
    zero_price = '<div data-testid="1-configurator-price"><span>$0.00</span></div>'

    # El precio existe, pero ScrapedProduct lo rechaza (price > 0): ParseError.
    with pytest.raises(ParseError):
        parse_product(page(TITLE, zero_price), URL)


def test_real_page_with_discount() -> None:
    """Página real de Liverpool guardada del navegador (DOM ya renderizado).

    Los valores esperados se copiaron a mano de lo que muestra la página en el
    navegador, no de la salida del parser: si los copiáramos del parser, el test
    compararía el código consigo mismo y siempre pasaría.
    """

    html = (FIXTURES / "liverpool_discount.html").read_text(encoding="utf-8")

    product = parse_product(html, URL)

    assert product.name == "Pokémon Lego Pokémon Munchlax 72150 72150"
    assert product.price == Decimal("1359.20")
    assert product.original_price == Decimal("1699.00")
    assert product.image_url is not None
    assert product.image_url.startswith("https://")
