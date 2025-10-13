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

interface ClienteFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  submitButtonText?: string;
  onCancel: () => void;
}

export const ClienteForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  submitButtonText = "Crear Cliente",
  onCancel,
}: ClienteFormProps<T>) => {
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Nombre, RUC, Dirección, Email, Teléfono, Clasificación, Departamento, Distrito */}
          <FormField
            control={form.control}
            name={"nombre" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>Nombre / Razón Social*</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Mi Empresa S.A.C." {...field} />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"ruc" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>RUC*</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="20123456789" {...field} />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"direccion" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>Dirección*</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Av. Principal 123" {...field} />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"email" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>Correo Electrónico*</FormLabel>{" "}
                <FormControl>
                  <Input
                    type="email"
                    placeholder="contacto@empresa.com"
                    {...field}
                  />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"telefono" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>Teléfono</FormLabel>{" "}
                <FormControl>
                  <Input
                    type="tel"
                    placeholder="987654321"
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"clasificacion" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>Clasificación*</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Mayorista" {...field} />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"departamento" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>Departamento*</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Lima" {...field} />
                </FormControl>{" "}
                <FormMessage />{" "}
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"distrito" as Path<T>}
            render={({ field }) => (
              <FormItem>
                {" "}
                <FormLabel>Distrito*</FormLabel>{" "}
                <FormControl>
                  <Input placeholder="Miraflores" {...field} />
                </FormControl>{" "}
                <FormMessage />{" "}
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
