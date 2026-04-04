import { useCallback } from "react";
import axiosInstance from "../services/api-client";
import type { AxiosRequestConfig } from "axios";
import type { ApiResponse } from "@/lib/types";

function unwrapResponse<T>(payload: unknown): T {
  if (
    typeof payload === "object" &&
    payload !== null &&
    "success" in payload &&
    "data" in payload
  ) {
    return (payload as ApiResponse<T>).data;
  }

  return payload as T;
}

export default function useFetchApi() {
  const get = useCallback(
    async <TResponse>(
      url: string,
      config?: AxiosRequestConfig
    ): Promise<TResponse> => {
      const res = await axiosInstance.get<unknown>(url, config);
      return unwrapResponse<TResponse>(res.data);
    },
    []
  );

  const post = useCallback(
    async <TResponse, TRequest>(
      url: string,
      data: TRequest,
      config?: AxiosRequestConfig
    ): Promise<TResponse> => {
      const res = await axiosInstance.post<unknown>(url, data, config);
      return unwrapResponse<TResponse>(res.data);
    },
    []
  );

  const put = useCallback(
    async <TResponse, TRequest>(
      url: string,
      data: TRequest,
      config?: AxiosRequestConfig
    ): Promise<TResponse> => {
      const res = await axiosInstance.put<unknown>(url, data, config);
      return unwrapResponse<TResponse>(res.data);
    },
    []
  );

  const patch = useCallback(
    async <TResponse, TRequest>(
      url: string,
      data: TRequest,
      config?: AxiosRequestConfig
    ): Promise<TResponse> => {
      const res = await axiosInstance.patch<unknown>(url, data, config);
      return unwrapResponse<TResponse>(res.data);
    },
    []
  );

  const del = useCallback(
    async <TResponse = void>( // El valor por defecto es `void` si no se espera contenido.
      url: string,
      config?: AxiosRequestConfig
    ): Promise<TResponse> => {
      const res = await axiosInstance.delete<unknown>(url, config);
      return unwrapResponse<TResponse>(res.data);
    },
    []
  );

  return { get, post, put, del, patch };
}
