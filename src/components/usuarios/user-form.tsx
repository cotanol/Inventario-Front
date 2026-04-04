// --- Shadcn UI & Lucide Icon Imports ---
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Loader2, AlertCircle } from "lucide-react";
import type { IRol } from "./user-schema";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface UserFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  roles: IRol[];
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel: () => void;
  isEditing?: boolean;
}

export const UserForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  roles,
  submitButtonText = "Crear Usuario",
  cancelButtonText = "Cancelar",
  onCancel,
  isEditing = false,
}: UserFormProps<T>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name={"nombre" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre*</FormLabel>
                <FormControl>
                  <Input placeholder="Juan" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"apellido" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido*</FormLabel>
                <FormControl>
                  <Input placeholder="Perez Gomez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"correoElectronico" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Correo Electrónico*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="john.doe@example.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {!isEditing && (
            <FormField
              control={form.control}
              name={"clave" as Path<T>}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Contraseña*</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="••••••••" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}

          <FormField
            control={form.control}
            name={"rolId" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Rol*</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un rol" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {roles
                      .filter((rol) => rol.estadoRegistro)
                      .map((rol) => (
                        <SelectItem
                          key={rol.rolId}
                          value={rol.rolId.toString()}
                        >
                          {rol.nombre}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
            className="bg-slate-100 hover:bg-slate-200"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelButtonText}
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
