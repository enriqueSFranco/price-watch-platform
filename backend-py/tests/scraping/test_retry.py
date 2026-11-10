import pytest
from tenacity import RetryCallState, wait_none
from tenacity.wait import wait_base

from pricewatch.scraping.errors import BlockedError, NavigationError, ParseError, ScraperError
from pricewatch.scraping.retry import retry_async


class Flaky:
    """Operación de prueba: falla con cada error de la lista y luego devuelve "ok"."""

    def __init__(self, failures: list[Exception]) -> None:
        self._failures = list(failures)
        self.calls = 0

    def __call__(self) -> str:
        self.calls += 1
        if self._failures:
            raise self._failures.pop(0)
        return "ok"


class CountingWait(wait_base):
    """Cuenta cuántas veces se pidió una espera, sin esperar de verdad."""

    def __init__(self) -> None:
        self.calls = 0

    def __call__(self, retry_state: RetryCallState) -> float:
        self.calls += 1
        return 0.0


async def test_returns_result_without_retrying_on_success() -> None:
    operation = Flaky([])

    assert await retry_async(operation, wait=wait_none()) == "ok"
    assert operation.calls == 1


async def test_retries_transient_errors_until_success() -> None:
    operation = Flaky([NavigationError("timeout"), NavigationError("timeout")])

    assert await retry_async(operation, max_attempts=3, wait=wait_none()) == "ok"
    assert operation.calls == 3


async def test_gives_up_after_max_attempts_and_raises_the_last_original_error() -> None:
    operation = Flaky([NavigationError("uno"), NavigationError("dos"), NavigationError("tres")])

    # match="tres": es el ÚLTIMO error y de nuestro tipo, no un RetryError de tenacity.
    with pytest.raises(NavigationError, match="tres"):
        await retry_async(operation, max_attempts=3, wait=wait_none())

    assert operation.calls == 3


@pytest.mark.parametrize("error", [BlockedError("403"), ParseError("sin precio")])
async def test_does_not_retry_non_retryable_errors(error: ScraperError) -> None:
    operation = Flaky([error])

    with pytest.raises(type(error)):
        await retry_async(operation, wait=wait_none())

    assert operation.calls == 1


async def test_does_not_retry_unexpected_exceptions() -> None:
    # Un ValueError es un bug de programación: reintentarlo solo lo escondería.
    operation = Flaky([ValueError("bug")])

    with pytest.raises(ValueError):
        await retry_async(operation, wait=wait_none())

    assert operation.calls == 1


async def test_stops_as_soon_as_a_non_retryable_error_appears() -> None:
    # Fallo transitorio -> bloqueo: se reintenta el primero y se detiene en el segundo,
    # aunque queden intentos disponibles.
    operation = Flaky([NavigationError("timeout"), BlockedError("403"), NavigationError("x")])

    with pytest.raises(BlockedError):
        await retry_async(operation, max_attempts=5, wait=wait_none())

    assert operation.calls == 2


async def test_waits_between_attempts_but_not_after_the_last_one() -> None:
    wait = CountingWait()
    operation = Flaky([NavigationError("1"), NavigationError("2"), NavigationError("3")])

    with pytest.raises(NavigationError):
        await retry_async(operation, max_attempts=3, wait=wait)

    # 3 intentos = 2 huecos entre ellos. Esperar tras el último solo retrasaría el error.
    assert wait.calls == 3


async def test_max_attempts_must_be_positive() -> None:
    with pytest.raises(ValueError, match="max_attempts"):
        await retry_async(Flaky([]), max_attempts=0)
