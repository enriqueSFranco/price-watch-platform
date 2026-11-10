import { AppError } from "../../../../shared/utils/AppError";

export class ScraperErrors {
  /** NO se encontró el selector requerido en el DOM */
  static readonly SELECTOR_NOT_FOUND = new AppError(
    "SELECTOR_NOT_FOUND",
    "No se encontró el selector requerido para extraer la información."
  );

  /** El HTML se cargó, pero contiene información incompleta */
  static readonly INVALID_PRODUCT_DATA = new AppError(
    "INVALID_PRODUCT_DATA",
    "Los datos obtenidos del producto no son válidos o están incompletos."
  );

  /** El scraper detectó un Captcha o bloqueo por parte del sitio */
  static readonly BLOCKED_BY_WEBSITE = new AppError(
    "BLOCKED_BY_WEBSITE",
    "El sitio web bloqueó la solicitud (posible CAPTCHA o denegación de acceso)"
  );

  /** La tienda no es compatible con el scraper actual */
  static readonly UNSUPPORTED_STORE = new AppError(
    "UNSUPPORTED_STORE",
    "La tienda o página no es compatible con este scraper."
  );

  /** El precio no se pudo parsear a número */
  static readonly PRICE_PARSE_ERROR = new AppError(
    "PRICE_PARSE_ERROR",
    "No fue posible interpretar el precio del producto desde la página."
  );

  /** Puppeteer no pudo renderizar la página */
  static readonly PAGE_RENDER_ERROR = new AppError(
    "PAGE_RENDER_ERROR",
    "Hubo un problema al renderizar la página en el navegador automatizado."
  );

  /** El sitio respondió con status 404 / 500 / etc. */
  static readonly HTTP_STATUS_ERROR = new AppError(
    "HTTP_STATUS_ERROR",
    "El sitio web devolvió un código de estado HTTP inesperado."
  );

  /** Error al extraer imagen del producto */
  static readonly IMAGE_EXTRACTION_ERROR = new AppError(
    "IMAGE_EXTRACTION_ERROR",
    "No se pudo extraer la imagen del producto."
  );

  /** Error general desconocido */
  static readonly UNKNOWN_SCRAPER_ERROR = new AppError(
    "UNKNOWN_SCRAPER_ERROR",
    "Ocurrió un error inesperado al ejecutar el scraper."
  );

  /** Error de conexión o timeout */
  static readonly NETWORK_ERROR = new AppError(
    "NETWORK_ERROR",
    "Error de conexión al intentar acceder a la URL del producto."
  );
}

/**
 * Features
 * RETRY_LIMIT_REACHED (cuando ya hiciste varios intentos)
 * PROXY_EXHAUSTED (si usas rotación de proxies)
 * INVALID_URL_FORMAT (si el usuario ingresa un URL inválido)
 * API_RATE_LIMITED (si la tienda tiene límite de requests)
 * JSON_API_ERROR (si la página usa API interna en vez de HTML)
 */
