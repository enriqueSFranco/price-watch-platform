# 0001. Portar el backend de TypeScript a Python

- **Estado:** Accepted
- **Fecha:** 2026-11-10

## Contexto
El proyecto empezó con un backend en TypeScript (Express, Drizzle, Puppeteer). Al
retomarlo se encontró que:
- Estaba incompleto: sin alertas, notificaciones ni scheduler.
- El scraper dependía de `puppeteer-extra-plugin-stealth`, frágil frente a tiendas
  que cambian sus defensas.
- Los selectores del scraper original ya no coincidían con las tiendas.
- El código acumulaba errores de diseño (precio `0` ante datos faltantes, `scrape:all`
  que nunca funcionó).

El objetivo del proyecto es doble: un producto funcional y aprender a trabajar 
con un ecosistema que facilite scraping, análisis de datos y testing.

## Decisión
Reconstruir el backend en Python (uv, Playwright, Pydantic, pytest, ruff, mypy),
empezando por el motor de scraping. No se porta el código TypeScript: se rediseña.
El backend TypeScript se conserva como referencia hasta alcanzar paridad y entonces
se elimina (tag `ts-backend-final`).

## Alternativas consideradas
- **Seguir en TypeScript con Playwright.** Técnicamente viable. Se descartó
  principalmente por el ecosistema de datos y análisis de Python (hitos posteriores
  de procesamiento y analítica) y por el objetivo de aprendizaje, no por una
  limitación del lenguaje.
- **Arreglar el scraper de Puppeteer.** Mantiene la dependencia de un plugin de
  sigilo que se desactualiza.

## Consecuencias
- Positivas: tipado estricto con mypy, ecosistema de datos, un solo lenguaje para el
  motor y el análisis posterior.
- Negativas: se descarta trabajo ya hecho; durante la migración conviven dos
  backends; el frontend sigue apuntando a la API del backend antiguo.
- A vigilar: no abandonar el frontend, que hay que reconectar cuando exista la API.