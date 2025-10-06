import { useState } from "react";
import { Switch } from "../../ui/switch";
import useFetchApi from "../../../hooks/use-fetch";
import { toast } from "sonner";

interface StatusToggleProps {
  lineaId: number;
  initialStatus: boolean;
  onStatusChange: (lineaId: number, newStatus: boolean) => void;
}

export function StatusToggle({
  lineaId,
  initialStatus,
  onStatusChange,
}: StatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { patch } = useFetchApi(); // <-- 2. Obtener el método 'patch' del hook

  const handleToggle = async (newStatus: boolean) => {
    setIsLoading(true);
    setStatus(newStatus); // UI optimista

    const updateStatusPromise = () =>
      patch(`/catalogo/lineas/${lineaId}/change-status`, {
        estadoRegistro: newStatus,
      });

    try {
      await toast.promise(updateStatusPromise(), {
        loading: "Actualizando estado...",
        success: `Estado ${
          newStatus ? "activado" : "desactivado"
        } correctamente 🎉`,
        error: (err) => {
          const errorMessage =
            err.response?.data?.message || "Error al actualizar el estado";
          const message = Array.isArray(errorMessage)
            ? errorMessage.join(", ")
            : errorMessage;
          return `Error: ${message}`;
        },
      });

      // La API respondió con éxito, notificamos al padre
      onStatusChange(lineaId, newStatus);
    } catch (error) {
      // Si hay un error, revertimos el estado visual
      setStatus(!newStatus);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={status}
      onCheckedChange={handleToggle}
      disabled={isLoading}
      aria-label="Cambiar estado de la línea"
    />
  );
}
