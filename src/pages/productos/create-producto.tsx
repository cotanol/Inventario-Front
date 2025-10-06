import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { ProductoForm } from "@/components/productos/create-producto";
import type { Grupo, Marca } from "@/context/auth-context";

const productoFormSchema = z.object({
  codigo: z
    .string()
    .min(1, "El código es requerido.")
    .max(20, "El código no puede exceder 20 caracteres."),
  nombre: z
    .string()
    .min(1, "El nombre es requerido.")
    .max(100, "El nombre no puede exceder 100 caracteres."),
  descripcion: z
    .string()
    .max(500, "La descripción no puede exceder 500 caracteres.")
    .optional()
    .or(z.literal("")),
  precio: z
    .number()
    .min(0.01, "El precio debe ser mayor a 0.")
    .max(99999999.99, "El precio es demasiado alto."),
  grupoId: z.number().min(1, "Debe seleccionar un grupo."),
  marcaId: z.number().min(1, "Debe seleccionar una marca."),
});

export type ProductoFormData = z.infer<typeof productoFormSchema>;

const CreateProductoPage = () => {
  const { post, get } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [grupos, setGrupos] = useState<Grupo[]>([]);
  const [marcas, setMarcas] = useState<Marca[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProductoFormData>({
    resolver: zodResolver(productoFormSchema),
    mode: "onChange",
    defaultValues: {
      codigo: "",
      nombre: "",
      descripcion: "",
      precio: 0,
      grupoId: 0,
      marcaId: 0,
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gruposData, marcasData] = await Promise.all([
          get<Grupo[]>("/catalogo/grupos"),
          get<Marca[]>("/catalogo/marcas"),
        ]);
        setGrupos(gruposData);
        setMarcas(marcasData);
      } catch (err) {
        console.error("Error al cargar datos:", err);
        setApiError("Error al cargar los datos necesarios");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get]);

  async function onSubmit(values: ProductoFormData) {
    setApiError(null);

    const createProductoPromise = () =>
      post("/catalogo/productos", {
        codigo: values.codigo,
        nombre: values.nombre,
        descripcion: values.descripcion || null,
        precio: values.precio,
        grupoId: values.grupoId,
        marcaId: values.marcaId,
      });

    try {
      await toast.promise(createProductoPromise(), {
        loading: "Creando producto...",
        success: `Producto ${values.nombre} creado exitosamente 🎉`,
        error: (err) => {
          const errorMessage =
            err.response?.data?.message || "Error al crear el producto";
          const message = Array.isArray(errorMessage)
            ? errorMessage.join(", ")
            : errorMessage;
          setApiError(message);
          return `Error: ${message}`;
        },
      });
      form.reset();
      navigate("/productos");
    } catch (error) {
      // El error ya fue manejado en el toast
    }
  }

  if (loading) {
    return (
      <div>
        <Header titulo="Productos" />
        <div className="p-6">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="mt-2 text-muted-foreground">Cargando datos...</p>
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
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-700 mb-6">
            Crear Nuevo Producto
          </h2>
          <ProductoForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            grupos={grupos}
            marcas={marcas}
            onCancel={() => navigate("/productos")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateProductoPage;