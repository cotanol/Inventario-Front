import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
import type { IPermiso } from "./perfil-schema";

interface PerfilFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  submitButtonText?: string;
  onCancel: () => void;
  permisosDisponibles: IPermiso[];
}

export const PerfilForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  submitButtonText = "Crear Perfil",
  onCancel,
  permisosDisponibles,
}: PerfilFormProps<T>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name={"nombre" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Perfil*</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Supervisor" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"descripcion" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descripción</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Describe el propósito de este perfil"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name={"permisosIds" as Path<T>} // El campo del formulario que guarda un array de números
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-base font-semibold">
                Permisos del Perfil*
              </FormLabel>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 p-4 border rounded-md max-h-72 overflow-y-auto">
                {permisosDisponibles.map((permiso) => (
                  <FormItem
                    key={permiso.permisoId}
                    className="flex flex-row items-center space-x-3 space-y-0"
                  >
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(permiso.permisoId)}
                        onCheckedChange={(checked) => {
                          const currentIds = field.value || [];
                          const newIds = checked
                            ? [...currentIds, permiso.permisoId]
                            : currentIds.filter(
                                (id: number) => id !== permiso.permisoId
                              );
                          field.onChange(newIds);
                        }}
                      />
                    </FormControl>
                    <FormLabel className="font-normal text-sm">
                      {permiso.nombre}
                    </FormLabel>
                  </FormItem>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-center gap-6 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Guardando..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
