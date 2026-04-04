import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  MagnifyingGlassIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Producto } from "@/components/productos/producto-types";
import { useRefresh } from "../../hooks/use-refresh";
import { CommonStatusToggle } from "@/components/common/status-toggle";
import { DialogProductoDetails } from "@/components/productos/view-productos/dialog-details-producto";

const ViewProductosPage = () => {
  const [selectedProducto, setSelectedProducto] = useState<Producto | null>(
    null
  );
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredProductos = productos.filter((producto) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) {
      return true;
    }

    return (
      producto.codigo.toLowerCase().includes(term) ||
      producto.nombre.toLowerCase().includes(term) ||
      producto.grupo.nombre.toLowerCase().includes(term) ||
      producto.grupo.linea.nombre.toLowerCase().includes(term) ||
      producto.marca.nombre.toLowerCase().includes(term)
    );
  });

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Productos" />

      <div className="content-wrap">
        {/* Sub-encabezado y Breadcrumbs */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Productos
          </h2>
        </div>

        {/* Contenedor principal blanco */}
        <div className="panel-card content-main-card">
          {/* Barra de controles: Búsqueda y Botones */}
          <div className="table-toolbar border-b border-slate-200/70 p-4">
            <div className="table-toolbar-search">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por codigo, nombre, grupo, linea o marca"
                className="table-search-input"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
              />
            </div>

            <div className="table-toolbar-action">
              <Link
                to="/productos/registrar"
                className="table-toolbar-button inline-flex shrink-0 items-center gap-2 whitespace-nowrap rounded-lg bg-[color:var(--accent-strong)] px-4 py-2 font-semibold text-white shadow-sm transition hover:brightness-110"
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
            <div className="table-shell table-scroll">
              <table className="data-grid data-grid-responsive min-w-full">
                <thead>
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
                  {filteredProductos.map((producto) => (
                    <tr
                      key={producto.productoId}
                      className="hover:bg-[color:var(--table-hover)]"
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
                        <CommonStatusToggle
                          entityId={producto.productoId}
                          endpoint={`/catalogo/productos/${producto.productoId}/change-status`}
                          initialStatus={producto.estadoRegistro}
                          onStatusChange={handleProductoStatusChange}
                          ariaLabel="Cambiar estado del producto"
                        />
                      </td>
                      <td className="px-6 py-4">
                        <div className="table-toolbar-action">
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






