import { useState } from "react";
import { Switch } from "../../ui/switch";
import useFetchApi from "../../../hooks/use-fetch";
import { toast } from "sonner";

interface StatusToggleProps {
  perfilId: number;
  initialStatus: boolean;
  onStatusChange: (perfilId: number, newStatus: boolean) => void;
}

export function PerfilStatusToggle({
  perfilId,
  initialStatus,
  onStatusChange,
}: StatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { patch } = useFetchApi();

  const handleToggle = async (newStatus: boolean) => {
    setIsLoading(true);
    setStatus(newStatus); // UI optimista

    const updatePromise = () =>
      patch(`/auth/perfiles/${perfilId}/change-status`, {
        estadoRegistro: newStatus,
      });

    try {
      await toast.promise(updatePromise(), {
        loading: "Actualizando estado...",
        success: `Estado ${
          newStatus ? "activado" : "desactivado"
        } correctamente 🎉`,
        error: (err) =>
          `Error: ${err.response?.data?.message || "No se pudo actualizar"}`,
      });
      onStatusChange(perfilId, newStatus);
    } catch (error) {
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
      aria-label="Cambiar estado del perfil"
    />
  );
}
