"""Política de reintentos para operaciones asíncronas.

Responsabilidad: decidir cuátas veces se vuelve a intentar y cuánto se espera
entre intentos. No sabe qué operación ejecuta (abrir una página, llamar a una API...)
ni qué significa cada error: pregunta por `ScraperError.retryable`, que es donde quedó
decidido, en un único lugar, qué se reintenta.

Reglas de diseño:
    - Solo se reintentan los ScraperError con retryable=True. Cualquier otra excepción
      (un TypeError, un cierre inesperado del navegador) es un BUG o un fallo de
      infraestructura: reintentarlo repetiría el fallo y lo escondería.
    - Backoff exponencial con jitter: la espera crece entre intentos (da tiempo a que
      un problema pasajero se resuelva) y lleva un poco de azar (evita que muchos
      scrapeos que fallaron a la vez vuelvan a chocar al mismo tiempo).
    - Al agotar los intentos se relanza el ÚLTIMO error original, no un RetryError de
      tenacity: quien llama atrapa nuestros tipos y no necesita conocer tenacity.
"""

import logging
from collections.abc import Awaitable, Callable

from tenacity import (
    AsyncRetrying,
    before_sleep_log,
    retry_if_exception,
    stop_after_attempt,
    wait_exponential_jitter,
)
from tenacity.wait import wait_base

from pricewatch.scraping.errors import ScraperError

log = logging.getLogger(__name__)

# Intentos TOTALES (el primero cuenta): 3 = el intento inicial + 2 reintentos.
# Valor inicial razonable; ajustar con mediciones reales.
DEFAULT_MAX_ATTEMPTS = 3


def is_retryable(exc: BaseException) -> bool:
    """¿Tiene sentido reintentar tras esta excepción?

    Se exige ser un ScraperError Y declararse reintentable. El isinstance es lo que
    deja fuera a los bugs: un ValueError no se reintenta aunque tuviera un atributo
    `retryable`.
    """
    return isinstance(exc, ScraperError) and exc.retryable


async def retry_async[T](
    operation: Callable[[], Awaitable[T]],
    *,
    max_attempts: int = DEFAULT_MAX_ATTEMPTS,
    wait: wait_base | None = None,
) -> T:
    """Ejecuta `operation`, reintentándola mientras falle con un error reintentable.

    Args:
        operation: función sin argumentos que realiza UN intento completo. Se llama
            de nuevo en cada reintento, así que debe crear lo que necesite (una página
            nueva, por ejemplo) y no depender del intento anterior.
        max_attempts: intentos totales, contando el primero. Debe ser >= 1.
        wait: estrategia de espera entre intentos. Por defecto, backoff exponencial
            (≈2 s, ≈4 s, ≈8 s... hasta 30 s) más hasta 1 s de azar. Es inyectable para
            que los tests no esperen de verdad (`wait_none()`).

    Returns:
        Lo que devuelva `operation` en el primer intento exitoso.

    Raises:
        ValueError: si `max_attempts` es menor que 1.
        ScraperError: el error del ÚLTIMO intento, si se agotaron los intentos o si
            apareció uno no reintentable (se relanza de inmediato, sin más intentos).
        Exception: cualquier otra excepción se relanza al instante, sin reintentar.
    """

    if max_attempts < 1:
        raise ValueError(f"max_attempts debe ser >= 1, recibido {max_attempts}")

    retrying = AsyncRetrying(
        retry=retry_if_exception(is_retryable),
        stop=stop_after_attempt(max_attempts),
        wait=wait if wait is not None else wait_exponential_jitter(initial=2, max=30),
        # Deja constancia en el log de cada reintento: sin esto, un scrapeo lento por
        # reintentos silenciosos es imposible de diagnosticar.
        before_sleep=before_sleep_log(log, logging.WARNING),
        reraise=True,
    )

    return await retrying(operation)
