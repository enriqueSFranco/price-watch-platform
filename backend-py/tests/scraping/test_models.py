from decimal import Decimal

import pytest
from pydantic import ValidationError

from pricewatch.scraping.models import Availability, ScrapedProduct, Store


def make_product(**overrides: object) -> ScrapedProduct:
    """Crea un producto válido; cada test cambia solo lo que quiere probar."""
    data: dict[str, object] = {
        "store": Store.LIVERPOOL,
        "url": "https://www.liverpool.com.mx/tienda/pdp/pok%c3%a9mon-lego-pok%c3%a9mon-munchlax-72150-72150/1200638987",
        "name": "Producto de prueba",
        "price": Decimal("499.00"),
    }

    data.update(overrides)

    return ScrapedProduct(**data)


def test_valid_product_is_created() -> None:
    product = make_product()

    assert product.price == Decimal("499.00")
    assert product.availability is Availability.UNKNOWN  # "no sé" es el valor por defecto
    assert product.original_price is None


def test_availability_accepts_presale() -> None:
    product = make_product(availability=Availability.PRESALE)

    assert product.availability is Availability.PRESALE


def test_price_must_be_positive() -> None:
    with pytest.raises(ValidationError):
        make_product(price=Decimal("0"))


def test_name_cannot_be_empty() -> None:
    with pytest.raises(ValidationError):
        make_product(name="")


def test_url_must_be_valid() -> None:
    with pytest.raises(ValidationError):
        make_product(url="no-es-una-url")


def test_product_is_immutable() -> None:
    product = make_product()

    with pytest.raises(ValidationError):
        product.price = Decimal("1")  # type: ignore[misc]
