import type { ModulePermission } from "./permissions";

export interface ApiMeta {
  [key: string]: unknown;
}

export interface ApiError {
  code: string;
  message: string;
  details: unknown;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error: ApiError | null;
  meta: ApiMeta | null;
}

export interface AuthUser {
  usuarioId: number;
  nombre: string;
  apellido: string;
  correoElectronico: string;
  estadoRegistro: boolean;
  fechaCreacion: string;
  fechaModificacion: string | null;
  rol: string;
  permisos: ModulePermission[];
}

export interface AuthSession {
  user: AuthUser;
  token: string;
}
