import { useEffect, useState } from "react";
import useFetchApi from "../hooks/use-fetch";
import { Link } from "react-router-dom";
import Header from "../components/header";
import {
  UserPlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

// --- Interfaces (sin cambios) ---
interface IPerfilInfo {
  nombre: string;
}
interface IPerfilLink {
  perfil: IPerfilInfo;
}
interface IUser {
  id: string;
  dni: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno?: string | null;
  correoElectronico: string;
  estadoRegistro: boolean;
  perfilesLink: IPerfilLink[];
}

const ViewUsersPage = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [apiError, setApiError] = useState<any | null>(null);
  const { get } = useFetchApi();

  useEffect(() => {
    const fetchUsers = async () => {
      // ... Lógica de fetch sin cambios
      setIsLoading(true);
      setApiError(null);
      try {
        const response = await get<IUser[]>("/auth/usuarios");
        setUsers(response);
      } catch (err) {
        setApiError(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, [get]);

  return (
    <div>
      <Header titulo="Users" />

      <div className="p-6">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">All Users</h2>
          <p className="text-sm text-gray-500">
            Dashboard &gt; <span className="font-semibold">Users</span>
          </p>
        </div>

        {/* Contenedor principal blanco */}
        <div className="bg-white rounded-lg shadow-sm">
          {/* Barra de controles: Búsqueda y Botones */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search"
                className="pl-10 pr-4 py-2 w-64 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
              />
            </div>

            <div className="flex items-center gap-2">
              {/* El botón de Filtro se puede añadir aquí en el futuro */}
              <Link
                to="/admin/create-user"
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
                        {user.perfilesLink
                          .map((p) => p.perfil.nombre)
                          .join(", ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {user.correoElectronico}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.estadoRegistro
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {user.estadoRegistro ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button className="text-blue-500 hover:text-blue-700">
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button className="text-gray-400 hover:text-gray-600">
                            <PencilSquareIcon className="w-5 h-5" />
                          </button>
                          <button className="text-red-500 hover:text-red-700">
                            <TrashIcon className="w-5 h-5" />
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
    </div>
  );
};

export default ViewUsersPage;
