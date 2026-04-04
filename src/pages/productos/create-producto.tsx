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
import { getApiErrorMessage } from "@/lib/api-error";

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
      nombre: "",
      descripcion: "",
      precioVenta: 0.1,
      costoReferencial: 0,
      grupoId: undefined,
      marcaId: undefined,
      cantidadActual: 0,
      cantidadMinima: 0,
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [gruposResponse, marcasResponse] = await Promise.all([
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
        nombre: values.nombre,
        descripcion: values.descripcion || null,
        precioVenta: values.precioVenta,
        costoReferencial: values.costoReferencial || 0,
        grupoId: values.grupoId,
        marcaId: values.marcaId,
        cantidadActual: values.cantidadActual,
        cantidadMinima: values.cantidadMinima,
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
        const message = getApiErrorMessage(err, "Error al crear el producto");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (loading) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Productos" />
        <div className="content-wrap">
          <div className="form-shell">
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
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Productos" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Crear Nuevo Producto
        </h2>
        <div className="form-shell">
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

