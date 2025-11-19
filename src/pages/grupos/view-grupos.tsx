import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  // MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Grupo } from "@/context/auth-context";
import { DialogGrupoDetails } from "@/components/grupos/view-grupos/dialog-details-grupo";
import { StatusToggle } from "@/components/grupos/view-grupos/status-toggle";
import { useRefresh } from "../../hooks/use-refresh";

const ViewGruposPage = () => {
  const [selectedGrupo, setSelectedGrupo] = useState<Grupo | null>(null);
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

  return (
    <div>
      <Header titulo="Grupos" />

      <div className="p-6">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Grupos
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
                to="/grupos/registrar"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
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
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200">
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
                  {grupos.map((grupo) => (
                    <tr
                      key={grupo.grupoId}
                      className="border-b border-gray-200 hover:bg-gray-50"
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
                        <StatusToggle
                          grupoId={grupo.grupoId}
                          initialStatus={grupo.estadoRegistro}
                          onStatusChange={handleGrupoStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
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
