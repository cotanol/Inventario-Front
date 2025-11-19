import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  UserPlusIcon,
  // MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { User } from "@/context/auth-context";
import { DialogUserDetails } from "@/components/usuarios/view-users/dialog-details-user";
import { StatusToggle } from "@/components/usuarios/view-users/status-toggle";
import { useRefresh } from "../../hooks/use-refresh";

const ViewUsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const navigate = useNavigate();

  // Usar el hook useRefresh para manejar los usuarios
  const {
    data: users,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<User>("/auth/usuarios");

  const handleUserStatusChange = (userId: number, newStatus: boolean) => {
    updateItem((currentUsers) =>
      currentUsers.map((user) =>
        user.usuarioId === userId
          ? { ...user, estadoRegistro: newStatus }
          : user
      )
    );
  };

  return (
    <div>
      <Header titulo="Usuarios" />

      <div className="p-6">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Usuarios
          </h2>
        </div>

        {/* Contenedor principal blanco */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Barra de controles: Búsqueda y Botones */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="relative">
              {/* <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              /> */}
            </div>

            <div className="flex items-center gap-2">
              <Link
                to="/usuarios/registrar"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <UserPlusIcon className="w-5 h-5" />
                Registrar Usuario
              </Link>
            </div>
          </div>

          {/* Renderizado condicional de la tabla, carga o error */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando usuarios...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los usuarios.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    {/* TODO: Comentado temporalmente - Se agregará más adelante para acciones múltiples */}
                    {/* <th className="px-6 py-4 text-left">
                      <input type="checkbox" className="rounded" />
                    </th> */}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Nombres Completos
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      DNI
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Perfiles
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Correo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Celular
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.usuarioId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      {/* TODO: Comentado temporalmente - Se agregará más adelante para acciones múltiples */}
                      {/* <td className="px-6 py-4">
                        <input type="checkbox" className="rounded" />
                      </td> */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{`${user.nombres} ${user.apellidoPaterno}`}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.dni}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.perfiles.join(", ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.correoElectronico}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.celular || "-"}
                      </td>
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <StatusToggle
                          userId={user.usuarioId}
                          initialStatus={user.estadoRegistro}
                          onStatusChange={handleUserStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedUser(user)}
                            title="Ver detalles del usuario"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              navigate(`/usuarios/editar/${user.usuarioId}`)
                            }
                            title="Editar usuario"
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
      {/* Diálogo para ver detalles del usuario */}
      <DialogUserDetails
        isOpen={!!selectedUser}
        user={selectedUser}
        onClose={() => setSelectedUser(null)} // La función de cierre limpia el estado
      />
    </div>
  );
};

export default ViewUsersPage;
