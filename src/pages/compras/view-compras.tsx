import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  EyeIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
} from "@heroicons/react/24/outline";
import { type ICompra } from "@/components/compras/compra-schema";
import { useRefresh } from "../../hooks/use-refresh";
import { CompraActions } from "@/components/compras/view-compras.tsx/compra-actions";
import { DialogCompraDetails } from "@/components/compras/view-compras.tsx/dialog-details-compra";

const ViewComprasPage = () => {
  const [selectedCompra, setSelectedCompra] = useState<ICompra | null>(null);
  const navigate = useNavigate();

  const {
    data: compras,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<ICompra>("/compras");

  const [searchTerm, setSearchTerm] = useState("");

  const handleCompraStatusChange = (compraId: number, newEstado: string) => {
    updateItem((currentCompras) =>
      currentCompras.map((compra) =>
        compra.compraId === compraId
          ? { ...compra, estadoCompra: newEstado as any }
          : compra
      )
    );
  };

  const filteredCompras = (compras || []).filter((compra) => {
    const term = searchTerm.toLowerCase();
    const proveedor = compra.proveedor.nombreEmpresa.toLowerCase();
    const compraId = compra.compraId.toString();

    return proveedor.includes(term) || compraId.includes(term);
  });

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "BORRADOR":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
            <div className="w-1.5 h-1.5 rounded-full bg-gray-500" />
            Borrador
          </span>
        );
      case "ORDENADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
            <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            Ordenado
          </span>
        );
      case "EN_TRANSITO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
            <div className="w-1.5 h-1.5 rounded-full bg-yellow-500" />
            En Tránsito
          </span>
        );
      case "COMPLETADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            Completado
          </span>
        );
      case "CANCELADO":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800">
            <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
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
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Compras" />
      <div className="content-wrap">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todas las Compras
          </h2>
        </div>

        <div className="panel-card content-main-card">
          <div className="table-toolbar border-b border-slate-200/70 p-4">
            <div className="table-toolbar-search">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por Proveedor o N° Compra..."
                className="table-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Link
              to="/compras/registrar"
              className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
            >
              <PlusIcon className="w-5 h-5" />
              Nueva Compra
            </Link>
          </div>

          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando compras...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar las compras.
            </div>
          ) : (
            <div className="table-shell table-scroll">
              <table className="data-grid data-grid-responsive min-w-full">
                <thead>
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      N° Compra
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Proveedor
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Fecha Orden
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Fecha Estimada
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
                <tbody>
                  {filteredCompras.length === 0 ? (
                    <tr>
                      <td
                        colSpan={8}
                        className="px-6 py-10 text-center text-gray-500"
                      >
                        No se encontraron compras
                      </td>
                    </tr>
                  ) : (
                    filteredCompras.map((compra) => (
                        <tr key={compra.compraId} className="hover:bg-[color:var(--table-hover)]">
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                          #{compra.compraId.toString().padStart(4, "0")}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          <div className="font-medium">
                            {compra.proveedor.nombreEmpresa}
                          </div>
                          <div className="text-xs text-gray-500">
                            {compra.proveedor.contactoNombre}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {new Date(compra.fechaOrden).toLocaleDateString(
                            "es-PE"
                          )}
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {compra.fechaLlegadaEstimada
                            ? new Date(
                                compra.fechaLlegadaEstimada
                              ).toLocaleDateString("es-PE")
                            : "Sin definir"}
                        </td>
                        <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                          {formatCurrency(compra.totalCompra)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {getEstadoBadge(compra.estadoCompra)}
                        </td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() =>
                              window.open(
                                `http://localhost:6040${compra.urlPdf}`,
                                "_blank"
                              )
                            }
                            disabled={
                              compra.estadoCompra === "BORRADOR" ||
                              !compra.urlPdf
                            }
                            className={`p-2 rounded-lg transition ${
                              compra.estadoCompra !== "BORRADOR" &&
                              compra.urlPdf
                                ? "text-red-600 hover:text-red-700 hover:bg-red-50"
                                : "text-gray-300 cursor-not-allowed"
                            }`}
                            title={
                              compra.estadoCompra !== "BORRADOR" &&
                              compra.urlPdf
                                ? "Ver PDF de Orden de Compra"
                                : "PDF disponible al confirmar la orden"
                            }
                          >
                            <DocumentTextIcon className="w-5 h-5" />
                          </button>
                        </td>
                        <td className="px-6 py-4 align-middle">
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => setSelectedCompra(compra)}
                              className="p-2 text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                              title="Ver detalles"
                            >
                              <EyeIcon className="w-5 h-5" />
                            </button>

                            <CompraActions
                              compra={compra}
                              onStatusChange={handleCompraStatusChange}
                              onNavigateEdit={() =>
                                navigate(`/compras/editar/${compra.compraId}`)
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

      <DialogCompraDetails
        compra={selectedCompra}
        open={!!selectedCompra}
        onOpenChange={(open) => !open && setSelectedCompra(null)}
      />
    </div>
  );
};

export default ViewComprasPage;





