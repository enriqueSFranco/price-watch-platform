"""Fixtures compartidos por todos los tests.

Las páginas reales de las tiendas (tests/fixtures/*.html) no se versionan: pesan mucho
y arrastran scripts de terceros. Viven solo en local; ver tests/fixtures/README.md
para regenerarlas.

Por eso los tests que las usan se SALTAN (skip) con un motivo claro si faltan, en vez de
fallar con un FileNotFoundError confuso.

Un skip no es un pass: corre `pytest -rs` y comprueba que en tu máquina no se salta ninguno.
"""

from collections.abc import Callable
from pathlib import Path

import pytest

FIXTURES_DIR = Path(__file__).parent / "fixtures"


@pytest.fixture
def real_page() -> Callable[[str], str]:
    """Devuelve una función que carga el HTML de una página real guardada."""

    def load(name: str) -> str:
        path = FIXTURES_DIR / name
        if not path.exists():
            pytest.skip(f"Falta el fixture local '{name}' (ver tests/fixtures/README.md)")
        return path.read_text(encoding="utf-8")

    return load
