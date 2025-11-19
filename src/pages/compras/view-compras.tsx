import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusCircleIcon,
  EyeIcon,
  PencilSquareIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { type ICompra } from "@/components/compras/compra-schema";
import { useRefresh } from "../../hooks/use-refresh";

const ViewComprasPage = () => {
  const navigate = useNavigate();

  const {
    data: compras,
    isLoading,
    error: apiError,
  } = useRefresh<ICompra>("/compras");

  const [searchTerm, setSearchTerm] = useState("");

  const filteredCompras = (compras || []).filter((compra) => {
    const term = searchTerm.toLowerCase();
    const proveedor = compra.proveedor.nombreEmpresa.toLowerCase();
    const estado = compra.estadoCompra.toLowerCase();

    return proveedor.includes(term) || estado.includes(term);
  });

  const getEstadoBadge = (estado: string) => {
    const colors = {
      BORRADOR: "bg-gray-100 text-gray-800",
      ORDENADO: "bg-blue-100 text-blue-800",
      EN_TRANSITO: "bg-yellow-100 text-yellow-800",
      COMPLETADO: "bg-green-100 text-green-800",
      CANCELADO: "bg-red-100 text-red-800",
    };
    return colors[estado as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  return (
    <div>
      <Header titulo="Compras" />
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todas las Compras
          </h2>
        </div>

        <div className="bg-white rounded-lg shadow-sm">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por proveedor, estado..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-secondary"
              />
            </div>
            <Link
              to="/compras/registrar"
              className="flex items-center gap-2 px-4 py-2 bg-secondary text-white rounded-lg hover:bg-blue-700 transition-all"
            >
              <PlusCircleIcon className="w-5 h-5" />
              Nueva Compra
            </Link>
          </div>

          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
            </div>
          ) : apiError ? (
            <div className="flex justify-center items-center h-64 text-red-600">
              Error al cargar compras
            </div>
          ) : filteredCompras.length === 0 ? (
            <div className="flex justify-center items-center h-64 text-gray-500">
              No se encontraron compras
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Proveedor
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha Orden
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Fecha Llegada Est.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Estado
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredCompras.map((compra) => (
                    <tr key={compra.compraId} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {compra.compraId}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {compra.proveedor.nombreEmpresa}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {new Date(compra.fechaOrden).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {compra.fechaLlegadaEstimada
                          ? new Date(
                              compra.fechaLlegadaEstimada
                            ).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        {formatCurrency(compra.totalCompra)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 text-xs font-semibold rounded-full ${getEstadoBadge(
                            compra.estadoCompra
                          )}`}
                        >
                          {compra.estadoCompra}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              navigate(`/compras/editar/${compra.compraId}`)
                            }
                            className="text-blue-600 hover:text-blue-900"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              navigate(`/compras/editar/${compra.compraId}`)
                            }
                            className="text-yellow-600 hover:text-yellow-900"
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
    </div>
  );
};

export default ViewComprasPage;
