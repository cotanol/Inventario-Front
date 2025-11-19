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
import { Loader2, AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface Proveedor {
  proveedorId: number;
  nombreEmpresa: string;
  numeroIdentificacionFiscal: string;
  estadoRegistro: boolean;
}

interface Producto {
  productoId: number;
  codigo: string;
  nombre: string;
  precioVenta: number;
  costoReferencial: number | null;
  estadoRegistro: boolean;
}

interface CompraFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  proveedores: Proveedor[];
  productos: Producto[];
  submitButtonText?: string;
  onCancel: () => void;
  estadoCompra?: string; // Para deshabilitar campos en estado ORDENADO
}

export const CompraForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  proveedores,
  productos,
  submitButtonText = "Crear Compra",
  onCancel,
  estadoCompra,
}: CompraFormProps<T>) => {
  const detalles = form.watch("detalles" as Path<T>) as Array<{
    productoId: number;
    cantidadSolicitada: number;
    costoUnitario: number;
  }>;

  // Solo fecha estimada es editable en estado ORDENADO
  const isOrdenado = estadoCompra === "ORDENADO";
  const disableAllExceptFecha = isOrdenado;

  const addDetalle = () => {
    const currentDetalles = form.getValues("detalles" as Path<T>) as any[];
    form.setValue(
      "detalles" as Path<T>,
      [
        ...currentDetalles,
        { productoId: 0, cantidadSolicitada: 1, costoUnitario: 0 },
      ] as any
    );
  };

  const removeDetalle = (index: number) => {
    const currentDetalles = form.getValues("detalles" as Path<T>) as any[];
    form.setValue(
      "detalles" as Path<T>,
      currentDetalles.filter((_, i) => i !== index) as any
    );
  };

  const calculateSubtotal = (
    cantidadSolicitada: number,
    costoUnitario: number
  ): number => {
    if (cantidadSolicitada > 0 && costoUnitario > 0) {
      return cantidadSolicitada * costoUnitario;
    }
    return 0;
  };

  const calculateTotal = (): number => {
    if (!detalles || !Array.isArray(detalles)) return 0;
    return detalles.reduce((acc, detalle) => {
      return (
        acc +
        calculateSubtotal(detalle.cantidadSolicitada, detalle.costoUnitario)
      );
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  const getSuggestedCost = (productoId: number): number => {
    const producto = productos.find((p) => p.productoId === productoId);
    return producto?.costoReferencial || 0;
  };

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
          {/* Proveedor */}
          <FormField
            control={form.control}
            name={"proveedorId" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Proveedor *</FormLabel>
                <Select
                  onValueChange={(value) => field.onChange(Number(value))}
                  value={field.value?.toString()}
                  disabled={disableAllExceptFecha}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Seleccionar proveedor" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {proveedores.map((proveedor) => (
                      <SelectItem
                        key={proveedor.proveedorId}
                        value={proveedor.proveedorId.toString()}
                      >
                        {proveedor.nombreEmpresa} (
                        {proveedor.numeroIdentificacionFiscal})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha de Orden */}
          <FormField
            control={form.control}
            name={"fechaOrden" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha de Orden *</FormLabel>
                <FormControl>
                  <Input
                    type="datetime-local"
                    {...field}
                    disabled={disableAllExceptFecha}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Fecha Estimada de Llegada */}
          <FormField
            control={form.control}
            name={"fechaLlegadaEstimada" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Estimada de Llegada</FormLabel>
                <FormControl>
                  <Input type="datetime-local" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Detalles de la Compra */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Productos a Comprar</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={addDetalle}
              disabled={disableAllExceptFecha}
            >
              <PlusCircle className="w-4 h-4 mr-2" />
              Agregar Producto
            </Button>
          </div>

          {detalles && detalles.length > 0 ? (
            <div className="space-y-4">
              {detalles.map((_, index) => {
                const detalle = detalles[index];
                const producto = productos.find(
                  (p) => p.productoId === detalle.productoId
                );

                return (
                  <div
                    key={index}
                    className="p-4 border border-gray-200 rounded-lg space-y-4"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Producto */}
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.productoId` as Path<T>}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Producto</FormLabel>
                            <Select
                              onValueChange={(value) => {
                                field.onChange(Number(value));
                                // Auto-llenar costo sugerido
                                const suggested = getSuggestedCost(
                                  Number(value)
                                );
                                if (suggested > 0) {
                                  form.setValue(
                                    `detalles.${index}.costoUnitario` as Path<T>,
                                    suggested as any
                                  );
                                }
                              }}
                              value={field.value?.toString()}
                              disabled={disableAllExceptFecha}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Seleccionar" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {productos.map((prod) => (
                                  <SelectItem
                                    key={prod.productoId}
                                    value={prod.productoId.toString()}
                                  >
                                    {prod.nombre} ({prod.codigo})
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Cantidad Solicitada */}
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.cantidadSolicitada` as Path<T>}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cantidad</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                disabled={disableAllExceptFecha}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Costo Unitario */}
                      <FormField
                        control={form.control}
                        name={`detalles.${index}.costoUnitario` as Path<T>}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Costo Unit. (S/.)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="0"
                                step="0.01"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                disabled={disableAllExceptFecha}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Subtotal y Eliminar */}
                      <div className="flex flex-col justify-between">
                        <FormLabel>Subtotal</FormLabel>
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-lg font-semibold text-gray-800">
                            {formatCurrency(
                              calculateSubtotal(
                                detalle.cantidadSolicitada,
                                detalle.costoUnitario
                              )
                            )}
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeDetalle(index)}
                            disabled={disableAllExceptFecha}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    {producto && producto.costoReferencial && (
                      <p className="text-xs text-gray-500">
                        Costo referencial anterior:{" "}
                        {formatCurrency(producto.costoReferencial)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No hay productos agregados. Haz clic en "Agregar Producto".
            </div>
          )}
        </div>

        {/* Total */}
        <div className="flex justify-end">
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-sm text-gray-600">Total de Compra</p>
            <p className="text-2xl font-bold text-gray-900">
              {formatCurrency(calculateTotal())}
            </p>
          </div>
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
