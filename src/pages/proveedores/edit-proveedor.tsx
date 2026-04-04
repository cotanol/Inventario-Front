import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  proveedorFormSchema,
  type ProveedorFormValues,
  type IProveedor,
} from "@/components/proveedores/proveedor-schema";
import { ProveedorForm } from "@/components/proveedores/proveedor-form";
import { getApiErrorMessage } from "@/lib/api-error";

const EditProveedorPage = () => {
  const { id } = useParams<{ id: string }>();
  const { get, patch } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ProveedorFormValues>({
    resolver: zodResolver(proveedorFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  useEffect(() => {
    const fetchProveedor = async () => {
      try {
        const proveedorResponse = await get<IProveedor>(`/proveedores/${id}`);

        form.reset({
          nombreEmpresa: proveedorResponse.nombreEmpresa,
          contactoNombre: proveedorResponse.contactoNombre || "",
          telefono: proveedorResponse.telefono || "",
          email: proveedorResponse.email || "",
          numeroIdentificacionFiscal:
            proveedorResponse.numeroIdentificacionFiscal,
          direccion: proveedorResponse.direccion || "",
          pais: proveedorResponse.pais,
        });
      } catch (err) {
        console.error("Error al cargar proveedor:", err);
        toast.error("Error al cargar los datos del proveedor");
      } finally {
        setLoading(false);
      }
    };

    fetchProveedor();
  }, [id, get, form]);

  async function onSubmit(values: ProveedorFormValues) {
    setApiError(null);

    const updateProveedorPromise = () => patch(`/proveedores/${id}`, values);

    toast.promise(updateProveedorPromise(), {
      loading: "Actualizando proveedor...",
      success: () => {
        setTimeout(() => navigate("/proveedores"), 1000);
        return "¡Proveedor actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al actualizar el proveedor");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (loading) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Editar Proveedor" />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-secondary"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Proveedores" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Editar Proveedor
        </h2>
        <div className="form-shell">
          <ProveedorForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            submitButtonText="Actualizar Proveedor"
            onCancel={() => navigate("/proveedores")}
          />
        </div>
      </div>
    </div>
  );
};

export default EditProveedorPage;

