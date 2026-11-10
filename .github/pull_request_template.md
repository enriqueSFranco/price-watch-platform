## Qué cambia y por qué

## Cómo se probó

## Checklist de calidad
- [ ] `ruff format --check`, `ruff check` y `mypy` pasan
- [ ] Los tests pasan, y los casos nuevos fallaron antes del cambio
- [ ] Ningún test comprueba solo que "no explota": verifica comportamiento
- [ ] Sin secretos, datos personales ni HTML de terceros en el diff
- [ ] Dependencias nuevas declaradas en el mismo commit que las usa
- [ ] Si hay una decisión de diseño no obvia, hay un ADR
- [ ] El diff solo contiene lo descrito arriba

## Fuera de alcance