import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { mockBaseQuery } from '@/lib/mockBaseQuery';

const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;
const USE_MOCK_API = process.env.NEXT_PUBLIC_USE_MOCK_API === 'true';

let baseQuery;

if (USE_MOCK_API) {
  // Adaptador MOCK (Infraestructura de Prueba)
  // Reemplazamos completamente fetchBaseQuery con nuestro simulador
  baseQuery = mockBaseQuery;
  console.warn("--- ALERTA: Usando MOCK API para todas las peticiones ---");
} else {
  // Adaptador REAL (Infraestructura de Producción)
  baseQuery = fetchBaseQuery({
    baseUrl: BACKEND_URL,
    credentials: 'include',
    prepareHeaders: (headers) => {
      // Aquí manejarías el token de autenticación real
      return headers;
    },
  });
}

// Creamos UNA sola API raíz
export const baseApi = createApi({
	reducerPath: 'baseApi',
	baseQuery,
	endpoints: () => ({}),
	// Aquí NO definimos endpoints todavía
	// porque los injectaremos después (muy útil para escalado)
});
