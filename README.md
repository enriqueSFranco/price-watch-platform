# 📊 Monitor de Precios Dinámico

Sistema para monitorear precios de productos en tiendas en línea y notificar al usuario cuando ocurren cambios relevantes como bajadas de precio, disponibilidad de stock o descuentos significativos.

Actualmente soporta:
- 🛒 **Liverpool**
- 🛒 **Amazon**


## 🚀 Funcionalidad principal

El sistema permite al usuario:

1. Proporcionar la **URL de un producto**
2. Ejecutar un **scraper** que obtiene:
   - Nombre del producto
   - Precio actual
   - Descuento (si aplica)
   - Estado de stock
   - Imagen del producto
3. Guardar el historial de precios
4. Definir **reglas personalizadas**
5. Recibir **notificaciones automáticas** cuando se cumplen esas reglas


## 🧠 Ejemplos de reglas de notificación

El usuario puede configurar reglas como:

- 📉 Notificar si el precio baja **un 20% o más**
- 📦 Avisar cuando el producto **vuelve a tener stock**
- 🔔 Avisar ante **cualquier cambio de precio**
- 💸 Notificar si el precio baja de un monto específico


## 🕸️ Scraping

El sistema ejecuta un scraper que analiza la página del producto y extrae información estructurada como:

- `name`
- `price`
- `discount`
- `stock`
- `image_url`

> ⚠️ El scraping está diseñado únicamente con fines educativos y personales.  
> El soporte por tienda depende de la estructura actual del sitio.


## 🔔 Notificaciones

Las notificaciones se disparan cuando una regla configurada se cumple.

Ejemplos:
- El precio bajó más del porcentaje definido
- El producto pasó de “sin stock” a “disponible”

*(El canal de notificación puede variar según implementación: email, WhatsApp, webhook, etc.)*


## 🏗️ Arquitectura

- **Frontend**
  - Interfaz para registrar URLs
  - Visualización de precios e historial
  - Configuración de reglas

- **Backend**
  - API para gestionar productos y reglas
  - Motor de scraping por tienda
  - Evaluador de reglas
  - Sistema de notificaciones

- **Base de datos**
  - Productos
  - Historial de precios
  - Reglas de notificación
  - Usuarios


## 🛠️ Tecnologías

> *(Ajusta esta sección a tu stack real)*

- Frontend: `Next.js / Astro / SvelteKit`
- Backend: `Node.js`
- ORM / DB: `Drizzle ORM`
- Scraping: `Playwright / Cheerio`
- Base de datos: `PostgreSQL`
- Notificaciones: `Email / WhatsApp / Webhooks`


## 📦 Instalación (desarrollo)

```bash
git clone https://github.com/tu-usuario/monitor-precios-dinamico.git
cd monitor-precios-dinamico
pnpm install
