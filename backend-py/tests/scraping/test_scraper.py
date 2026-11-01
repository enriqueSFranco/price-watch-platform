import pytest

from pricewatch.scraping.errors import (
    BlockedError,
    NavigationError,
    ProductNotFoundError,
    ScraperError,
)
from pricewatch.scraping.scraper import raise_for_status


@pytest.mark.parametrize(
    ("status", "expected"),
    [
        (404, ProductNotFoundError),
        (410, ProductNotFoundError),
        (403, BlockedError),
        (429, BlockedError),
        (503, BlockedError),
        (500, NavigationError),
        (502, NavigationError),
        (504, NavigationError),
    ],
)
def test_raise_for_status_maps_status_to_error(status: int, expected: type[ScraperError]) -> None:
    with pytest.raises(expected) as info:
        raise_for_status(status)

    assert type(info.value) is expected
    assert str(status) in str(info.value)


@pytest.mark.parametrize("status", [200, 204, 301, 302, 304, 400, 401, 418])
def test_raise_for_status_lets_other_statuses_through(status: int) -> None:
    raise_for_status(status)


def test_only_server_failures_are_retryable() -> None:
    """Conecta con errors.py: de todos los códigos con decisión, solo se reintentan
    los fallos de servidor (500, 502, 504). 503 y los 4xx NO."""
    retryable = []

    for status in (404, 410, 429, 500, 502, 504):
        try:
            raise_for_status(status)
        except ScraperError as exc:
            if exc.retryable:
                retryable.append(status)

    assert retryable == [500, 502, 504]
