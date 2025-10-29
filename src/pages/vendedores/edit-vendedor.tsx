import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import useFetchApi from "../../hooks/use-fetch";
import Header from "../../components/header";
import {
  updateVendedorFormSchema,
  type UpdateVendedorFormData,
  type IVendedor,
} from "@/components/vendedores/vendedor-schema";
import { VendedorForm } from "@/components/vendedores/vendedor-form";

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
        const errorMessage =
          err.response?.data?.message || "Error al actualizar el vendedor";
        const message = Array.isArray(errorMessage)
          ? errorMessage.join(", ")
          : errorMessage;
        setApiError(message);
        return `Error: ${message}`;
      },
    });
  }

  if (isLoadingData) {
    return (
      <div>
        <Header titulo="Vendedores" />
        <div className="p-6">Cargando datos del vendedor...</div>
      </div>
    );
  }

  return (
    <div>
      <Header titulo="Vendedores" />
      <div className="p-6">
        <h2 className="text-xl font-semibold text-gray-700 mb-6">
          Editando Vendedor
        </h2>
        <div className="bg-white py-12 px-40 rounded-lg shadow-md">
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
