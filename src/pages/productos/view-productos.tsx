import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  // MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Producto } from "@/context/auth-context";
import { useRefresh } from "../../hooks/use-refresh";
import { StatusToggle } from "@/components/productos/view-productos/status-toggle";
import { DialogProductoDetails } from "@/components/productos/view-productos/dialog-details-producto";

const ViewProductosPage = () => {
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const navigate = useNavigate();

  // Usar el hook useRefresh para manejar los productos
  const {
    data: productos,
    isLoading,
    error: apiError,
    updateItem,
  } = useRefresh<Producto>("/catalogo/productos");

  const handleProductoStatusChange = (
    productoId: number,
    newStatus: boolean
  ) => {
    updateItem((currentProductos) =>
      currentProductos.map((producto) =>
        producto.productoId === productoId
          ? { ...producto, estadoRegistro: newStatus }
          : producto
      )
    );
  };

  const handleViewDetails = (producto: Producto) => {
    setSelectedProducto(producto);
    setIsDetailsOpen(true);
  };

  const closeProductoDetails = () => {
    setSelectedProducto(null);
    setIsDetailsOpen(false);
  };

  const handleEditProducto = (productoId: number) => {
    navigate(`/productos/editar/${productoId}`);
  };

  return (
    <div>
      <Header titulo="Productos" />

      <div className="p-6">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Productos
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
                to="/productos/registrar"
                className="inline-flex items-center gap-2 bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm"
              >
                <PlusIcon className="w-5 h-5" />
                Registrar Producto
              </Link>
            </div>
          </div>

          {/* Renderizado condicional de la tabla, carga o error */}
          {isLoading ? (
            <div className="text-center py-10 text-gray-500">
              Cargando productos...
            </div>
          ) : apiError ? (
            <div className="p-4 bg-red-50 text-red-700">
              Error al cargar los productos.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead className="border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Código
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Grupo
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Línea
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Marca
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Precio
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">
                      Stock
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
                  {productos.map((producto) => (
                    <tr
                      key={producto.productoId}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {producto.codigo}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {producto.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {producto.grupo.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {producto.grupo.linea.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {producto.marca.nombre}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        S/ {producto.precioVenta.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 text-sm font-medium">
                        <span
                          className={
                            producto.inventario.cantidadActual <=
                            producto.inventario.cantidadMinima
                              ? "text-red-600 font-bold"
                              : "text-gray-900"
                          }
                        >
                          {producto.inventario.cantidadActual}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {/* Aquí se renderiza el componente del toggle */}
                        <StatusToggle
                          productoId={producto.productoId}
                          initialStatus={producto.estadoRegistro}
                          onStatusChange={handleProductoStatusChange}
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            className="p-2 rounded-lg transition text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                            onClick={() => handleViewDetails(producto)}
                            title="Ver detalles del producto"
                          >
                            <EyeIcon className="w-5 h-5" />
                          </button>
                          <button
                            className="p-2 rounded-lg transition text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50"
                            onClick={() =>
                              handleEditProducto(producto.productoId)
                            }
                            title="Editar producto"
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

      {/* Diálogo para ver detalles del producto */}
      <DialogProductoDetails
        producto={selectedProducto}
        isOpen={isDetailsOpen}
        onClose={closeProductoDetails}
      />
    </div>
  );
};

export default ViewProductosPage;
