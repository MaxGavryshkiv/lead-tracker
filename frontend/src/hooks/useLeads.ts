import { useState, useEffect, useRef, useCallback } from "react";
import $api from "@/api/axios";
import { LeadsResponse } from "@/types/lead.types";
import axios, { AxiosError } from "axios";

export const useLeads = (initialPage = 1, limit = 10) => {
  const [data, setData] = useState<LeadsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(initialPage);

  const [status, setStatus] = useState<string>("");
  const [search, setSearch] = useState<string>("");

  const [sort, setSort] = useState<string>("createdAt");
  const [order, setOrder] = useState<"asc" | "desc">("desc");

  // Використовуємо useRef для зберігання AbortController, щоб мати до нього доступ
  const abortControllerRef = useRef<AbortController | null>(null);

  const fetchLeads = useCallback(async () => {
    // Скасовуємо попередній запит, якщо він ще триває
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      setLoading(true);

      const response = await $api.get<LeadsResponse>("/leads", {
        params: {
          page,
          limit,
          status: status || undefined,
          q: search || undefined,
          sort,
          order,
        },
        signal: controller.signal,
      });

      setData(response.data);
      setError(null);
    } catch (err) {
      if (axios.isCancel(err)) return;

      if (err instanceof AxiosError) {
        setError(
          (err.response?.data as { message?: string })?.message ?? err.message,
        );
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Не вдалося завантажити лідів");
      }
    } finally {
      setLoading(false);
    }
  }, [page, limit, status, search, order, sort]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchLeads();

    return () => abortControllerRef.current?.abort();
  }, [fetchLeads]);

  return {
    leads: data?.items ?? [],
    meta: {
      total: data?.total ?? 0,
      page: data?.page ?? 1,
      lastPage: data?.lastPage ?? 1,
    },
    loading,
    error,
    setPage,
    status,
    setStatus,
    search,
    setSearch,
    sort,
    setSort,
    order,
    setOrder,
    refresh: fetchLeads,
  };
};
