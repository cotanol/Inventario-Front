import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { User } from "@/context/auth-context";
import { DialogUserDetails } from "@/components/usuarios/view-users/dialog-details-user";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { useRefresh } from "../../hooks/use-refresh";

const ViewUsersPage = () => {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredUsers = users.filter((user) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return true;
    }

    const fullName = `${user.nombre} ${user.apellido}`.toLowerCase();
    const role = (user.rol ?? "").toLowerCase();
    const email = (user.correoElectronico ?? "").toLowerCase();

    return (
      fullName.includes(term) || role.includes(term) || email.includes(term)
    );
  });

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Usuarios" />

      <div className="content-wrap">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Usuarios
          </h2>
        </div>

        {/* Contenedor principal blanco */}
        <div className="panel-card content-main-card">
          {/* Barra de controles: Búsqueda y Botones */}
          <div className="table-toolbar border-b border-slate-200/70 p-4">
            <div className="table-toolbar-search">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, rol o correo"
                className="table-search-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="table-toolbar-action">
              <Link
                to="/usuarios/registrar"
                className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
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
            <div className="table-shell table-scroll">
              <table className="data-grid data-grid-responsive min-w-full">
                <thead>
                  <tr>
                    {/* TODO: Comentado temporalmente - Se agregará más adelante para acciones múltiples */}
                    {/* <th className="px-6 py-4 text-left">
                      <input type="checkbox" className="rounded" />
                    </th> */}
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Correo
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
                  {filteredUsers.map((user) => (
                    <tr
                      key={user.usuarioId}
                      className="hover:bg-[color:var(--table-hover)]"
                    >
                      {/* TODO: Comentado temporalmente - Se agregará más adelante para acciones múltiples */}
                      {/* <td className="px-6 py-4">
                        <input type="checkbox" className="rounded" />
                      </td> */}
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">{`${user.nombre} ${user.apellido}`}</td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.rol}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.correoElectronico}
                      </td>
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <CommonStatusToggle
                          entityId={user.usuarioId}
                          endpoint={`/auth/change-status/${user.usuarioId}`}
                          initialStatus={user.estadoRegistro}
                          onStatusChange={handleUserStatusChange}
                          ariaLabel="Cambiar estado del usuario"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="table-toolbar-action">
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






