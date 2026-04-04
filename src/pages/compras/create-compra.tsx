import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  compraFormSchema,
  type CompraFormValues,
} from "@/components/compras/compra-schema";
import { CompraForm } from "@/components/compras/compra-form";
import { getApiErrorMessage } from "@/lib/api-error";

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

const CreateCompraPage = () => {
  const { post, get } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [proveedores, setProveedores] = useState<Proveedor[]>([]);
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);

  const form = useForm<CompraFormValues>({
    resolver: zodResolver(compraFormSchema),
    mode: "onChange",
    defaultValues: {
      proveedorId: 0,
      fechaOrden: new Date().toISOString().slice(0, 16),
      fechaLlegadaEstimada: "",
      detalles: [],
    },
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [proveedoresRes, productosRes] = await Promise.all([
          get<Proveedor[]>("/proveedores"),
          get<Producto[]>("/catalogo/productos"),
        ]);

        const proveedoresActivos = proveedoresRes.filter(
          (p) => p.estadoRegistro
        );
        const productosActivos = productosRes.filter((p) => p.estadoRegistro);

        setProveedores(proveedoresActivos);
        setProductos(productosActivos);
      } catch (err) {
        console.error("Error al cargar datos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [get]);

  async function onSubmit(values: CompraFormValues) {
    setApiError(null);

    const createCompraPromise = () =>
      post("/compras", {
        ...values,
        // Estado inicial siempre es BORRADOR
        estadoCompra: "BORRADOR",
      });

    toast.promise(createCompraPromise(), {
      loading: "Creando compra...",
      success: () => {
        form.reset();
        setTimeout(() => navigate("/compras"), 1000);
        return "¡Compra creada exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al crear la compra");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (loading) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Registrar Compra" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Compras" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Crear Nueva Compra
        </h2>
        <div className="form-shell">
          <CompraForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            proveedores={proveedores}
            productos={productos}
            submitButtonText="Crear Compra"
            onCancel={() => navigate("/compras")}
          />
        </div>
      </div>
    </div>
  );
};

export default CreateCompraPage;

