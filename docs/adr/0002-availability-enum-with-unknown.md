# 0002 Representar la disponibilidad con un enum que incluye UNKNOW

- **Estado:** Accepted
- **Fecha:** 2026-11-10

## Contexto

`ScrapedProduct` comenzó con `in_stock`, un booleano (`True`/`False`, luego
`bool | None`). Al guardar páginas reales de Liverpool apareció un producto en
**preventa** (marcas `data-testid="flag-presale"` y `presale-icon`, y el texto "La
entrega se realizará cuando el artículo esté disponible"). Ese producto no está
agotado ni se puede comprar hoy: ningún valor booleano lo describe.

Además, la página de producto de Liverpool guardada no expone el stock: la cantidad
aparece solo tras interacciones (agregar a la bolsa, consultar tiendas) y no en todos
los productos. No se encontró ninguna página de producto agotado para ver cómo se
representa.

La disponibilidad alimentará alertas como "volvió el stock", que comparan el estado
anterior con el actual. Un estado inventado produce alertas falsas.

## Decisión
`availability` es un enum `Availability` con cuatro valores: `IN_STOCK`,
`OUT_OF_STOCK`, `PRESALE` y `UNKNOWN` (valor por defecto).

Regla: un valor distinto de `UNKNOWN` exige **evidencia positiva** en la página. La
ausencia de una marca no es evidencia de stock. Hoy Liverpool solo produce `PRESALE`
o `UNKNOWN`.

## Alternativas consideradas
- **`bool | None`.** `None` mezclaría "no sé si hay stock" con casos reales que no son sí/no, como
  la preventa, y no distingue una preventa de una lectura fallida.
- **`bool` con `False` por defecto.** Afirma "agotado" cuando solo no sabemos. Al leer
  después `True`, la comparación dispararía una alerta falsa de "volvió el stock".
- **Dos booleanos (`in_stock` e `is_presale`), ambos `False` por defecto.** Con los
  dos en `False` no se distingue "agotado y sin preventa" de "no se pudo determiar".
  Además permite otra asignacion de valores que es contradictoria (`in_stock=True` con `is_presale=True`).
  Un enum hace que esos estados inválidos no se puedan representar.

## Consecuencias
- **Positivas:** cada estado real tiene su propio valor y no existen combinaciones
  contradictorias. Una alerta puede distinguir "estaba agotado y ahora hay" de "no
  pudimos leer la disponibilidad".
- **Negativas / costos:** todo código que lea el campo debe decidir qué hacer con cada
  valor, incluido `UNKNOWN`; añadir un quinto estado obliga a revisar todos esos puntos
  (y a cambiar el esquema si se guarda como columna). Además, mientras Liverpool solo
  produzca `PRESALE` o `UNKNOWN`, las alertas de "volvió el stock" no pueden dispararse
  para sus productos.
- **A vigilar:** `UNKNOWN` nunca dispara ni cancela una alerta; cuando exista el módulo
  de alertas, un test debe fijar esa regla. Si Liverpool renombra sus marcas de
  preventa, el scraper devolverá `UNKNOWN` sin lanzar error: conviene guardar cada
  resultado y medir el porcentaje de `UNKNOWN` por tienda. De Amazon no se asume nada
  hasta verificarlo con páginas reales.