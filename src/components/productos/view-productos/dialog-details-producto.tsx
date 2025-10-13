import React from "react";

// --- Shadcn UI Imports ---
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// Se asume que la interfaz Producto se exportará desde el AuthContext
import type { Producto } from "@/context/auth-context";

interface DialogProductoDetailsProps {
  producto: Producto | null; // El producto a mostrar, o null si no hay ninguno seleccionado
  isOpen: boolean; // Controla si el dialog está visible
  onClose: () => void; // Función para cerrar el dialog
}

const DetailItem = ({
  label,
  value,
}: {
  label: string;
  value: string | React.ReactNode;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-500">{label}</p>
    <p className="text-base font-semibold text-gray-800">{value || "N/A"}</p>
  </div>
);

export const DialogProductoDetails = ({
  producto,
  isOpen,
  onClose,
}: DialogProductoDetailsProps) => {
  // Si no hay un producto seleccionado, no renderizamos nada.
  if (!producto) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Producto
          </DialogTitle>
          <DialogDescription>
            Información completa del producto seleccionado.
          </DialogDescription>
        </DialogHeader>

        {/* Cuerpo del Dialog con layout de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <DetailItem label="ID de Producto" value={producto.productoId} />
          <DetailItem label="Código" value={producto.codigo} />
          <DetailItem label="Nombre" value={producto.nombre} />
          <DetailItem
            label="Precio"
            value={`S/ ${producto.precio.toFixed(2)}`}
          />
          <DetailItem label="Grupo" value={producto.grupo.nombre} />
          <DetailItem label="Línea" value={producto.grupo.linea.nombre} />
          <DetailItem label="Marca" value={producto.marca.nombre} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  producto.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {producto.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Fecha de Creación"
            value={new Date(producto.fechaCreacion).toLocaleString()}
          />
          <DetailItem
            label="Fecha de Modificación"
            value={new Date(producto.fechaModificacion).toLocaleString()}
          />

          {/* Descripción ocupa las 2 columnas completas */}
          {producto.descripcion && (
            <div className="col-span-2">
              <DetailItem label="Descripción" value={producto.descripcion} />
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cerrar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
