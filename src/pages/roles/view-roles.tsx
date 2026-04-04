import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  UserPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { type IRol } from "@/components/roles/role-schema";
import { useRefresh } from "../../hooks/use-refresh";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { DialogRoleDetails } from "@/components/roles/view-roles/dialog-details-role";

const ViewRolesPage = () => {
  const [selectedPerfil, setSelectedPerfil] = useState<IRol | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    data: perfiles,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<IRol>("/auth/roles");

  const handleStatusChange = (rolId: number, newStatus: boolean) => {
    updateItem((currentData) =>
      currentData.map((perfil) =>
        perfil.rolId === rolId
          ? { ...perfil, estadoRegistro: newStatus }
          : perfil
      )
    );
  };

  const filteredPerfiles = perfiles.filter((perfil) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return true;
    }

    return (
      perfil.nombre.toLowerCase().includes(term) ||
      (perfil.descripcion ?? "").toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Roles" />
      <div className="content-wrap">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Roles
          </h2>
        </div>
        <div className="panel-card content-main-card">
          <div className="table-toolbar border-b border-slate-200/70 p-4">
            <div className="table-toolbar-search">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre o descripcion"
                className="table-search-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <Link
              to="/roles/registrar"
              className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              <UserPlusIcon className="w-5 h-5" /> Registrar Rol
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Cargando roles...</div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los roles.
            </div>
          ) : (
            <div className="table-shell table-scroll">
              <table className="data-grid data-grid-responsive min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Descripción
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Permisos
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
                  {filteredPerfiles.map((perfil) => (
                    <tr
                      key={perfil.rolId}
                      className="hover:bg-[color:var(--table-hover)]"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {perfil.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {perfil.descripcion || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-500">
                        {perfil.permisos?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <CommonStatusToggle
                          entityId={perfil.rolId}
                          endpoint={`/auth/roles/${perfil.rolId}/change-status`}
                          initialStatus={perfil.estadoRegistro}
                          onStatusChange={handleStatusChange}
                          ariaLabel="Cambiar estado del rol"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="table-toolbar-action">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedPerfil(perfil)}
                            title="Ver detalles del perfil"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              navigate(`/roles/editar/${perfil.rolId}`)
                            }
                            title="Editar rol"
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
      <DialogRoleDetails
        isOpen={!!selectedPerfil}
        perfil={selectedPerfil}
        onClose={() => setSelectedPerfil(null)}
      />
    </div>
  );
};
export default ViewRolesPage;






