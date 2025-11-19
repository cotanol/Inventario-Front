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
// import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle } from "lucide-react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface ProveedorFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  submitButtonText?: string;
  onCancel: () => void;
}

export const ProveedorForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  submitButtonText = "Crear Proveedor",
  onCancel,
}: ProveedorFormProps<T>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {apiError && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>{apiError}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre de la Empresa */}
          <FormField
            control={form.control}
            name={"nombreEmpresa" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de la Empresa *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: China Imports Ltd." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Número de Identificación Fiscal */}
          <FormField
            control={form.control}
            name={"numeroIdentificacionFiscal" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>RUC / Tax ID *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: 20123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nombre de Contacto */}
          <FormField
            control={form.control}
            name={"contactoNombre" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Juan Chen" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Teléfono */}
          <FormField
            control={form.control}
            name={"telefono" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: +86 123 456 7890" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Email */}
          <FormField
            control={form.control}
            name={"email" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Ej: contacto@proveedor.com"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* País */}
          <FormField
            control={form.control}
            name={"pais" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>País *</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: China" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Dirección */}
          <FormField
            control={form.control}
            name={"direccion" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: 123 Main St, Guangzhou, China"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Botones de Acción */}
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
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Guardando...
              </>
            ) : (
              submitButtonText
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
