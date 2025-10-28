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
import { Textarea } from "@/components/ui/textarea";
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
import type { IGrupo, IMarca } from "./producto-schema";

interface ProductoFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  grupos: IGrupo[];
  marcas: IMarca[];
  submitButtonText?: string;
  cancelButtonText?: string;
  onCancel: () => void;
}

export const ProductoForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  grupos,
  marcas,
  submitButtonText = "Crear Producto",
  cancelButtonText = "Cancelar",
  onCancel,
}: ProductoFormProps<T>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {/* Primera fila: Código y Nombre */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* <FormField
            control={form.control}
            name={"codigo" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código del Producto*</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: PRD001, ABC123..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <FormField
            control={form.control}
            name={"nombre" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Producto*</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Laptop HP, Monitor Samsung..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"precio" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (S/) *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    {...field}
                    onChange={(e) =>
                      field.onChange(parseFloat(e.target.value) || 0)
                    }
                    value={field.value?.toString() || ""}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"grupoId" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Grupo*</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() || ""}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un grupo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {grupos.map((grupo) => (
                      <SelectItem
                        key={grupo.grupoId}
                        value={grupo.grupoId.toString()}
                      >
                        {grupo.nombre} ({grupo.linea.nombre})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"marcaId" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marca*</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString() || ""}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una marca" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {marcas.map((marca) => (
                      <SelectItem
                        key={marca.marcaId}
                        value={marca.marcaId.toString()}
                      >
                        {marca.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* --- NUEVOS CAMPOS DE INVENTARIO --- */}
          <FormField
            control={form.control}
            name={"cantidadActual" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad Actual (Stock)*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    step="1" // Ideal para enteros
                    {...field}
                    // --- LÓGICA IMITADA DE PRECIO ---
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10) || 0)
                    }
                    value={field.value?.toString() || ""}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name={"cantidadMinima" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock Mínimo*</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    step="1" // Ideal para enteros
                    {...field}
                    // --- LÓGICA LIMITADA DE PRECIO ---
                    onChange={(e) =>
                      field.onChange(parseInt(e.target.value, 10) || 0)
                    }
                    value={field.value?.toString() || ""}
                    disabled={isSubmitting}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Descripción */}
        <FormField
          control={form.control}
          name={"descripcion" as Path<T>}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción detallada del producto (opcional)"
                  rows={4}
                  {...field}
                  disabled={isSubmitting}
                />
              </FormControl>
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
