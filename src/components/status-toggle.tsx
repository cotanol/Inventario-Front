import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import useFetchApi from "../hooks/use-fetch"; // <-- 1. Importar tu hook

interface StatusToggleProps {
  userId: number;
  initialStatus: boolean;
  onStatusChange: (userId: number, newStatus: boolean) => void;
}

export function StatusToggle({
  userId,
  initialStatus,
  onStatusChange,
}: StatusToggleProps) {
  const [status, setStatus] = useState(initialStatus);
  const [isLoading, setIsLoading] = useState(false);
  const { patch } = useFetchApi(); // <-- 2. Obtener el método 'patch' del hook

  const handleToggle = async (newStatus: boolean) => {
    setIsLoading(true);
    setStatus(newStatus); // UI optimista

    try {
      await patch(`/auth/change-status/${userId}`, {
        estadoRegistro: newStatus,
      });

      // La API respondió con éxito, notificamos al padre
      onStatusChange(userId, newStatus);
      // toast.success('Estado actualizado');
    } catch (error) {
      console.error(error);
      // Si hay un error, revertimos el estado visual
      setStatus(!newStatus);
      // toast.error('No se pudo actualizar');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Switch
      checked={status}
      onCheckedChange={handleToggle}
      disabled={isLoading}
      aria-label="Cambiar estado del usuario"
    />
  );
}
