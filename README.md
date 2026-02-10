## Roadmap de Proyecto: Monitor de Precios Dinámico (Next.js, Spring Boot, PostgreSQL)

### Fase 0: Planificación y Configuración Inicial (1-2 días)

* **1. Definir Casos de Uso Clave:**
    * Como usuario, quiero registrarme y acceder a mi cuenta de forma segura.
    * Como usuario, quiero añadir una URL de producto para monitorear.
    * Como usuario, quiero especificar un umbral de precio o un porcentaje de caída para notificaciones.
    * Como usuario, quiero ver el precio actual de mis productos monitoreados.
    * Como usuario, quiero recibir un email cuando el precio baje.
    * Como sistema, quiero verificar los precios de los productos cada X horas.
    * Como sistema, quiero almacenar el historial de precios.
* **2. Diseño Básico de Base de Datos (PostgreSQL):**
    * Tabla `Users`: `id`, `email`, `password_hash`, `created_at`.
    * Tabla `Products`: `id`, `user_id`, `url`, `current_price`, `last_checked_at`, `product_name`, `product_image_url`.
    * Tabla `PriceHistory`: `id`, `product_id`, `price`, `timestamp`.
    * Tabla `NotificationRules`: `id`, `product_id`, `threshold_price`, `threshold_percentage`, `notification_email`, `status`.
* **3. Configuración del Repositorio:**
    * Crea un solo repositorio en GitHub con dos carpetas principales: `frontend` (para Next.js) y `backend` (para Java/Spring Boot).
    * Configura un `README.md` inicial con la descripción del proyecto, stack tecnológico y pasos para ejecutarlo.

---

### Fase 1: Backend Esqueleto (Spring Boot) y Base de Datos (3-5 días)

* **1. Proyecto Spring Boot:**
    * Inicia un nuevo proyecto Spring Boot con `Spring Web`, `Spring Data JPA`, `PostgreSQL Driver`.
    * Configura `application.properties` (o `application.yml`) para la conexión a PostgreSQL.
* **2. Entidades y Repositorios JPA:**
    * Crea las clases de entidad Java (`User`, `Product`, `PriceHistory`, `NotificationRule`) que mapeen a tus tablas de DB.
    * Implementa interfaces `JpaRepository` para cada entidad (esto te da CRUD automáticamente).
* **3. Migraciones de Base de Datos (Flyway/Liquibase - recomendado):**
    * Usa una herramienta de migración (ej. Flyway o Liquibase) para gestionar tu esquema de base de datos. Crea tu primera migración para las tablas `Users`, `Products`, `PriceHistory`, `NotificationRules`.
* **4. Autenticación de Usuarios (Spring Security):**
    * Integra Spring Security.
    * Crea un endpoint de registro (`/api/auth/register`) y de login (`/api/auth/login`).
    * Implementa hashing de contraseñas (BCryptPasswordEncoder).
    * Generación y validación de tokens JWT para la autenticación sin estado.
* **5. API para Gestión de Productos:**
    * Crea un `ProductController` con endpoints REST para:
        * `POST /api/products`: Añadir un nuevo producto a monitorear (asociado al usuario autenticado).
        * `GET /api/products`: Obtener todos los productos monitoreados por el usuario.
        * `DELETE /api/products/{id}`: Eliminar un producto.
    * Aplica seguridad JWT a estos endpoints para que solo usuarios autenticados puedan acceder.

---

### Fase 2: Frontend Básico (Next.js) y Conexión con Backend (3-5 días)

* **1. Configuración de Proyecto Next.js:**
    * Crea una app Next.js en la carpeta `frontend`.
    * Configura Tailwind CSS para estilos (opcional, pero muy útil para un desarrollo rápido).
* **2. Rutas y Componentes Básicos:**
    * Página de `login` y `register`.
    * Página de `dashboard` (protegida por autenticación).
    * Componente de formulario para añadir un nuevo producto.
    * Componente para listar los productos monitoreados.
* **3. Consumo de la API del Backend:**
    * Usa `fetch` o `axios` en el frontend para llamar a tus endpoints de Spring Boot.
    * Implementa el flujo de registro y login (guardando el token JWT en `localStorage` o `cookies` para futuras peticiones).
    * Envía el token JWT en el `Authorization` header para las rutas protegidas.
* **4. Formulario para Añadir Producto:**
    * Permite al usuario introducir la URL del producto y configuraciones básicas.
    * Envía esta información al endpoint `/api/products` del backend.
* **5. Listado de Productos:**
    * Al cargar el dashboard, haz una petición a `/api/products` para mostrar los productos del usuario.

---

### Fase 3: Lógica de Scraping y Programación de Tareas (4-7 días)

* **1. Implementación del Web Scraper (en el Backend Java):**
    * Elige una librería de scraping para Java (ej. **Jsoup** para HTML estático, o **Selenium WebDriver** si necesitas interactuar con JavaScript).
    * Crea un servicio (`ScrapingService`) que reciba una URL de producto y devuelva su precio y, si es posible, nombre e imagen.
    * Manejo de errores básicos: `try-catch` para conexiones fallidas, elementos no encontrados.
* **2. Tarea Programada para Scraping:**
    * Usa `@Scheduled` de Spring para ejecutar un método en tu backend periódicamente (ej. cada 6 horas).
    * Este método debe:
        * Obtener todos los productos de la base de datos.
        * Iterar sobre ellos, llamar a tu `ScrapingService`.
        * Comparar el `current_price` con el `new_price`.
        * Si hay cambio, actualizar `current_price` y registrar en `PriceHistory`.
* **3. Lógica de Notificaciones:**
    * Dentro de la tarea programada, después de actualizar un precio, verifica si alguna `NotificationRule` para ese producto se ha activado (ej. el precio es menor al `threshold_price`).
    * Si se activa, usa JavaMailSender (integrado con Spring) o una librería para un servicio como SendGrid para enviar un email al usuario.
* **4. Mejoras de Scraper (opcional, pero recomendado para robustez):**
    * Considera diferentes "parsers" para sitios específicos (ej. una lógica para Amazon, otra para eBay).
    * Manejo de User-Agents.

---

### Fase 4: Dashboard Interactivo y Características Avanzadas (5-8 días)

* **1. Visualización del Historial de Precios:**
    * Añade un endpoint en el backend (`/api/products/{id}/history`) para obtener el historial de precios de un producto.
    * En el frontend, usa una librería de gráficos (ej. **Chart.js** o **Recharts**) para mostrar el historial de precios de forma interactiva.
* **2. Gestión de Reglas de Notificación:**
    * Endpoints en el backend para añadir, actualizar y eliminar `NotificationRules`.
    * Interfaz en el frontend para que el usuario configure estas reglas por producto.
* **3. Detalles de Producto Mejorados:**
    * Muestra el nombre, imagen y último precio del producto en el dashboard.
* **4. Feedback al Usuario:**
    * Mensajes de éxito/error al añadir productos o al configurar reglas.
    * Indicadores visuales si un producto está "activo" o "inactivo".

---

### Fase 5: Refinamiento, Pruebas y Despliegue (3-5 días)

* **1. Pruebas Unitarias e Integración:**
    * Escribe pruebas para tus controladores, servicios y lógica de scraping en Spring Boot.
    * Escribe pruebas para tus componentes de React (ej. con React Testing Library).
* **2. Manejo de Errores Completo:**
    * Implementa un manejo de errores global en Spring Boot (con `@ControllerAdvice`).
    * Manejo de errores amigable en el frontend.
* **3. Contenerización (Docker - muy recomendado):**
    * Crea un `Dockerfile` para tu aplicación Spring Boot.
    * Crea un `Dockerfile` para tu aplicación Next.js (o usa la build-in de Next.js si despliegas en Vercel).
    * Usa `docker-compose.yml` para orquestar la DB (PostgreSQL), el backend y el frontend. Esto facilitará el desarrollo y el despliegue.
* **4. Despliegue:**
    * Elige una plataforma de despliegue:
        * **Backend (Java/Spring Boot):** Render.com, Fly.io, Google Cloud Run, AWS Elastic Beanstalk.
        * **Frontend (Next.js):** Vercel (ideal para Next.js).
        * **Base de Datos (PostgreSQL):** Render.com, Supabase, ElephantSQL.
    * Configura un pipeline **CI/CD básico con GitHub Actions**:
        * Cuando hagas push a `main`, que se ejecuten los tests.
        * Si los tests pasan, que se construyan las imágenes Docker (o builds) y se desplieguen.
* **5. Documentación del Proyecto:**
    * Actualiza tu `README.md` en GitHub con instrucciones de instalación/ejecución, descripción de la arquitectura, demo, y lecciones aprendidas.
