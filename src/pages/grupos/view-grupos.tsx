import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Grupo } from "@/components/catalogo/catalogo-types";
import { DialogGrupoDetails } from "@/components/grupos/view-grupos/dialog-details-grupo";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { useRefresh } from "../../hooks/use-refresh";

const ViewGruposPage = () => {
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Usar el hook useRefresh para manejar los grupos
  const {
    data: grupos,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<Grupo>("/catalogo/grupos");

  const handleGrupoStatusChange = (grupoId: number, newStatus: boolean) => {
    updateItem((currentGrupos) =>
      currentGrupos.map((grupo) =>
        grupo.grupoId === grupoId
          ? { ...grupo, estadoRegistro: newStatus }
          : grupo
      )
    );
  };

  const filteredGrupos = grupos.filter((grupo) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return true;
    }

    return (
      grupo.nombre.toLowerCase().includes(term) ||
      grupo.linea.nombre.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Grupos" />

      <div className="content-wrap">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Grupos
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
                placeholder="Buscar por grupo o linea"
                className="table-search-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="table-toolbar-action">
              <Link
                to="/grupos/registrar"
                className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                <PlusIcon className="w-5 h-5" />
                Registrar Grupo
              </Link>
            </div>
          </div>

          {/* Renderizado condicional de la tabla, carga o error */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando grupos...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los grupos.
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
                      Línea
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Fecha Creación
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
                  {filteredGrupos.map((grupo) => (
                    <tr
                      key={grupo.grupoId}
                      className="hover:bg-[color:var(--table-hover)]"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {grupo.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {grupo.linea.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(grupo.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <CommonStatusToggle
                          entityId={grupo.grupoId}
                          endpoint={`/catalogo/grupos/${grupo.grupoId}/change-status`}
                          initialStatus={grupo.estadoRegistro}
                          onStatusChange={handleGrupoStatusChange}
                          ariaLabel="Cambiar estado del grupo"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="table-toolbar-action">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedGrupo(grupo)}
                            title="Ver detalles del grupo"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              navigate(`/grupos/editar/${grupo.grupoId}`)
                            }
                            title="Editar grupo"
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
      {/* Diálogo para ver detalles del grupo */}
      <DialogGrupoDetails
        isOpen={!!selectedGrupo}
        grupo={selectedGrupo}
        onClose={() => setSelectedGrupo(null)} // La función de cierre limpia el estado
      />
    </div>
  );
};

export default ViewGruposPage;






