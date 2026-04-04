import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth-context";
import { hasRequiredPermissions } from "@/lib/permissions";

interface PermissionRouteProps {
  permisosRequeridos?: string[];
  requiereTodos?: boolean; // Si true, necesita TODOS los permisos, si false solo uno
}

/**
 * Componente para proteger rutas basándose en permisos específicos
 * Ejemplo: <Route element={<PermissionRoute permisosRequeridos={['USUARIOS']} />}>
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

  const tienePermisos = hasRequiredPermissions(
    user.permisos,
    permisosRequeridos,
    requiereTodos,
  );

  if (!tienePermisos) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default PermissionRoute;
