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

// Se asume que la interfaz Marca se exportará desde el AuthContext
import type { Marca } from "../../../context/auth-context";

interface DialogMarcaDetailsProps {
  marca: Marca | null; // La marca a mostrar, o null si no hay ninguna seleccionada
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

export const DialogMarcaDetails = ({
  marca,
  isOpen,
  onClose,
}: DialogMarcaDetailsProps) => {
  // Si no hay una marca seleccionada, no renderizamos nada.
  if (!marca) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles de la Marca
          </DialogTitle>
          <DialogDescription>
            Información completa de la marca seleccionada.
          </DialogDescription>
        </DialogHeader>

        {/* Cuerpo del Dialog con layout simple */}
        <div className="grid grid-cols-1 gap-6 py-4">
          <DetailItem label="ID de Marca" value={marca.marcaId} />
          <DetailItem label="Nombre" value={marca.nombre} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  marca.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {marca.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Fecha de Creación"
            value={new Date(marca.fechaCreacion).toLocaleString()}
          />
          <DetailItem
            label="Fecha de Modificación"
            value={new Date(marca.fechaModificacion).toLocaleString()}
          />
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
