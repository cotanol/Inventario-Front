import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import * as z from "zod";
import useFetchApi from "@/hooks/use-fetch";
import Header from "@/components/header";
import { PerfilForm } from "@/components/perfiles/perfil-form";
import type { IPerfil, IOpcionMenu } from "@/components/perfiles/perfil-schema";

const formSchema = z.object({
  nombre: z.string().min(1, "El nombre es requerido."),
  descripcion: z.string().optional().nullable(),
  opcionesMenuIds: z
    .array(z.number())
    .min(1, "Debes seleccionar al menos un permiso."),
});

const EditPerfilPage = () => {
  const { id } = useParams<{ id: string }>();
  const { get, patch } = useFetchApi();
  const navigate = useNavigate();
  const [opcionesMenu, setOpcionesMenu] = useState<IOpcionMenu[]>([]);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(true);

  const form = useForm({ resolver: zodResolver(formSchema) });

  const loadInitialData = useCallback(async () => {
    if (!id) return;
    try {
      const [perfilData, opcionesData] = await Promise.all([
        get<IPerfil>(`/auth/perfiles/${id}`),
        get<IOpcionMenu[]>("/auth/opciones-menu"),
      ]);
      form.reset({
        nombre: perfilData.nombre,
        descripcion: perfilData.descripcion,
        opcionesMenuIds: perfilData.opcionesMenuLink.map(
          (link) => link.opcionMenuId
        ),
      });
      setOpcionesMenu(opcionesData);
    } catch (err) {
      setApiError("No se pudieron cargar los datos para editar.");
    } finally {
      setIsLoadingData(false);
    }
  }, [id, get, form]);

  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!id) return;
    const payload = {
      nombre: values.nombre,
      descripcion: values.descripcion,
      opcionesMenu: values.opcionesMenuIds.map((id, index) => ({
        opcionMenuId: id,
        orden: (index + 1) * 10,
      })),
    };
    toast.promise(patch(`/auth/perfiles/${id}`, payload), {
      loading: "Actualizando...",
      success: () => {
        setTimeout(() => navigate("/perfiles"), 1000);
        return "¡Perfil actualizado!";
      },
      error: (err) => {
        const msg = err.response?.data?.message || "Error al actualizar";
        setApiError(Array.isArray(msg) ? msg.join(", ") : msg);
        return `Error: ${msg}`;
      },
    });
  }

  if (isLoadingData)
    return (
      <div>
        <Header titulo="Perfiles" />
        <div className="p-6">Cargando...</div>
      </div>
    );

  return (
    <div>
      <Header titulo="Perfiles" />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-6">Editando Perfil</h2>
        <div className="bg-white py-12 px-20 rounded-lg shadow-md">
          <PerfilForm
            form={form}
            onSubmit={onSubmit}
            isSubmitting={form.formState.isSubmitting}
            apiError={apiError}
            onCancel={() => navigate("/perfiles")}
            submitButtonText="Actualizar Perfil"
            opcionesMenuDisponibles={opcionesMenu}
          />
        </div>
      </div>
    </div>
  );
};
export default EditPerfilPage;
