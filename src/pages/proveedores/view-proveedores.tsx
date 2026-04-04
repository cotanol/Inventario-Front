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
import { CommonStatusToggle } from "@/components/common/status-toggle";
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
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Proveedores" />
      <div className="content-wrap">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Proveedores
          </h2>
        </div>

        <div className="panel-card content-main-card">
          <div className="table-toolbar border-b border-slate-200/70 p-4">
            <div className="table-toolbar-search">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, RUC/Tax ID, país..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="table-search-input"
              />
            </div>
            <Link
              to="/proveedores/registrar"
              className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
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
            <div className="table-shell table-scroll">
              <table className="data-grid data-grid-responsive w-full">
                <thead>
                  <tr>
                    <th className="text-left">
                      ID
                    </th>
                    <th className="text-left">
                      Empresa
                    </th>
                    <th className="text-left">
                      RUC / Tax ID
                    </th>
                    <th className="text-left">
                      País
                    </th>
                    <th className="text-left">
                      Contacto
                    </th>
                    <th className="text-left">
                      Estado
                    </th>
                    <th className="text-left">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {filteredProveedores.map((proveedor) => (
                    <tr
                      key={proveedor.proveedorId}
                      className="hover:bg-[color:var(--table-hover)]"
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
                        <CommonStatusToggle
                          entityId={proveedor.proveedorId}
                          endpoint={`/proveedores/${proveedor.proveedorId}/change-status`}
                          initialStatus={proveedor.estadoRegistro}
                          onStatusChange={handleProveedorStatusChange}
                          ariaLabel="Cambiar estado del proveedor"
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





