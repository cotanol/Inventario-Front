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

// Se asume que la interfaz Grupo se exportará desde el AuthContext
import type { Grupo } from "../../../context/auth-context";

interface DialogGrupoDetailsProps {
  grupo: Grupo | null; // El grupo a mostrar, o null si no hay ninguno seleccionado
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

export const DialogGrupoDetails = ({
  grupo,
  isOpen,
  onClose,
}: DialogGrupoDetailsProps) => {
  // Si no hay un grupo seleccionado, no renderizamos nada.
  if (!grupo) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Detalles del Grupo
          </DialogTitle>
          <DialogDescription>
            Información completa del grupo seleccionado.
          </DialogDescription>
        </DialogHeader>

        {/* Cuerpo del Dialog con layout simple */}
        <div className="grid grid-cols-1 gap-6 py-4">
          <DetailItem label="ID de Grupo" value={grupo.grupoId} />
          <DetailItem label="Nombre" value={grupo.nombre} />
          <DetailItem label="Línea" value={grupo.linea.nombre} />
          <DetailItem
            label="Estado"
            value={
              <span
                className={
                  grupo.estadoRegistro ? "text-green-600" : "text-red-600"
                }
              >
                {grupo.estadoRegistro ? "Activo" : "Inactivo"}
              </span>
            }
          />
          <DetailItem
            label="Fecha de Creación"
            value={new Date(grupo.fechaCreacion).toLocaleString()}
          />
          <DetailItem
            label="Fecha de Modificación"
            value={new Date(grupo.fechaModificacion).toLocaleString()}
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
