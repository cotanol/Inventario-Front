import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  UserPlusIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";
import { type IPerfil } from "@/components/perfiles/perfil-schema";
import { useRefresh } from "../../hooks/use-refresh";
import { PerfilStatusToggle } from "@/components/perfiles/view-perfiles.tsx/status-toggle";
import { DialogPerfilDetails } from "@/components/perfiles/view-perfiles.tsx/dialog-details-perfil";

const ViewPerfilesPage = () => {
  const [selectedPerfil, setSelectedPerfil] = useState<IPerfil | null>(null);
  const navigate = useNavigate();

  const {
    data: perfiles,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<IPerfil>("/auth/perfiles");

  const handleStatusChange = (perfilId: number, newStatus: boolean) => {
    updateItem((currentData) =>
      currentData.map((perfil) =>
        perfil.perfilId === perfilId
          ? { ...perfil, estadoRegistro: newStatus }
          : perfil
      )
    );
  };

  return (
    <div>
      <Header titulo="Perfiles" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Perfiles
          </h2>
        </div>
        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-end p-4 border-b">
            <Link
              to="/perfiles/registrar"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700"
            >
              <UserPlusIcon className="w-5 h-5" /> Registrar Perfil
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10">Cargando perfiles...</div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los perfiles.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b">
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
                  {perfiles.map((perfil) => (
                    <tr
                      key={perfil.perfilId}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {perfil.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                        {perfil.descripcion || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-center text-gray-500">
                        {perfil.opcionesMenuLink?.length || 0}
                      </td>
                      <td className="px-6 py-4">
                        <PerfilStatusToggle
                          perfilId={perfil.perfilId}
                          initialStatus={perfil.estadoRegistro}
                          onStatusChange={handleStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            className="text-blue-500 hover:text-blue-700"
                            onClick={() => setSelectedPerfil(perfil)}
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="text-gray-400 hover:text-gray-600"
                            onClick={() =>
                              navigate(`/perfiles/editar/${perfil.perfilId}`)
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
      <DialogPerfilDetails
        isOpen={!!selectedPerfil}
        perfil={selectedPerfil}
        onClose={() => setSelectedPerfil(null)}
      />
    </div>
  );
};
export default ViewPerfilesPage;
