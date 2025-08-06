// Tipos de reglas de notificación
export type NotificationRuleType = "threshold" | "percentage_drop" | "lowest_price";

// Tipos para las reglas de notificación
export type NotificationRule = {
  id: string;
  productId: string;
  type: NotificationRuleType;
  value: number | null;
  targetEmail: string | null;
  isActive: boolean;
  lastNotifiedAt: string | null;
  createdAt: string;
};

// Tipos para el historial de precios
export type PriceHistory = {
  id: string;
  productId: string;
  price: number;
  timestamp: string;
};

// Tipos de estado de un producto
export type ProductStatusType = "active" | "paused" | "error";

// Tipos para un producto monitoreado (el objeto completo)
export type ProductType = {
  id: string;
  userId: string;
  name: string;
  originalUrl: string;
  domain: string;
  imageUrl: string | null;
  currentPrice: number;
  currency: string;
  initialPrice: number;
  lastCheckedAt: string;
  createdAt: string;
  status: ProductStatus;
  notificationRules: NotificationRule[];
};

// Datos que se envían al backend para añadir un nuevo producto
export type AddProductDataType = {
  url: string;
  name?: string;
  email: string;
  rules: {
    threshold?: number;
    percentageDrop?: number;
    lowestPrice?: boolean;
  };
};

// Tipos para el análisis de reseñas (opcional si implementas la funcionalidad de OpenAI)
export type ReviewAnalysis = {
  summary: string;
  pros: string[];
  cons: string[];
  sentiment: "positive" | "negative" | "neutral" | "mixed";
};

// Tipos para un producto con su análisis de reseñas
export type ProductWithAnalysis = Product & {
  reviewAnalysis: ReviewAnalysis;
};

export interface ScrapedProduct {
  status: boolean;
  message: string;
  data: {
    site: EcommerceEnum,
    product: {
      name: string;
      imageUrl: string | null;
      originalUrl: string;
      currentPrice: number;
      currency: string;
    }
  };
}
