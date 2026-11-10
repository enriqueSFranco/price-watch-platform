# Fixtures locales (no versionados)

Páginas reales de tiendas, guardadas a mano. No se suben al repo: pesan mucho y
contienen scripts de terceros.

Archivos esperados:
- liverpool_regular.html (producto con precio sin descuento)
- liverpool_discount.html  (producto con precio tachado)
- liverpool_presale.html   (producto en preventa)

Cómo regenerarlos:
1. Ventana privada, sin sesión iniciada.
2. DevTools > Elements > clic derecho en <html> > Copy > Copy outerHTML.
3. `pbpaste > tests/fixtures/<nombre>.html`

Sin ellos, los tests que los usan se saltan (`pytest -rs` los muestra).