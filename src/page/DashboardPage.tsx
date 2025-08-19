import React, { useEffect, useMemo } from "react";
import { getTareasFiltradas } from "../features/tareas/api";
import { Tarea } from "../types/tarea";
import { adaptarTareas } from "../utils/tareasAdapter";
import Dashboard from "../components/dashboard/Dashboard";
import { toast } from "react-toastify";
import { useQuery } from "@tanstack/react-query";

type TareasQueryData = { tareas: Tarea[]; total: number };

const DashboardPage: React.FC = () => {
  const { data, isLoading, isError, error, refetch } = useQuery<
    TareasQueryData,      // TQueryFnData: lo que retorna el queryFn
    Error,                // TError
    TareasQueryData,      // TData (igual al fnData)
    ["tareas"]            // TQueryKey: tupla tipada
  >({
    queryKey: ["tareas"],
    queryFn: async (): Promise<TareasQueryData> => {
      const { tareas: raw } = await getTareasFiltradas({
        limit: 500,
        order_by: "fecha_creacion",
        order_dir: "desc",
      });
      const adaptadas: Tarea[] = adaptarTareas(raw);
      return { tareas: adaptadas, total: adaptadas.length };
    },
    staleTime: 5 * 60 * 1000, // 5 min
    gcTime: 10 * 60 * 1000,   // v5: reemplaza a cacheTime
  });

  // Toast de error en v5 (sin onError en options)
  useEffect(() => {
    if (isError) {
      toast.error(`Error al cargar tareas: ${error?.message ?? "Error desconocido"}`);
    }
  }, [isError, error]);

  // Tipado explícito para evitar 'any'
  const tareas: Tarea[] = data?.tareas ?? [];

  // Promedio de duración en días (solo tareas con inicio y fin)
  const promedioDias = useMemo<number>(() => {
    const conRango: Tarea[] = tareas.filter(
      (t: Tarea) => t.fecha_creacion && t.fecha_finalizacion
    );
    if (conRango.length === 0) return 0;

    const MS_DIA = 86_400_000;
    const totalDias = conRango.reduce((acc: number, t: Tarea) => {
      const ini = new Date(t.fecha_creacion as any).getTime();
      const fin = new Date(t.fecha_finalizacion as any).getTime();
      return acc + Math.max(0, (fin - ini) / MS_DIA);
    }, 0);

    return totalDias / conRango.length;
  }, [tareas]);

  if (isError) {
    return (
      <div className="p-4 space-y-3">
        <p className="text-red-600">Error: {error?.message ?? "Error desconocido"}</p>
        <button
          onClick={() => refetch()}
          className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return <Dashboard tareas={tareas} loading={isLoading} promedioDias={promedioDias} />;
};

export default DashboardPage;
