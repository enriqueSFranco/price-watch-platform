// Datos que enviamos para el registro
export type RegisterData = {
  email: string;
  password: string;
};

// Datos que enviamos para el login
export type LoginData = {
  email: string;
  password: string;
};

// Respuesta exitosa del login o registro
export type AuthResponse = {
  token: string;
  user: {
    id: number;
    email: string;
  };
};

// Usuario actual de la sesión (lo que guardarías en el estado del cliente)
export type UserSession = {
  id: number;
  email: string;
  token: string;
};
