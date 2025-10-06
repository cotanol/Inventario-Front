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
import { Badge } from "@/components/ui/badge";
import type { Producto } from "@/context/auth-context";

interface Props {
  producto: Producto | null;
  isOpen: boolean;
  onClose: () => void;
}

export function DialogProductoDetails({ producto, isOpen, onClose }: Props) {
  if (!producto) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Detalles del Producto</DialogTitle>
          <DialogDescription>
            Información completa del producto seleccionado
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Código</p>
            <p className="text-base font-semibold text-gray-800">
              {producto.codigo}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Nombre</p>
            <p className="text-base font-semibold text-gray-800">
              {producto.nombre}
            </p>
          </div>

          {producto.descripcion && (
            <div>
              <p className="text-sm font-medium text-gray-500">Descripción</p>
              <p className="text-base text-gray-800">{producto.descripcion}</p>
            </div>
          )}

          <div>
            <p className="text-sm font-medium text-gray-500">Precio</p>
            <p className="text-base font-semibold text-gray-800">
              S/ {producto.precio.toFixed(2)}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Grupo</p>
            <p className="text-base font-semibold text-gray-800">
              {producto.grupo.nombre}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Línea</p>
            <p className="text-base font-semibold text-gray-800">
              {producto.grupo.linea.nombre}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Marca</p>
            <p className="text-base font-semibold text-gray-800">
              {producto.marca.nombre}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-gray-500">Estado</p>
            <div className="mt-1">
              <Badge
                variant={producto.estadoRegistro ? "default" : "secondary"}
              >
                {producto.estadoRegistro ? "Activo" : "Inactivo"}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Fecha de Creación
              </p>
              <p className="text-base text-gray-800">
                {new Date(producto.fechaCreacion).toLocaleDateString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">
                Última Modificación
              </p>
              <p className="text-base text-gray-800">
                {new Date(producto.fechaModificacion).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cerrar</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
