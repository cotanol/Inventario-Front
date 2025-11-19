import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  UserPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { type IProveedor } from "@/components/proveedores/proveedor-schema";
import { useRefresh } from "../../hooks/use-refresh";
import { ProveedorStatusToggle } from "@/components/proveedores/view-proveedores.tsx/status-toggle";
import { DialogProveedorDetails } from "@/components/proveedores/view-proveedores.tsx/dialog-details-proveedor";

const ViewProveedoresPage = () => {
  const [selectedProveedor, setSelectedProveedor] = useState<IProveedor | null>(
    null
  );
  const navigate = useNavigate();

  const {
    data: proveedores,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<IProveedor>("/proveedores");

  const [searchTerm, setSearchTerm] = useState("");

  const handleProveedorStatusChange = (
    proveedorId: number,
    newStatus: boolean
  ) => {
    updateItem((currentProveedores) =>
      currentProveedores.map((proveedor) =>
        proveedor.proveedorId === proveedorId
          ? { ...proveedor, estadoRegistro: newStatus }
          : proveedor
      )
    );
  };

  const filteredProveedores = (proveedores || []).filter((proveedor) => {
    const term = searchTerm.toLowerCase();
    const nombre = proveedor.nombreEmpresa.toLowerCase();
    const fiscal = proveedor.numeroIdentificacionFiscal.toLowerCase();
    const pais = proveedor.pais.toLowerCase();

    return (
      nombre.includes(term) || fiscal.includes(term) || pais.includes(term)
    );
  });

  return (
    <div>
      <Header titulo="Proveedores" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Proveedores
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, RUC/Tax ID, país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <Link
              to="/proveedores/registrar"
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <UserPlusIcon className="w-5 h-5" />
              Nuevo Proveedor
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          ) : apiError ? (
            <div className="flex justify-center items-center h-64 text-red-600">
              Error al cargar proveedores
            </div>
          ) : filteredProveedores.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No se encontraron proveedores
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Empresa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      RUC / Tax ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      País
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Contacto
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredProveedores.map((proveedor) => (
                    <tr
                      key={proveedor.proveedorId}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proveedor.proveedorId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {proveedor.nombreEmpresa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proveedor.numeroIdentificacionFiscal}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proveedor.pais}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {proveedor.contactoNombre || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <ProveedorStatusToggle
                          proveedorId={proveedor.proveedorId}
                          initialStatus={proveedor.estadoRegistro}
                          onStatusChange={handleProveedorStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedProveedor(proveedor)}
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            title="Ver detalles del proveedor"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(
                                `/proveedores/editar/${proveedor.proveedorId}`
                              )
                            }
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            title="Editar proveedor"
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

      <DialogProveedorDetails
        proveedor={selectedProveedor}
        isOpen={!!selectedProveedor}
        onClose={() => setSelectedProveedor(null)}
      />
    </div>
  );
};

export default ViewProveedoresPage;
