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
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";
import { useState, useEffect } from "react";
import departamentosData from "./ubigeo/departamentos.json";
import provinciasData from "./ubigeo/provincias.json";
import distritosData from "./ubigeo/distritos.json";

interface Ubigeo {
  id_ubigeo: string;
  nombre_ubigeo: string;
  id_padre_ubigeo: string;
}

interface Vendedor {
  vendedorId: number;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  estadoRegistro: boolean;
}

interface ClienteFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  vendedores: Vendedor[];
  submitButtonText?: string;
  onCancel: () => void;
}

export const ClienteForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  vendedores,
  submitButtonText = "Crear Cliente",
  onCancel,
}: ClienteFormProps<T>) => {
  const [departamentos] = useState<Ubigeo[]>(departamentosData);
  const [provincias, setProvincias] = useState<Ubigeo[]>([]);
  const [distritos, setDistritos] = useState<Ubigeo[]>([]);
  const [selectedDepartamentoId, setSelectedDepartamentoId] = useState<
    string | null
  >(null);
  const [selectedProvinciaId, setSelectedProvinciaId] = useState<string | null>(
    null
  );

  // Inicializar con valores existentes (para edición)
  useEffect(() => {
    const departamentoValue = form.getValues("departamento" as Path<T>);
    const provinciaValue = form.getValues("provincia" as Path<T>);

    if (departamentoValue) {
      const dep = departamentos.find(
        (d) => d.nombre_ubigeo === departamentoValue
      );
      if (dep) {
        setSelectedDepartamentoId(dep.id_ubigeo);
        const provinciasDelDepartamento =
          provinciasData[dep.id_ubigeo as keyof typeof provinciasData] || [];
        setProvincias(provinciasDelDepartamento);

        if (provinciaValue) {
          const prov = provinciasDelDepartamento.find(
            (p) => p.nombre_ubigeo === provinciaValue
          );
          if (prov) {
            setSelectedProvinciaId(prov.id_ubigeo);
            const distritosDelaProvincia =
              distritosData[prov.id_ubigeo as keyof typeof distritosData] || [];
            setDistritos(distritosDelaProvincia);
          }
        }
      }
    }
  }, [departamentos, form]);

  // Cuando se selecciona un departamento, cargar sus provincias
  useEffect(() => {
    if (selectedDepartamentoId) {
      const provinciasDelDepartamento =
        provinciasData[selectedDepartamentoId as keyof typeof provinciasData] ||
        [];
      setProvincias(provinciasDelDepartamento);
      setDistritos([]); // Reset distritos

      // Solo resetear si estamos cambiando el departamento manualmente
      const currentDepartamento = form.getValues("departamento" as Path<T>);
      const dep = departamentos.find(
        (d) => d.id_ubigeo === selectedDepartamentoId
      );
      if (dep && dep.nombre_ubigeo !== currentDepartamento) {
        form.setValue("provincia" as Path<T>, "" as any);
        form.setValue("distrito" as Path<T>, "" as any);
      }
    } else {
      setProvincias([]);
      setDistritos([]);
    }
  }, [selectedDepartamentoId]);

  // Cuando se selecciona una provincia, cargar sus distritos
  useEffect(() => {
    if (selectedProvinciaId) {
      const distritosDelaProvincia =
        distritosData[selectedProvinciaId as keyof typeof distritosData] || [];
      setDistritos(distritosDelaProvincia);

      // Solo resetear si estamos cambiando la provincia manualmente
      const currentProvincia = form.getValues("provincia" as Path<T>);
      const prov = provincias.find((p) => p.id_ubigeo === selectedProvinciaId);
      if (prov && prov.nombre_ubigeo !== currentProvincia) {
        form.setValue("distrito" as Path<T>, "" as any);
      }
    } else {
      setDistritos([]);
    }
  }, [selectedProvinciaId]);

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

          {/* Vendedor */}
          <FormField
            control={form.control}
            name={"vendedorId" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendedor Asignado*</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(parseInt(value))}
                  value={field.value?.toString()}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un vendedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {vendedores.map((vendedor) => (
                      <SelectItem
                        key={vendedor.vendedorId}
                        value={vendedor.vendedorId.toString()}
                      >
                        {vendedor.nombres} {vendedor.apellidoPaterno}{" "}
                        {vendedor.apellidoMaterno}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UBIGEO: Departamento */}
          <FormField
            control={form.control}
            name={"departamento" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento*</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selected = departamentos.find(
                      (d) => d.nombre_ubigeo === value
                    );
                    setSelectedDepartamentoId(selected?.id_ubigeo || null);
                  }}
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un departamento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {departamentos.map((dep) => (
                      <SelectItem key={dep.id_ubigeo} value={dep.nombre_ubigeo}>
                        {dep.nombre_ubigeo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UBIGEO: Provincia */}
          <FormField
            control={form.control}
            name={"provincia" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Provincia*</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    const selected = provincias.find(
                      (p) => p.nombre_ubigeo === value
                    );
                    setSelectedProvinciaId(selected?.id_ubigeo || null);
                  }}
                  value={field.value}
                  disabled={!selectedDepartamentoId}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una provincia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {provincias.map((prov) => (
                      <SelectItem
                        key={prov.id_ubigeo}
                        value={prov.nombre_ubigeo}
                      >
                        {prov.nombre_ubigeo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* UBIGEO: Distrito */}
          <FormField
            control={form.control}
            name={"distrito" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito*</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedProvinciaId}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un distrito" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {distritos.map((dist) => (
                      <SelectItem
                        key={dist.id_ubigeo}
                        value={dist.nombre_ubigeo}
                      >
                        {dist.nombre_ubigeo}
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
            className="hover:cursor-pointer"
            variant="outline"
            onClick={onCancel}
            disabled={isSubmitting}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 text-white hover:cursor-pointer"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSubmitting ? "Guardando..." : submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};
