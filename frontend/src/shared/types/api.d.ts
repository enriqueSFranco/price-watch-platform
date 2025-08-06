// Respuesta genérica de error de la API
export type ApiError = {
  status: number;
  message: string;
  details?: string;
};

// Tipos para la respuesta de la API de sitios soportados
export type SupportedSitesResponse = {
  supportedDomains: string[];
};

// Tipos para la respuesta de la API de un solo producto
export type ProductResponse = {
  product: Product;
};

// Tipos para la respuesta de la API de múltiples productos
export type ProductsListResponse = {
  products: Product[];
};

// Tipos para las opciones de los gráficos
export type ChartDataPoint = {
  date: string; // Fecha en formato ISO
  price: number;
}
