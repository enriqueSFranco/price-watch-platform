"""Tests de browser

Unitarios: is_blocked es una función pura, se prueba en milisegundos.
Integración (marca `browser`): abren un Chromium real pero sin red, usando
set_content, así que no dependen de ningún sitio externo.
"""

import pytest

from pricewatch.scraping.browser import BrowserSession, is_blocked, normalize_user_agent

HEADLESS_UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "HeadlessChrome/120.0.0.0 Safari/537.36"
)

NORMAL_UA = (
    "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) "
    "Chrome/120.0.0.0 Safari/537.36"
)


def test_normalize_user_agent_removes_only_the_headless_marker() -> None:
    assert normalize_user_agent(HEADLESS_UA) == NORMAL_UA


def test_normalize_user_agent_leaves_a_normal_one_untouched() -> None:
    assert normalize_user_agent(NORMAL_UA) == NORMAL_UA


@pytest.mark.parametrize(
    ("url", "resource_type", "expected"),
    [
        (
            "https://www.liverpool.com.mx/tienda/pdp/grand-theft-auto-vi-est%c3%a1ndar-para-ps5/1202886040",
            "document",
            False,
        ),
        ("https://sp423.liverpool.com.mx/i/1202886040.jpg", "image", True),
        (
            "https://www.liverpool.com.mx/_pdpnext/_next/static/media/1e41be92c43b3255-s.p.woff2",
            "font",
            True,
        ),
        (
            "https://www.liverpool.com.mx/_pdpnext/_next/static/css/fc10194480798973.css",
            "css",
            False,
        ),
        (
            "https://www.liverpool.com.mx/web-bff/ratings/review-details?productId=1202886040&sort=TotalPositiveFeedbackCount%3Adesc&filter=isRatingsOnly%3Aeq%3Afalse",
            "fetch",
            False,
        ),
        ("https://sp423.liverpool.com.mx/i/1202886040_1p.jpg", "image", True),
        (
            "https://www.liverpool.com.mx/_pdpnext/_next/static/chunks/app/%5B...slug%5D/page-f05e075316b0941e.js",
            "script",
            False,
        ),
    ],
)
def test_is_blocked(url: str, resource_type: str, expected: bool) -> None:
    assert is_blocked(url, resource_type) is expected


async def test_page_outside_session_raises() -> None:
    session = BrowserSession()

    with pytest.raises(RuntimeError):
        async with session.page():
            pass


@pytest.mark.browser
async def test_session_gives_a_working_page() -> None:
    async with BrowserSession() as session, session.page() as page:
        await page.set_content("<h1>hola</h1>")

        assert await page.inner_text("h1") == "hola"


@pytest.mark.browser
async def test_page_is_closed_even_when_the_block_fails() -> None:
    """Protege la garantía principal del módulo: nada queda abierto tras un error."""
    async with BrowserSession() as session:
        with pytest.raises(ValueError):
            async with session.page() as page:
                raise ValueError("Fallo simulado")

        assert page.is_closed()


@pytest.mark.browser
async def test_each_page_has_its_own_context() -> None:
    """Las cookies de un scrapeo no deben filtrarse al siguiente."""
    cookie = {"name": "k", "value": "v", "url": "https://example.com"}

    async with BrowserSession() as session:
        async with session.page() as first:
            await first.context.add_cookies([cookie])
            assert await first.context.cookies("https://example.com")

        async with session.page() as second:
            assert await second.context.cookies("https://example.com") == []


@pytest.mark.browser
async def test_http_user_agent_does_not_announce_headless(server_url: str) -> None:
    """Regresión: Liverpool respondió HTTP 403 al user-agent por defecto del modo
    headless ("HeadlessChrome") y HTTP 200 a uno de Chrome normal, con la misma URL.

    Se comprueba el ENCABEZADO HTTP que llega al servidor, que es lo que la tienda ve.
    """
    async with BrowserSession() as session, session.page() as page:
        await page.goto(f"{server_url}/echo-ua")
        received = await page.inner_text("body")

    assert "Headless" not in received
    assert "Chrome/" in received
