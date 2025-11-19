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
import { ClienteStatusToggle } from "@/components/clientes/view-clientes.tsx/status-toggle";
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
    <div>
      <Header titulo="Clientes" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Clientes
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por Nombre o RUC..."
                className="pl-10 pr-4 py-2 w-72 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to="/clientes/registrar"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
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
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200">
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
                      className="border-b border-gray-200 hover:bg-gray-50"
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
                        <ClienteStatusToggle
                          clienteId={cliente.clienteId}
                          initialStatus={cliente.estadoRegistro}
                          onStatusChange={handleClienteStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
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
