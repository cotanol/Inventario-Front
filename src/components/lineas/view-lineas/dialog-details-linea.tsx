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

// Se asume que la interfaz Linea se exportará desde el AuthContext
import type { Linea } from "../../../context/auth-context";

interface DialogLineaDetailsProps {
  linea: Linea | null; // La línea a mostrar, o null si no hay ninguna seleccionada
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

export const DialogLineaDetails = ({
  linea,
  isOpen,
  onClose,
}: DialogLineaDetailsProps) => {
  // Si no hay una línea seleccionada, no renderizamos nada.
  if (!linea) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles de la Línea
          </DialogTitle>
          <DialogDescription>
            Información completa de la línea seleccionada.
          </DialogDescription>
        </DialogHeader>

        {/* Cuerpo del Dialog con layout de 2 columnas */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
          <DetailItem label="ID de Línea" value={linea.lineaId} />
          <DetailItem label="Nombre" value={linea.nombre} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  linea.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {linea.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Fecha de Creación"
            value={new Date(linea.fechaCreacion).toLocaleString()}
          />
          <DetailItem
            label="Fecha de Modificación"
            value={new Date(linea.fechaModificacion).toLocaleString()}
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
