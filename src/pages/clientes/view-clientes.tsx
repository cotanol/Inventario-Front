import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  UserPlusIcon,
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { type ICliente } from "@/components/clientes/cliente-schema";

import { useRefresh } from "../../hooks/use-refresh";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { DialogClienteDetails } from "@/components/clientes/view-clientes.tsx/dialog-details-cliente";

const ViewClientesPage = () => {
  const [selectedCliente, setSelectedCliente] = useState<ICliente | null>(null);
  const navigate = useNavigate();

  const {
    data: clientes,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<ICliente>("/clientes");

  const [searchTerm, setSearchTerm] = useState("");

  const handleClienteStatusChange = (clienteId: number, newStatus: boolean) => {
    updateItem((currentClientes) =>
      currentClientes.map((cliente) =>
        cliente.clienteId === clienteId
          ? { ...cliente, estadoRegistro: newStatus }
          : cliente
      )
    );
  };

  const filteredClientes = (clientes || []).filter((cliente) => {
    const term = searchTerm.toLowerCase();
    const nombre = cliente.nombre.toLowerCase();
    const ruc = cliente.ruc.toLowerCase();

    // Devuelve true si el término de búsqueda está incluido en el nombre O en el RUC
    return nombre.includes(term) || ruc.includes(term);
  });

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Clientes" />
      <div className="content-wrap">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Clientes
          </h2>
        </div>

        <div className="panel-card content-main-card">
          <div className="table-toolbar border-b border-slate-200/70 p-4">
            <div className="table-toolbar-search">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Nombre o RUC..."
                className="table-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to="/clientes/registrar"
              className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              <UserPlusIcon className="w-5 h-5" />
              Registrar Cliente
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando clientes...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los clientes.
            </div>
          ) : (
            <div className="table-shell table-scroll">
              <table className="data-grid data-grid-responsive min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Nombre / Razón Social
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      RUC
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Correo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Teléfono
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Clasificación
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
                  {filteredClientes.map((cliente) => (
                    <tr
                      key={cliente.clienteId}
                      className="hover:bg-[color:var(--table-hover)]"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {cliente.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {cliente.ruc}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {cliente.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {cliente.telefono || "-"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {cliente.clasificacion}
                      </td>
                      <td className="px-6 py-4">
                        <CommonStatusToggle
                          entityId={cliente.clienteId}
                          endpoint={`/clientes/${cliente.clienteId}/change-status`}
                          initialStatus={cliente.estadoRegistro}
                          onStatusChange={handleClienteStatusChange}
                          ariaLabel="Cambiar estado del cliente"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="table-toolbar-action">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => setSelectedCliente(cliente)}
                            title="Ver detalles del cliente"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              navigate(`/clientes/editar/${cliente.clienteId}`)
                            }
                            title="Editar cliente"
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
      <DialogClienteDetails
        isOpen={!!selectedCliente}
        cliente={selectedCliente}
        onClose={() => setSelectedCliente(null)}
      />
    </div>
  );
};

export default ViewClientesPage;






