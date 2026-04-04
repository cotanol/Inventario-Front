import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {  updateVendedorFormSchema,
  type UpdateVendedorFormData,
  type IVendedor,
} from "@/components/vendedores/vendedor-schema";
import { VendedorForm } from "@/components/vendedores/vendedor-form";
import { getApiErrorMessage } from "@/lib/api-error";

const EditVendedorPage = () => {
  const { id } = useParams<{ id: string }>();
  const { get, patch } = useFetchApi();
  const navigate = useNavigate();
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm<UpdateVendedorFormData>({
    resolver: zodResolver(updateVendedorFormSchema),
    mode: "onChange",
  });

  const { isSubmitting } = form.formState;

  const loadInitialData = useCallback(async () => {
    if (!id) return;
    setIsLoadingData(true);
    try {
      const vendedorData = await get<IVendedor>(`/vendedores/${id}`);
      form.reset(vendedorData);
    } catch (err) {
      setApiError("No se pudieron cargar los datos del vendedor.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function onSubmit(values: UpdateVendedorFormData) {
    if (!id) return;
    setApiError(null);

    const updateVendedorPromise = () => patch(`/vendedores/${id}`, values);

    toast.promise(updateVendedorPromise(), {
      loading: "Actualizando vendedor...",
      success: () => {
        setTimeout(() => navigate("/vendedores"), 1000);
        return "¡Vendedor actualizado exitosamente! 🎉";
      },
      error: (err) => {
        const message = getApiErrorMessage(err, "Error al actualizar el vendedor");
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (isLoadingData) {
    return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Vendedores" />
        <div className="content-wrap">Cargando datos del vendedor...</div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col min-h-full">
      <Header titulo="Vendedores" />
      <div className="content-wrap">
        <h2 className="mb-6 text-xl font-semibold text-slate-800">
          Editando Vendedor
        </h2>
        <div className="form-shell">
          <VendedorForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/vendedores")}
            submitButtonText="Actualizar Vendedor"
          />
        </div>
      </div>
    </div>
  );
};

export default EditVendedorPage;

