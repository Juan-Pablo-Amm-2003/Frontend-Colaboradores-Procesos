// src/services/api.ts
import axios from "axios";
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: Number(import.meta.env.VITE_API_TIMEOUT) || 15000,
});

api.interceptors.request.use((config) => {
  console.log(`[HTTP] ${config.method?.toUpperCase()} ${config.url}`);
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status;
    const url = err.config?.url;
    console.error(`[HTTP ERROR] ${status ?? "?"} en ${url}`, err.response?.data || err.message);
    return Promise.reject(err);
  }
);

const toCSV = (v: unknown) => {
  if (v == null) return undefined;
  if (Array.isArray(v)) return v.filter(Boolean).join(",");
  return v;
};

export const uploadTareas = async (file: File, onProgress?: (pct: number) => void) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await api.post("/upload-tareas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (e) => {
      if (!onProgress || !e.total) return;
      onProgress(Math.round((e.loaded * 100) / e.total));
    },
  });

  return res.data;
};

export const getTareasFiltradas = async (filtros: any = {}) => {
  const params = {
    estado: toCSV(filtros.estado),
    prioridad: toCSV(filtros.prioridad),
    colaborador: toCSV(filtros.colaborador),
    tablero: filtros.tablero,
    desde: filtros.desde,
    hasta: filtros.hasta,
    q: filtros.q,
    order_by: filtros.order_by ?? "fecha_creacion",
    order_dir: filtros.order_dir ?? "desc",
    limit: filtros.limit ?? 100,
    offset: filtros.offset ?? 0,
    vencida: filtros.vencida,
    vencimiento_desde: filtros.vencimiento_desde,
    vencimiento_hasta: filtros.vencimiento_hasta,
    finalizacion_desde: filtros.finalizacion_desde,
    finalizacion_hasta: filtros.finalizacion_hasta,
  };

  const res = await api.get("/tareas-filtradas", { params });
  const total = Number(res.headers["x-total-count"] ?? res.data?.total ?? 0);
  const tareas = res.data?.data ?? [];

  return { tareas, total };
};

export const getTareas = async (filtros: any = {}) => {
  const res = await api.get("/tareas", { params: filtros });
  const total = Number(res.headers["x-total-count"] ?? res.data?.total ?? 0);
  const tareas = res.data?.data ?? [];
  return { tareas, total };
};
