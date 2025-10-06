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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { Loader2, AlertCircle } from "lucide-react";
import { UserProfileMultiSelect } from "./select-multiple-profiles";
import type { IPerfil } from "./user-schema";
import type { UseFormReturn } from "node_modules/react-hook-form/dist/types/form";
import type { FieldValues, Path } from "react-hook-form";

interface UserFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  perfiles: IPerfil[];
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
  perfiles,
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
            name={"nombres" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres*</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"apellidoPaterno" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Paterno*</FormLabel>
                <FormControl>
                  <Input placeholder="Doe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"apellidoMaterno" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Materno</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Smith"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"dni" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI*</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

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
            name={"clave" as Path<T>} // <-- CORRECCIÓN
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name={"celular" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Celular</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="987654321"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <UserProfileMultiSelect perfiles={perfiles} />
        </div>

        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
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
