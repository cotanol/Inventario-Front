import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { ProductoForm } from "@/components/productos/producto-form";
import {
  updateProductoFormSchema,
  type UpdateProductoFormData,
  type IGrupo,
  type IMarca,
} from "@/components/productos/producto-schema";
import type { Producto } from "@/context/auth-context";

const EditProductoPage = () => {
  const { id } = useParams<{ id: string }>();

  const { get, patch } = useFetchApi();
  const navigate = useNavigate();

  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [grupos, setGrupos] = useState<IGrupo[]>([]);
  const [marcas, setMarcas] = useState<IMarca[]>([]);

  const form = useForm<UpdateProductoFormData>({
    resolver: zodResolver(updateProductoFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  // --- LÓGICA DE CARGA DE DATOS ---
  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const [productoResponse, gruposResponse, marcasResponse] =
        await Promise.all([
          get<Producto>(`/catalogo/productos/${id}`),
          get<IGrupo[]>("/catalogo/grupos"),
          get<IMarca[]>("/catalogo/marcas"),
        ]);

      const marcasActivas = marcasResponse.filter(
        (marca) => marca.estadoRegistro
      );
      const gruposActivos = gruposResponse.filter(
        (grupo) => grupo.estadoRegistro
      );

      setGrupos(gruposActivos);
      setMarcas(marcasActivas);

      // Poblamos el formulario con los datos del producto
      form.reset({
        nombre: productoResponse.nombre,
        descripcion: productoResponse.descripcion || "",
        precioVenta: productoResponse.precioVenta,
        costoReferencial: productoResponse.costoReferencial || 0,
        grupoId: productoResponse.grupo.grupoId,
        marcaId: productoResponse.marca.marcaId,
        cantidadActual: productoResponse.inventario.cantidadActual,
        cantidadMinima: productoResponse.inventario.cantidadMinima,
      });
    } catch (err) {
      console.error("Error al cargar datos del producto:", err);
      setApiError("No se pudo cargar la información del producto.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  // Ejecutamos la carga cuando el componente se monta
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  // --- LÓGICA DE ACTUALIZACIÓN ---
  async function onSubmit(values: UpdateProductoFormData) {
    setApiError(null);

    const updateProductoPromise = () =>
      patch(`/catalogo/productos/${id}`, {
        nombre: values.nombre,
        descripcion: values.descripcion || null,
        precioVenta: values.precioVenta,
        costoReferencial: values.costoReferencial || 0,
        grupoId: values.grupoId,
        marcaId: values.marcaId,
        cantidadActual: values.cantidadActual,
        cantidadMinima: values.cantidadMinima,
      });

    toast.promise(updateProductoPromise(), {
      loading: "Actualizando producto...",
      success: () => {
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/productos"), 1000);
        return "¡Producto actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const errorMessage =
          err.response?.data?.message || "Error al actualizar el producto";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  // --- RENDERIZADO ---
  if (isLoadingData) {
    return (
      <div>
        <Header titulo="Productos" />
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">
                  Cargando producto...
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Productos" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Editando Producto
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
          <ProductoForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            grupos={grupos}
            marcas={marcas}
            onCancel={() => navigate("/productos")}
            submitButtonText="Actualizar Producto"
          />
        </div>
      </div>
    </div>
  );
};

export default EditProductoPage;
