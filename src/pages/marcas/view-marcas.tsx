import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Marca } from "@/components/catalogo/catalogo-types";
import { DialogMarcaDetails } from "@/components/marcas/view-marcas/dialog-details-marca";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { useRefresh } from "../../hooks/use-refresh";

const ViewMarcasPage = () => {
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const {
    data: marcas,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<Marca>("/catalogo/marcas");

  const handleMarcaStatusChange = (marcaId: number, newStatus: boolean) => {
    updateItem((currentMarcas) =>
      currentMarcas.map((marca) =>
        marca.marcaId === marcaId
          ? { ...marca, estadoRegistro: newStatus }
          : marca
      )
    );
  };

  const filteredMarcas = marcas.filter((marca) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return true;
    }

    return marca.nombre.toLowerCase().includes(term);
  });

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Marcas" />

      <div className="content-wrap">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todas las Marcas
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
                placeholder="Buscar marca"
                className="table-search-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="table-toolbar-action">
              <Link
                to="/marcas/registrar"
                className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
              >
                <PlusIcon className="w-5 h-5" />
                Registrar Marca
              </Link>
            </div>
          </div>

          {/* Renderizado condicional de la tabla, carga o error */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando marcas...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar las marcas.
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
                  {filteredMarcas.map((marca) => (
                    <tr
                      key={marca.marcaId}
                      className="hover:bg-[color:var(--table-hover)]"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {marca.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(marca.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <CommonStatusToggle
                          entityId={marca.marcaId}
                          endpoint={`/catalogo/marcas/${marca.marcaId}/change-status`}
                          initialStatus={marca.estadoRegistro}
                          onStatusChange={handleMarcaStatusChange}
                          ariaLabel="Cambiar estado de la marca"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="table-toolbar-action">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedMarca(marca)}
                            title="Ver detalles de la marca"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              navigate(`/marcas/editar/${marca.marcaId}`)
                            }
                            title="Editar marca"
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
      {/* Diálogo para ver detalles de la marca */}
      <DialogMarcaDetails
        isOpen={!!selectedMarca}
        marca={selectedMarca}
        onClose={() => setSelectedMarca(null)} // La función de cierre limpia el estado
      />
    </div>
  );
};

export default ViewMarcasPage;






