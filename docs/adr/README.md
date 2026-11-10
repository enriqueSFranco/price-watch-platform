# Architecture Decision Records

Cada archivo documenta una decisión técnica: el contexto, las alternativas
consideradas y las consecuencias. Responde al "¿por qué?" que el código no guarda.

## Cuándo escribir uno
- La decisión es difícil de revertir (base de datos, framework, formato de datos).
- No es obvia: había alternativas razonables.
- Alguien podría "corregirla" por error más adelante.

No hace falta para decisiones pequeñas o fácilmente reversibles.

## Reglas
- Un ADR por decisión, numerado en orden: `NNNN-titulo-en-minusculas.md`.
- Un ADR aceptado NO se edita. Si la decisión cambia, se escribe uno nuevo que
  lo reemplaza y el viejo pasa a `Superseded by NNNN`.
- Siempre se listan alternativas descartadas y costos, no solo ventajas.
- Se escribe en el mismo Pull Request que implementa la decisión.

## Estados
`Proposed` -> `Accepted` -> (`Deprecated` | `Superseded by NNNN`)

## Índice
| ADR | Decisión | Estado |
|---|---|---|
| [0001](0001-port-backend-to-python.md) | Portar el backend a Python | Accepted |