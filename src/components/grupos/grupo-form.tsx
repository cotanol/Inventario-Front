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
import type { UseFormReturn } from "react-hook-form";
import type { FieldValues, Path } from "react-hook-form";
import type { ILinea } from "./grupo-schema";

interface GrupoFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel: () => void;
  lineas: ILinea[];
  isLoadingLineas: boolean;
}

export const GrupoForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  submitButtonText = "Crear Grupo",
  cancelButtonText = "Cancelar",
  onCancel,
  lineas,
  isLoadingLineas,
}: GrupoFormProps<T>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name={"nombre" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Grupo*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Zapatos, Camisas, Teléfonos..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"lineaId" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Línea*</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                  disabled={isLoadingLineas}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue
                        placeholder={
                          isLoadingLineas
                            ? "Cargando líneas..."
                            : "Selecciona una línea"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {lineas.map((linea) => (
                      <SelectItem
                        key={linea.lineaId}
                        value={linea.lineaId.toString()}
                      >
                        {linea.nombre}
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
            className="border-slate-300 text-slate-700 hover:bg-slate-100"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelButtonText}
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isLoadingLineas}
            className="bg-[color:var(--accent-strong)] text-white hover:brightness-110"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Guardando..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};



