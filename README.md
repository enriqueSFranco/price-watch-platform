# Scraper de productos

Scraper que extrae **precio, descuento y disponibilidad** de páginas de producto de tiendas en línea mexicanas y los entrega como datos tipados y validados. Es la base de un monitor de precios que avisará cuando un producto baje de precio.

Tienda soportada hoy: **Liverpool**. Amazon está en camino.

> Este directorio es la reescritura del backend en Python. El repositorio también contiene el frontend (Next.js) y el backend original en TypeScript, que se retirará cuando Python alcance paridad.

| Pieza | Estado |
|---|---|
| Modelo de datos validado (`ScrapedProduct`) | ✅ |
| Parser de Liverpool: nombre, precio, descuento, imagen y preventa | ✅ |
| Navegador con contextos aislados (Playwright) | ✅ |
| Descarga con errores tipados según el código HTTP | ✅ |
| Política de reintentos | ✅ |
| Volcado de diagnóstico (HTML y captura) cuando algo falla | ✅ |
| CLI y orquestación de extremo a extremo | ✅ |
| Amazon | 🚧 |
| Persistencia, alertas, scheduler y API | 📋 |

<!--
## Demo

![Demo](docs/demo.gif)
-->

## Qué extrae

Cada scrapeo extrae un `ScrapeProduct` inmutable y validado:

| Campo | Tipo | Notas |
|---|---|---|
| `store` | `Store` | Enum de tiendas soportadas |
| `url` | `HttpUrl` | URL validada |
| `name` | `str` | Obligatorio, no vacío |
| `price` | `Decimal` | Precio actual de venta. Obligatorio y mayor que 0 |
| `original_price` | `Decimal \| None` | Precio tachado, solo si hay descuento |
| `currency` | `str` | `MXN` |
| `image_url` | `str \| None` | Imagen principal (no las miniaturas) |
| `availability` | `Availability` | `IN_STOCK`, `OUT_OF_STOCK`, `PRESALE` o `UNKNOWN` |
| `scraped_at` | `datetime` | UTC |

`discount_pct` se calcula a partir de `price` y `original_price`.

## Cómo ejecutarlo

**Requisitos:** [uv](https://docs.astral.sh/uv/) (descarga Python 3.13)

```bash
git clone https://github.com/enriqueSFranco/price-watch-platform.git
cd pricewatch/backend-py

uv sync
uv run playwright install chromium
```

**Probar contra una página real de Liverpool** (necesita conexión a internet):

```bash
uv run python -m pricewatch scrape --store liverpool --url https://www.liverpool.com.mx/tienda/pdp/pok%c3%a9mon-lego-pok%c3%a9mon-pok%c3%a9bola-grandes-momentos-del-entrenador-72154-72154/1200443809
```

**Tests:**

```bash
uv run pytest -q
uv run pytest -m "not browser"
```

Los tests marcados `browser` abren un Chromium real, pero contra un servidor local o contenido en memoria: no dependen de ningún sitio externo.

**Calidad (lo que debe pasar antes de cada commit):**

```bash
uv run ruff format --check . && uv run ruff check . && uv run mypy && uv run pytest -q
```

## Arquitectura

```
URL ─► BrowserSession ─► fetch_html ─► HTML renderizado ─► parse_product ─► ScrapedProduct
       (navegador)       (red + HTTP)                      (función pura)
```

```
src/pricewatch/scraping/
├── models.py      # Contrato de datos: ScrapedProduct, Store, Availability
├── errors.py      # Errores tipados, cada uno declara si es reintentable
├── parsing.py     # Herramientas puras y genéricas (texto → Decimal, etc.)
├── browser.py     # Un Chromium compartido, un contexto aislado por scrapeo
├── scraper.py     # fetch_html: navega, revisa el código HTTP, espera la página
├── retry.py       # Política de reintentos (backoff exponencial con jitter)
├── debug.py       # Guarda HTML y captura cuando un scrapeo falla
└── stores/
    └── liverpool.py   # Todo lo que se sabe del HTML de Liverpool
```

## Aviso

Proyecto personal y educativo. Respeta los términos de uso y el `robots.txt` de cada tienda, y no está pensado para extracción masiva.

## Stack

Python 3.13 · Playwright · Parsel · Pydantic v2 · Tenacity · pytest (+ pytest-asyncio) · Ruff · mypy (modo estricto) · uv
