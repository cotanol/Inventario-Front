import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  UserPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { type IVendedor } from "@/components/vendedores/vendedor-schema";

import { useRefresh } from "../../hooks/use-refresh";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { DialogVendedorDetails } from "@/components/vendedores/view-vendedores.tsx/dialog-details-vendedor";

const ViewVendedoresPage = () => {
  const [selectedVendedor, setSelectedVendedor] = useState<IVendedor | null>(
    null
  );
  const navigate = useNavigate();

  const {
    data: vendedores,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<IVendedor>("/vendedores");

  const [searchTerm, setSearchTerm] = useState("");

  const handleVendedorStatusChange = (
    vendedorId: number,
    newStatus: boolean
  ) => {
    updateItem((currentVendedores) =>
      currentVendedores.map((vendedor) =>
        vendedor.vendedorId === vendedorId
          ? { ...vendedor, estadoRegistro: newStatus }
          : vendedor
      )
    );
  };

  const filteredVendedores = (vendedores || []).filter((vendedor) => {
    const term = searchTerm.toLowerCase();
    const nombreCompleto =
      `${vendedor.nombres} ${vendedor.apellidoPaterno} ${vendedor.apellidoMaterno}`.toLowerCase();
    const dni = vendedor.dni.toLowerCase();
    const correo = vendedor.correo.toLowerCase();

    return (
      nombreCompleto.includes(term) ||
      dni.includes(term) ||
      correo.includes(term)
    );
  });

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Vendedores" />
      <div className="content-wrap">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Vendedores
          </h2>
        </div>

        <div className="panel-card content-main-card">
          <div className="table-toolbar border-b border-slate-200/70 p-4">
            <div className="table-toolbar-search">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Nombre, DNI o Correo..."
                className="table-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to="/vendedores/registrar"
              className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              <UserPlusIcon className="w-5 h-5" />
              Registrar Vendedor
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando vendedores...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los vendedores.
            </div>
          ) : (
            <div className="table-shell table-scroll">
              <table className="data-grid data-grid-responsive min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Nombre Completo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      DNI
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Correo
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
                  {filteredVendedores.map((vendedor) => (
                    <tr
                      key={vendedor.vendedorId}
                      className="hover:bg-[color:var(--table-hover)]"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {vendedor.nombres} {vendedor.apellidoPaterno}{" "}
                        {vendedor.apellidoMaterno}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {vendedor.dni}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {vendedor.correo}
                      </td>
                      <td className="px-6 py-4">
                        <CommonStatusToggle
                          entityId={vendedor.vendedorId}
                          endpoint={`/vendedores/${vendedor.vendedorId}/change-status`}
                          initialStatus={vendedor.estadoRegistro}
                          onStatusChange={handleVendedorStatusChange}
                          ariaLabel="Cambiar estado del vendedor"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="table-toolbar-action">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedVendedor(vendedor)}
                            title="Ver detalles del vendedor"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              navigate(
                                `/vendedores/editar/${vendedor.vendedorId}`
                              )
                            }
                            title="Editar vendedor"
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
      <DialogVendedorDetails
        isOpen={!!selectedVendedor}
        vendedor={selectedVendedor}
        onClose={() => setSelectedVendedor(null)}
      />
    </div>
  );
};

export default ViewVendedoresPage;






