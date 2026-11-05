"""Fixtures compartidos por los tests de scraping.

`server_url` es un servidor HTTP REAL levantado en tu máquina, en un puerto libre y
sin internet. Con él los tests recorren el navegador de verdad sin depender de ninguna
tienda externa. `requests_log` registra qué rutas pidió el navegador, para poder
comprobar CUÁNTAS veces se intentó algo (por ejemplo, que un 500 se reintentó).
"""

import threading
from collections.abc import Iterator
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

import pytest

PRODUCT_PAGE = '<html><body><div id="ready">producto</div></body></html>'
OTHER_PAGE = "<html><body><p>una página que no es de producto</p></body></html>"

# ruta -> (código HTTP, cuerpo)
ROUTES: dict[str, tuple[int, str]] = {
    "/ok": (200, PRODUCT_PAGE),
    "/other": (200, OTHER_PAGE),
    "/missing": (404, "no existe"),
    "/forbidden": (403, "bloqueado"),
    "/boom": (500, "error"),
}


def _make_handler(requests: list[str]) -> type[BaseHTTPRequestHandler]:
    class Handler(BaseHTTPRequestHandler):
        def do_GET(self) -> None:
            requests.append(self.path)
            if self.path == "/echo-ua":
                status, body = 200, self.headers.get("User-Agent", "")
            else:
                status, body = ROUTES.get(self.path, (404, "no existe"))
            payload = body.encode()
            self.send_response(status)
            self.send_header("Content-Type", "text/html; charset=utf-8")
            self.send_header("Content-Length", str(len(payload)))
            self.end_headers()
            self.wfile.write(payload)

        def log_message(self, format: str, *args: object) -> None:
            pass  # silencia el log de cada petición

    return Handler


@pytest.fixture(scope="module")
def _server() -> Iterator[tuple[str, list[str]]]:
    """Un servidor por módulo de tests, apagado al terminar.

    El puerto 0 le pide al sistema operativo un puerto libre, así los tests no chocan
    con nada que ya esté corriendo en tu máquina.
    """
    requests: list[str] = []
    server = ThreadingHTTPServer(("127.0.0.1", 0), _make_handler(requests))
    thread = threading.Thread(target=server.serve_forever, daemon=True)
    thread.start()
    try:
        yield f"http://127.0.0.1:{server.server_address[1]}", requests
    finally:
        server.shutdown()
        server.server_close()


@pytest.fixture
def server_url(_server: tuple[str, list[str]]) -> str:
    return _server[0]


@pytest.fixture
def requests_log(_server: tuple[str, list[str]]) -> list[str]:
    """Rutas pedidas al servidor, en orden. Se vacía al empezar cada test.

    Ojo: Chromium puede pedir también `/favicon.ico`; por eso los tests cuentan rutas
    concretas (`.count("/boom")`) y no el tamaño total de la lista.
    """
    _server[1].clear()
    return _server[1]
