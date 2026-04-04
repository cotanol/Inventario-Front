import { useAuth } from "@/context/auth-context";
import { hasRequiredPermissions } from "@/lib/permissions";

/**
 * Hook para verificar si el usuario tiene uno o más permisos
 * @param permisos - Array de keyPermisos a verificar (ej: ['CREAR_USUARIO', 'EDITAR_USUARIO'])
 * @returns true si el usuario tiene al menos uno de los permisos, false si no
 */
export const usePermission = (permisos: string | string[]): boolean => {
  const { user } = useAuth();

  if (!user || !user.permisos) {
    return false;
  }

  const permisosArray = Array.isArray(permisos) ? permisos : [permisos];

  return hasRequiredPermissions(user.permisos, permisosArray, false);
};

/**
 * Hook para verificar si el usuario tiene TODOS los permisos especificados
 * @param permisos - Array de keyPermisos a verificar
 * @returns true si el usuario tiene todos los permisos, false si no
 */
export const usePermissionAll = (permisos: string[]): boolean => {
  const { user } = useAuth();

  if (!user || !user.permisos) {
    return false;
  }

  return hasRequiredPermissions(user.permisos, permisos, true);
};

/**
 * Hook para obtener todos los permisos del usuario
 * @returns Array de permisos del usuario
 */
export const useUserPermissions = (): string[] => {
  const { user } = useAuth();
  return user?.permisos || [];
};
