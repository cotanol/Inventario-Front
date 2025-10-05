import { useEffect, useState } from "react";
import useFetchApi from "../hooks/use-fetch";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/header";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { StatusToggle } from "@/components/status-toggle";
import { DialogDeleteUser } from "@/components/dialog-delete-user";
import type { User } from "@/context/auth-context";
import { DialogUserDetails } from "@/components/dialog-details-user";

const ViewUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<any | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const { get } = useFetchApi();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      // ... Lógica de fetch sin cambios
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await get<User[]>("/auth/usuarios");
        setUsers(response);
      } catch (err) {
        setApiError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [get]);

  const handleUserDeleted = (deletedUserId: number) => {
    // Filtramos el usuario eliminado de la lista para actualizar la UI al instante
    setUsers((currentUsers) =>
      currentUsers.filter((user) => user.id !== deletedUserId)
    );
  };

  const handleUserStatusChange = (userId: number, newStatus: boolean) => {
    setUsers((currentUsers) =>
      currentUsers.map((user) =>
        user.id === userId ? { ...user, estadoRegistro: newStatus } : user
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
                Add User
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
                    <th className="px-6 py-4 text-left">
                      <input type="checkbox" className="rounded" />
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      User Name
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      User ID
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Position
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Contact
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <input type="checkbox" className="rounded" />
                      </td>
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
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <StatusToggle
                          userId={user.id}
                          initialStatus={user.estadoRegistro}
                          onStatusChange={handleUserStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setSelectedUser(user)} // Al hacer clic, guardamos el usuario
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              navigate(`/usuarios/editar/${user.id}`)
                            }
                          >
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <DialogDeleteUser
                            userId={user.id}
                            onDeleteSuccess={handleUserDeleted}
                          />
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
