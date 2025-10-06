import { useState, useEffect, useCallback } from "react";
import useFetchApi from "./use-fetch";

export interface UseRefreshOptions {
  autoRefreshOnMount?: boolean;
}

export function useRefresh<T>(
  endpoint: string,
  options: UseRefreshOptions = {}
) {
  const { autoRefreshOnMount = true } = options;

  const [data, setData] = useState<T[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { get } = useFetchApi();

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await get<T[]>(endpoint);
      setData(response);
    } catch (err: any) {
      console.error(`Error fetching data from ${endpoint}:`, err);
      setError(err?.response?.data?.message || "Error al cargar los datos");
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [endpoint, get]);

  // Auto-refresh al montar el componente
  useEffect(() => {
    if (autoRefreshOnMount) {
      fetchData();
    }
  }, [fetchData, autoRefreshOnMount]);

  // Función para refrescar manualmente
  const refresh = useCallback(() => {
    fetchData();
  }, [fetchData]);

  // Función para actualizar un elemento específico en la lista
  const updateItem = useCallback((updateFn: (items: T[]) => T[]) => {
    setData(updateFn);
  }, []);

  return {
    data,
    isLoading,
    error,
    refresh,
    updateItem,
    setData, // Para casos donde necesites setear data directamente
  };
}
