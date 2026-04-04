import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  // MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Linea } from "@/components/catalogo/catalogo-types";
import { DialogLineaDetails } from "@/components/lineas/view-lineas/dialog-details-linea";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { useRefresh } from "../../hooks/use-refresh";

const ViewLineasPage = () => {
  const [selectedLinea, setSelectedLinea] = useState<Linea | null>(null);
  const navigate = useNavigate();

  // Usar el hook useRefresh para manejar las líneas
  const {
    data: lineas,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<Linea>("/catalogo/lineas");

  const handleLineaStatusChange = (lineaId: number, newStatus: boolean) => {
    updateItem((currentLineas) =>
      currentLineas.map((linea) =>
        linea.lineaId === lineaId
          ? { ...linea, estadoRegistro: newStatus }
          : linea
      )
    );
  };

  return (
    <div>
      <Header titulo="Líneas" />

      <div className="p-6">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todas las Líneas
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
                to="/lineas/registrar"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <PlusIcon className="w-5 h-5" />
                Registrar Línea
              </Link>
            </div>
          </div>

          {/* Renderizado condicional de la tabla, carga o error */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando líneas...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar las líneas.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200">
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
                  {lineas.map((linea) => (
                    <tr
                      key={linea.lineaId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {linea.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(linea.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <CommonStatusToggle
                          entityId={linea.lineaId}
                          endpoint={`/catalogo/lineas/${linea.lineaId}/change-status`}
                          initialStatus={linea.estadoRegistro}
                          onStatusChange={handleLineaStatusChange}
                          ariaLabel="Cambiar estado de la linea"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedLinea(linea)}
                            title="Ver detalles de la línea"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              navigate(`/lineas/editar/${linea.lineaId}`)
                            }
                            title="Editar línea"
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
      {/* Diálogo para ver detalles de la línea */}
      <DialogLineaDetails
        isOpen={!!selectedLinea}
        linea={selectedLinea}
        onClose={() => setSelectedLinea(null)} // La función de cierre limpia el estado
      />
    </div>
  );
};

export default ViewLineasPage;
