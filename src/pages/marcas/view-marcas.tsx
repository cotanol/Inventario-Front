import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  // MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Marca } from "@/context/auth-context";
import {
  DialogMarcaDetails,
  StatusToggle,
} from "@/components/marcas/view-marcas";
import { useRefresh } from "../../hooks/use-refresh";

const ViewMarcasPage = () => {
  const [selectedMarca, setSelectedMarca] = useState<Marca | null>(null);
  const navigate = useNavigate();

  // Usar el hook useRefresh para manejar las marcas
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

  return (
    <div>
      <Header titulo="Marcas" />

      <div className="p-6">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todas las Marcas
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
                to="/marcas/registrar"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
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
                  {marcas.map((marca) => (
                    <tr
                      key={marca.marcaId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {marca.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {new Date(marca.fechaCreacion).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <StatusToggle
                          marcaId={marca.marcaId}
                          initialStatus={marca.estadoRegistro}
                          onStatusChange={handleMarcaStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setSelectedMarca(marca)} // Al hacer clic, guardamos la marca
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              navigate(`/marcas/editar/${marca.marcaId}`)
                            }
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
