import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

interface PermissionRouteProps {
  permisosRequeridos?: string[]; // Array de keyPermisos (ej: ['CREAR_USUARIO'])
  requiereTodos?: boolean; // Si true, necesita TODOS los permisos, si false solo uno
}

/**
 * Componente para proteger rutas basándose en permisos específicos
 * Ejemplo: <Route element={<PermissionRoute permisosRequeridos={['CREAR_USUARIO']} />}>
 */
const PermissionRoute = ({
  permisosRequeridos,
  requiereTodos = false,
}: PermissionRouteProps) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Verificando permisos...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Si no se especifican permisos, permite el acceso
  if (!permisosRequeridos || permisosRequeridos.length === 0) {
    return <Outlet />;
  }

  // Verificar permisos
  const tienePermisos = requiereTodos
    ? permisosRequeridos.every((permiso) => user.permisos?.includes(permiso))
    : permisosRequeridos.some((permiso) => user.permisos?.includes(permiso));

  if (!tienePermisos) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PermissionRoute;
