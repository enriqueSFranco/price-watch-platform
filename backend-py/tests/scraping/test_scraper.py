import socket

import pytest

from pricewatch.scraping.browser import BrowserSession
from pricewatch.scraping.errors import (
    BlockedError,
    NavigationError,
    ParseError,
    ProductNotFoundError,
    ScraperError,
)
from pricewatch.scraping.scraper import fetch_html, raise_for_status


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


# --- fetch_html: navegador real contra un servidor LOCAL ---


def _free_port() -> int:
    """Un puerto en el que nadie escucha, para simular 'conexión rechazada'."""
    with socket.socket() as sock:
        sock.bind(("127.0.0.1", 0))
        return int(sock.getsockname()[1])


@pytest.mark.browser
async def test_fetch_html_returns_rendered_html(server_url: str) -> None:
    async with BrowserSession() as session, session.page() as page:
        html = await fetch_html(page, f"{server_url}/ok", "#ready")

    assert 'id="ready"' in html


@pytest.mark.browser
@pytest.mark.parametrize(
    ("path", "expected"),
    [
        ("/missing", ProductNotFoundError),
        ("/forbidden", BlockedError),
        ("/boom", NavigationError),
    ],
)
async def test_fetch_html_maps_http_status_to_typed_error(
    server_url: str, path: str, expected: type[ScraperError]
) -> None:
    # Con el timeout por defecto (10 s): si el código HTTP no se revisara ANTES de
    # esperar al selector, estas pruebas tardarían 10 s y fallarían con ParseError.
    async with BrowserSession() as session, session.page() as page:
        with pytest.raises(expected):
            await fetch_html(page, f"{server_url}{path}", "#ready")


@pytest.mark.browser
async def test_fetch_html_raises_parse_error_when_ready_selector_never_appears(
    server_url: str,
) -> None:
    async with BrowserSession() as session, session.page() as page:
        with pytest.raises(ParseError, match="#ready"):
            await fetch_html(page, f"{server_url}/other", "#ready", ready_timeout_ms=300)


@pytest.mark.browser
async def test_fetch_html_raises_navigation_error_when_connection_is_refused() -> None:
    url = f"http://127.0.0.1:{_free_port()}/"

    async with BrowserSession() as session, session.page() as page:
        with pytest.raises(NavigationError):
            await fetch_html(page, url, "#ready")
