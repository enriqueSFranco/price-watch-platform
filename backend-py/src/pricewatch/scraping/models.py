from datetime import UTC, datetime
from decimal import Decimal
from enum import StrEnum

from pydantic import BaseModel, ConfigDict, Field, HttpUrl

"""
Modelo de datos

Este archivo define Qué es producto scrapeado, no CÓMO se obtiene.

"""


class Store(StrEnum):
    """Tiendas que sabemos scrapear."""

    LIVERPOOL = "liverpool"
    AMAZON = "amazon"


class ScrapedProduct(BaseModel):
    """Resultado de scrapear UNA página de producto."""

    model_config = ConfigDict(frozen=True)

    store: Store
    url: HttpUrl
    name: str = Field(min_length=1)
    price: Decimal = Field(gt=0)  # precio ACTUAL de venta y > 0 (gt = "greater than")
    original_price: Decimal | None = Field(
        default=None, gt=0
    )  # precio tachado, solo si hay descuento. None = no hay descuento.
    currency: str = "MXN"
    image_url: str | None = None
    in_stock: bool | None = (
        None  # True = hay stock | False = agotado | None = no pudimos determinarlo.
    )

    # Cuándo se scrapeó. default_factory se ejecuta al CREAR cada objeto;
    # un `default=datetime.now()` se evaluaría una sola vez, al importar el archivo.
    # Usamos UTC para evitar líos de zonas horarias; se convierte al mostrar.
    scraped_at: datetime = Field(default_factory=lambda: datetime.now(UTC))

    def discount_pct(self) -> Decimal | None:
        if self.original_price is not None and self.original_price > self.price:
            pct = self.original_price - self.price / self.original_price * 100

            return pct.quantize(Decimal(0.1))

        return None
