import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import { ProductoForm } from "@/components/productos/producto-form";
import {
  productoFormSchema,
  type ProductoFormData,
  type IGrupo,
  type IMarca,
} from "@/components/productos/producto-schema";

const CreateProductoPage = () => {
  const { post, get } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [grupos, setGrupos] = useState<IGrupo[]>([]);
  const [marcas, setMarcas] = useState<IMarca[]>([]);
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
          get<IGrupo[]>("/catalogo/grupos"),
          get<IMarca[]>("/catalogo/marcas"),
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

    toast.promise(createProductoPromise(), {
      loading: "Creando producto...",
      success: () => {
        // Reseteamos el formulario
        form.reset();
        // Navegamos a la lista después de un pequeño delay para mostrar el toast
        setTimeout(() => navigate("/productos"), 1000);
        return "¡Producto creado exitosamente! 🎉";
      },
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
