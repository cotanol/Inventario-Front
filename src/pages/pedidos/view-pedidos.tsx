import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { type IPedido } from "@/components/pedidos/pedido-schema";

import { useRefresh } from "../../hooks/use-refresh";
import { PedidoActions } from "@/components/pedidos/view-pedidos.tsx/pedido-actions";
import { DialogPedidoDetails } from "@/components/pedidos/view-pedidos.tsx/dialog-details-pedido";

const ViewPedidosPage = () => {
  const [selectedPedido, setSelectedPedido] = useState<IPedido | null>(null);
  const navigate = useNavigate();

  const {
    data: pedidos,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<IPedido>("/pedidos");

  const [searchTerm, setSearchTerm] = useState("");

  const handlePedidoStatusChange = (pedidoId: number, newEstado: string) => {
    updateItem((currentPedidos) =>
      currentPedidos.map((pedido) =>
        pedido.pedidoId === pedidoId
          ? { ...pedido, estadoPedido: newEstado as any }
          : pedido
      )
    );
  };

  const filteredPedidos = (pedidos || []).filter((pedido) => {
    const term = searchTerm.toLowerCase();
    const clienteNombre = pedido.cliente.nombre.toLowerCase();
    const ruc = pedido.cliente.ruc.toLowerCase();
    const pedidoId = pedido.pedidoId.toString();

    return (
      clienteNombre.includes(term) ||
      ruc.includes(term) ||
      pedidoId.includes(term)
    );
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            Pendiente
          </span>
        );
      case "COMPLETADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <CheckCircleIcon className="w-4 h-4" />
            Completado
          </span>
        );
      case "CANCELADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <XCircleIcon className="w-4 h-4" />
            Cancelado
          </span>
        );
      default:
        return null;
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  return (
    <div>
      <Header titulo="Pedidos" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Pedidos
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por Cliente, RUC o N° Pedido..."
                className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to="/pedidos/registrar"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
            >
              <PlusIcon className="w-5 h-5" />
              Registrar Pedido
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando pedidos...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los pedidos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      N° Pedido
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Cliente
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Vendedor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Tipo Pago
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Total
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      PDF
                    </th>
                    <th className="px-6 py-4 text-center text-sm font-semibold text-gray-600">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredPedidos.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No se encontraron pedidos
                      </td>
                    </tr>
                  ) : (
                    filteredPedidos.map((pedido) => (
                      <tr
                        key={pedido.pedidoId}
                        className="hover:bg-gray-50 transition"
                      >
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{pedido.pedidoId.toString().padStart(4, "0")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-medium">
                            {pedido.cliente.nombre}
                          </div>
                          <div className="text-xs text-gray-500">
                            RUC: {pedido.cliente.ruc}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {pedido.vendedor.nombres}{" "}
                          {pedido.vendedor.apellidoPaterno}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <span
                            className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded ${
                              pedido.tipoPago === "CONTADO"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {pedido.tipoPago}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(pedido.totalFinal)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {getEstadoBadge(pedido.estadoPedido)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              window.open(
                                `http://localhost:6040${pedido.urlPdf}`,
                                "_blank"
                              )
                            }
                            disabled={
                              pedido.estadoPedido !== "COMPLETADO" ||
                              !pedido.urlPdf
                            }
                            className={`p-2 rounded-lg transition ${
                              pedido.estadoPedido === "COMPLETADO" &&
                              pedido.urlPdf
                                ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              pedido.estadoPedido === "COMPLETADO" &&
                              pedido.urlPdf
                                ? "Ver PDF"
                                : "PDF disponible solo para pedidos completados"
                            }
                          >
                            <DocumentTextIcon className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedPedido(pedido)}
                              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Ver detalles"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>

                            <PedidoActions
                              pedido={pedido}
                              onStatusChange={handlePedidoStatusChange}
                              onNavigateEdit={() =>
                                navigate(`/pedidos/editar/${pedido.pedidoId}`)
                              }
                            />
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <DialogPedidoDetails
        pedido={selectedPedido}
        open={!!selectedPedido}
        onOpenChange={(open) => !open && setSelectedPedido(null)}
      />
    </div>
  );
};

export default ViewPedidosPage;
