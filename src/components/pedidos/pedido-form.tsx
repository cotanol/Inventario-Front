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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, AlertCircle, PlusCircle, Trash2 } from "lucide-react";
import type { UseFormReturn, FieldValues, Path } from "react-hook-form";

interface Cliente {
  clienteId: number;
  nombre: string;
  ruc: string;
  estadoRegistro: boolean;
  vendedorId: number;
  vendedor: {
    vendedorId: number;
    nombres: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
  };
}

interface Producto {
  productoId: number;
  codigo: string;
  nombre: string;
  precioVenta: number;
  estadoRegistro: boolean;
  inventario?: {
    cantidadActual: number;
  };
}

interface PedidoFormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (values: T) => void;
  isSubmitting: boolean;
  apiError: string | null;
  clientes: Cliente[];
  productos: Producto[];
  submitButtonText?: string;
  onCancel: () => void;
}

export const PedidoForm = <T extends FieldValues>({
  form,
  onSubmit,
  isSubmitting,
  apiError,
  clientes,
  productos,
  submitButtonText = "Crear Pedido",
  onCancel,
}: PedidoFormProps<T>) => {
  const detalles = form.watch("detalles" as Path<T>) as Array<{
    productoId: number;
    cantidad: number;
  }>;

  const addDetalle = () => {
    const currentDetalles = form.getValues("detalles" as Path<T>) as any[];
    form.setValue(
      "detalles" as Path<T>,
      [...currentDetalles, { productoId: 0, cantidad: 1 }] as any
    );
  };

  const removeDetalle = (index: number) => {
    const currentDetalles = form.getValues("detalles" as Path<T>) as any[];
    form.setValue(
      "detalles" as Path<T>,
      currentDetalles.filter((_, i) => i !== index) as any
    );
  };

  const calculateSubtotal = (productoId: number, cantidad: number): number => {
    const producto = productos.find((p) => p.productoId === productoId);
    if (producto && cantidad > 0) {
      return producto.precioVenta * cantidad;
    }
    return 0;
  };

  const calculateTotal = (): number => {
    if (!detalles || !Array.isArray(detalles)) return 0;
    return detalles.reduce((acc, detalle) => {
      return acc + calculateSubtotal(detalle.productoId, detalle.cantidad);
    }, 0);
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("es-PE", {
      style: "currency",
      currency: "PEN",
    }).format(value);
  };

  const getProductoStock = (productoId: number): number => {
    const producto = productos.find((p) => p.productoId === productoId);
    return producto?.inventario?.cantidadActual || 0;
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
          {/* Cliente */}
          <FormField
            control={form.control}
            name={"clienteId" as Path<T>}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente *</FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(Number(value));
                    // Cuando selecciona un cliente, también guardamos su vendedorId
                    const clienteSeleccionado = clientes.find(
                      (c) => c.clienteId === Number(value)
                    );
                    if (clienteSeleccionado) {
                      form.setValue(
                        "vendedorId" as Path<T>,
                        clienteSeleccionado.vendedorId as any
                      );
                    }
                  }}
                  value={field.value?.toString()}
                  disabled={isSubmitting}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona un cliente" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {clientes.map((cliente) => (
                      <SelectItem
                        key={cliente.clienteId}
                        value={cliente.clienteId.toString()}
                      >
                        {cliente.nombre} - {cliente.ruc}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Vendedor Asignado (solo lectura) */}
          <div className="space-y-2">
            <FormLabel>Vendedor Asignado</FormLabel>
            <div className="h-10 px-3 py-2 bg-gray-100 border rounded-md flex items-center text-sm text-gray-700">
              {(() => {
                const clienteId = form.watch("clienteId" as Path<T>);
                const cliente = clientes.find(
                  (c) => c.clienteId === Number(clienteId)
                );
                return cliente
                  ? `${cliente.vendedor.nombres} ${cliente.vendedor.apellidoPaterno} ${cliente.vendedor.apellidoMaterno}`
                  : "Selecciona un cliente primero";
              })()}
            </div>
          </div>
        </div>

        {/* Tipo de Pago */}
        <FormField
          control={form.control}
          name={"tipoPago" as Path<T>}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Tipo de Pago *</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  value={field.value}
                  className="flex space-x-4"
                  disabled={isSubmitting}
                >
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CONTADO" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Contado
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-2 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="CREDITO" />
                    </FormControl>
                    <FormLabel className="font-normal cursor-pointer">
                      Crédito
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Detalles del Pedido */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Productos del Pedido</h3>
            <Button
              type="button"
              onClick={addDetalle}
              variant="outline"
              size="sm"
              disabled={isSubmitting}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Agregar Producto
            </Button>
          </div>

          {(!detalles || detalles.length === 0) && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No hay productos agregados. Haz clic en "Agregar Producto" para
                comenzar.
              </AlertDescription>
            </Alert>
          )}

          {detalles &&
            detalles.map((_, index) => {
              const productoId = form.watch(
                `detalles.${index}.productoId` as Path<T>
              );
              const cantidad = form.watch(
                `detalles.${index}.cantidad` as Path<T>
              );
              const producto = productos.find(
                (p) => p.productoId === Number(productoId)
              );
              const subtotal = calculateSubtotal(
                Number(productoId),
                Number(cantidad)
              );
              const stock = getProductoStock(Number(productoId));

              return (
                <div
                  key={index}
                  className="border rounded-lg p-4 space-y-4 bg-gray-50"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium text-sm">
                      Producto #{index + 1}
                    </h4>
                    {detalles.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeDetalle(index)}
                        variant="ghost"
                        size="sm"
                        disabled={isSubmitting}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Producto */}
                    <FormField
                      control={form.control}
                      name={`detalles.${index}.productoId` as Path<T>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Producto *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(Number(value))
                            }
                            value={field.value?.toString()}
                            disabled={isSubmitting}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Selecciona" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {productos.map((prod) => (
                                <SelectItem
                                  key={prod.productoId}
                                  value={prod.productoId.toString()}
                                >
                                  {prod.codigo} - {prod.nombre} (Stock:{" "}
                                  {prod.inventario?.cantidadActual || 0})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Cantidad */}
                    <FormField
                      control={form.control}
                      name={`detalles.${index}.cantidad` as Path<T>}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cantidad *</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              max={stock}
                              placeholder="0"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          {producto && (
                            <p className="text-xs text-gray-500">
                              Stock disponible: {stock}
                            </p>
                          )}
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Precio y Subtotal (solo lectura) */}
                    <div className="space-y-2">
                      <FormLabel>Precio Unitario</FormLabel>
                      <div className="h-10 px-3 py-2 bg-gray-100 border rounded-md flex items-center">
                        {producto
                          ? formatCurrency(producto.precioVenta)
                          : "S/ 0.00"}
                      </div>
                      <FormLabel className="text-sm font-semibold">
                        Subtotal: {formatCurrency(subtotal)}
                      </FormLabel>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Totales */}
        {detalles && detalles.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-end">
              <div className="w-64 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal:</span>
                  <span className="font-semibold">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
                <div className="flex justify-between text-base font-bold border-t pt-2">
                  <span>Total:</span>
                  <span className="text-[color:var(--accent-strong)]">
                    {formatCurrency(calculateTotal())}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Botones */}
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
            className="bg-[color:var(--accent-strong)] text-white hover:brightness-110"
          >
            {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {submitButtonText}
          </Button>
        </div>
      </form>
    </Form>
  );
};



