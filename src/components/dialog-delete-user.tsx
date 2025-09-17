import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { TrashIcon } from "@heroicons/react/24/outline";
import useFetchApi from "../hooks/use-fetch"; // <-- 1. Importar tu hook

// Props que el componente necesita
interface DialogDeleteUserProps {
  userId: number;
  onDeleteSuccess: (userId: number) => void; // <-- 2. Función para notificar al padre
}

export function DialogDeleteUser({
  userId,
  onDeleteSuccess,
}: DialogDeleteUserProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { del } = useFetchApi(); // <-- 3. Obtener el método 'del' del hook

  const handleDelete = async () => {
    setIsLoading(true);
    try {
      // --- 4. Usar el hook para llamar al endpoint de borrado (soft delete) ---
      // Asumiendo que tu endpoint RESTful es DELETE /api/v1/auth/users/:id
      // Si usas 'delete-user/:id', ajústalo aquí.
      await del(`/auth/delete-user/${userId}`);

      // Notificamos al componente padre que la eliminación fue exitosa
      onDeleteSuccess(userId);
      // toast.success("Usuario eliminado correctamente.");
      setIsOpen(false); // Cerramos el diálogo
    } catch (error) {
      console.error("Error al eliminar el usuario:", error);
      // toast.error("No se pudo eliminar el usuario.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogTrigger asChild>
        {/* 5. Usamos el ícono de basura como disparador */}
        <button className="text-red-500 hover:text-red-700">
          <TrashIcon className="w-5 h-5" />
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          {/* 6. Textos ajustados */}
          <AlertDialogTitle>¿Estás absolutamente seguro?</AlertDialogTitle>
          <AlertDialogDescription>
            Esta acción no se puede deshacer. Esto eliminará el usuario de forma
            permanente.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700" // Estilo destructivo
          >
            {isLoading ? "Eliminando..." : "Sí, eliminar"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
