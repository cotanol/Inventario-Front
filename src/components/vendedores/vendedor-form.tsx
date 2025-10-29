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
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface VendedorFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  submitButtonText?: string;
  onCancel: () => void;
}

export const VendedorForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  submitButtonText = "Crear Vendedor",
  onCancel,
}: VendedorFormProps<T>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombres */}
          <FormField
            control={form.control}
            name={"nombres" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombres*</FormLabel>
                <FormControl>
                  <Input placeholder="Juan Carlos" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido Paterno */}
          <FormField
            control={form.control}
            name={"apellidoPaterno" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Paterno*</FormLabel>
                <FormControl>
                  <Input placeholder="Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Apellido Materno */}
          <FormField
            control={form.control}
            name={"apellidoMaterno" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido Materno*</FormLabel>
                <FormControl>
                  <Input placeholder="García" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* DNI */}
          <FormField
            control={form.control}
            name={"dni" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>DNI*</FormLabel>
                <FormControl>
                  <Input placeholder="12345678" maxLength={8} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Correo */}
          <FormField
            control={form.control}
            name={"correo" as Path<T>}
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Correo Electrónico*</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="vendedor@empresa.com"
                    {...field}
                  />
                </FormControl>
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
