import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/header";
import {
  PlusIcon,
  EyeIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import type { Producto } from "@/context/auth-context";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRefresh } from "../../hooks/use-refresh";
import { StatusToggle } from "@/components/productos/status-toggle/status-toggle";
import { DialogProductoDetails } from "@/components/productos/dialog-details/dialog-producto-details";

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
    refresh,
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
        {/* Sub-encabezado */}
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-700">
            Todos los Productos
          </h2>
        </div>

        {/* Acciones principales */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="flex items-center gap-4">
            {/* Botón Agregar Producto */}
            <Link
              to="/productos/registrar"
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            >
              <PlusIcon className="w-5 h-5 mr-2" />
              Agregar Producto
            </Link>
          </div>
        </div>

        {/* Lista de productos */}
        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {isLoading ? (
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Cargando productos...</span>
            </div>
          ) : apiError ? (
            <div className="p-8 text-center">
              <p className="text-red-600 mb-4">{apiError}</p>
              <button
                onClick={refresh}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Reintentar
              </button>
            </div>
          ) : productos.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500 mb-4">No hay productos registrados</p>
              <Link
                to="/productos/registrar"
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <PlusIcon className="w-5 h-5 mr-2" />
                Crear primer producto
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Grupo</TableHead>
                    <TableHead>Línea</TableHead>
                    <TableHead>Marca</TableHead>
                    <TableHead>Precio</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-center">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {productos.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-4">
                        No se encontraron productos
                      </TableCell>
                    </TableRow>
                  ) : (
                    productos.map((producto) => (
                      <TableRow key={producto.productoId}>
                        <TableCell className="font-medium">
                          {producto.codigo}
                        </TableCell>
                        <TableCell>{producto.nombre}</TableCell>
                        <TableCell>{producto.grupo.nombre}</TableCell>
                        <TableCell>{producto.grupo.linea.nombre}</TableCell>
                        <TableCell>{producto.marca.nombre}</TableCell>
                        <TableCell>S/ {producto.precio.toFixed(2)}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              producto.estadoRegistro ? "default" : "secondary"
                            }
                          >
                            {producto.estadoRegistro ? "Activo" : "Inactivo"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center gap-2">
                            <button
                              onClick={() => handleViewDetails(producto)}
                              className="p-1 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-50"
                              title="Ver detalles"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                handleEditProducto(producto.productoId)
                              }
                              className="p-1 text-gray-500 hover:text-blue-600 rounded-md hover:bg-gray-50"
                              title="Editar"
                            >
                              <PencilSquareIcon className="h-4 w-4" />
                            </button>
                            <StatusToggle
                              productoId={producto.productoId}
                              initialStatus={producto.estadoRegistro}
                              onStatusChange={handleProductoStatusChange}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      {/* Modal de Detalles */}
      <DialogProductoDetails
        producto={selectedProducto}
        isOpen={isDetailsOpen}
        onClose={closeProductoDetails}
      />
    </div>
  );
};

export default ViewProductosPage;
