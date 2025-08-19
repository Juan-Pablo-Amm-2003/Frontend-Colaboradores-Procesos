import React, { useEffect, useMemo, useState } from "react";
import { Tarea } from "../../types/tarea";
import { normalizarEstado } from "../../utils/tareasAdapter";

type Props = { tareas?: Tarea[]; pageSize?: number };

type SortKey = "titulo" | "colaborador" | "estado" | "prioridad" | "vencimiento";
type SortDir = "asc" | "desc";

const truncate = (s: string, n = 90) => (s ? (s.length > n ? s.slice(0, n - 1) + "…" : s) : "");
const fmtFecha = (d?: string | null) => (d ? new Date(d).toLocaleDateString() : "—");

const tituloDe = (t: any): string => {
  const candidates = [
    t?.nombre_tarea,
    t?.nombre,
    t?.titulo,
    t?.name,
    (t?.descripcion || "")?.toString().trim(),
  ].filter((v) => typeof v === "string" && v.trim());
  if (candidates.length) return String(candidates[0]).trim();
  const id = t?.id_tarea_planner || t?.id || "";
  return id ? `ID ${id}` : "Sin nombre";
};

// orden lógico para ordenar por estado y prioridad
const ESTADO_ORDER: Record<string, number> = {
  "No iniciado": 0,
  "En curso": 1,
  "Implementado": 2,
  "Completado": 3,
};
const PRIORIDAD_ORDER: Record<string, number> = {
  Urgente: 0,
  Importante: 1,
  Media: 2,
  Baja: 3,
};

const ESTADO_BADGE: Record<string, string> = {
  "No iniciado": "bg-gray-100 text-gray-700",
  "En curso": "bg-blue-100 text-blue-700",
  "Implementado": "bg-emerald-100 text-emerald-700",
  "Completado": "bg-cyan-100 text-cyan-700",
};
const PRIORIDAD_BADGE: Record<string, string> = {
  Urgente: "bg-red-100 text-red-700",
  Importante: "bg-amber-100 text-amber-700",
  Media: "bg-gray-100 text-gray-700",
  Baja: "bg-green-100 text-green-700",
};

const isVencida = (t: Tarea) => {
  const fin = normalizarEstado(t.estado as any) === "Completado" || normalizarEstado(t.estado as any) === "Implementado";
  if (fin) return false;
  if (!t.fecha_vencimiento) return false;
  const d = new Date(t.fecha_vencimiento);
  const hoy = new Date();
  d.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);
  return d < hoy;
};

const relDias = (d?: string | null) => {
  if (!d) return "—";
  const dt = new Date(d);
  const hoy = new Date();
  dt.setHours(0, 0, 0, 0);
  hoy.setHours(0, 0, 0, 0);
  const diff = Math.round((dt.getTime() - hoy.getTime()) / 86_400_000);
  if (diff === 0) return "hoy";
  if (diff > 0) return `en ${diff} día${diff === 1 ? "" : "s"}`;
  const n = Math.abs(diff);
  return `hace ${n} día${n === 1 ? "" : "s"}`;
};

const TaskTable: React.FC<Props> = ({ tareas = [], pageSize = 10 }) => {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(pageSize);
  const [sortKey, setSortKey] = useState<SortKey>("vencimiento");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  useEffect(() => {
    setSize(pageSize);
    setPage(1);
  }, [pageSize, tareas]);

  const sorted = useMemo(() => {
    const arr = [...tareas];
    const mult = sortDir === "asc" ? 1 : -1;

    arr.sort((a, b) => {
      const ta = tituloDe(a).toLowerCase();
      const tb = tituloDe(b).toLowerCase();
      const ea = normalizarEstado(a.estado as any) || "";
      const eb = normalizarEstado(b.estado as any) || "";
      const pa = a.prioridad || "";
      const pb = b.prioridad || "";
      const va = a.fecha_vencimiento || "";
      const vb = b.fecha_vencimiento || "";

      switch (sortKey) {
        case "titulo":
          return mult * ta.localeCompare(tb, "es");
        case "colaborador":
          return mult * String(a.colaborador || "").localeCompare(String(b.colaborador || ""), "es");
        case "estado":
          return mult * ((ESTADO_ORDER[ea] ?? 99) - (ESTADO_ORDER[eb] ?? 99));
        case "prioridad":
          return mult * ((PRIORIDAD_ORDER[pa] ?? 99) - (PRIORIDAD_ORDER[pb] ?? 99));
        case "vencimiento":
        default:
          return mult * (new Date(va).getTime() - new Date(vb).getTime());
      }
    });

    return arr;
  }, [tareas, sortKey, sortDir]);

  const total = sorted.length;
  const totalPages = Math.max(1, Math.ceil(total / size));
  const start = (page - 1) * size;
  const visibles = sorted.slice(start, start + size);

  const go = (p: number) => setPage(Math.min(totalPages, Math.max(1, p)));

  const toggleSort = (k: SortKey) => {
    if (sortKey === k) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(k);
      setSortDir("asc");
    }
  };

  const headBtn = (label: string, k: SortKey, align: "left" | "right" = "left") => (
    <button
      onClick={() => toggleSort(k)}
      className={`flex items-center gap-1 ${align === "right" ? "justify-end w-full" : ""}`}
      title={`Ordenar por ${label.toLowerCase()}`}
    >
      <span>{label}</span>
      <span className={`text-xs ${sortKey === k ? "opacity-100" : "opacity-30"}`}>
        {sortKey === k ? (sortDir === "asc" ? "▲" : "▼") : "▲"}
      </span>
    </button>
  );

  return (
    <div className="bg-white p-4 shadow rounded mt-8">
      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="text-xl font-semibold text-gray-800">Lista de Tareas</h3>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Mostrando {visibles.length} de {total}</span>
          <label className="flex items-center gap-2">
            <span>Tamaño página</span>
            <select
              className="border rounded px-2 py-1"
              value={size}
              onChange={(e) => { setSize(Number(e.target.value)); setPage(1); }}
            >
              {[5, 10, 20, 50].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </label>
        </div>
      </div>

      {total === 0 ? (
        <p className="text-gray-500 text-center">No hay tareas para mostrar.</p>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100 sticky top-0 z-10">
                <tr>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">{headBtn("Nombre", "titulo")}</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">{headBtn("Colaborador", "colaborador")}</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">{headBtn("Estado", "estado")}</th>
                  <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">{headBtn("Prioridad", "prioridad")}</th>
                  <th className="px-4 py-2 text-right font-medium text-gray-600 uppercase">{headBtn("Vencimiento", "vencimiento", "right")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {visibles.map((t, i) => {
                  const titulo = tituloDe(t);
                  const estado = normalizarEstado(t.estado as any) || "—";
                  const prioridad = t.prioridad || "—";
                  const vencida = isVencida(t);

                  return (
                    <tr
                      key={t.id ?? t.id_tarea_planner ?? `${t.colaborador}-${i}`}
                      className={`hover:bg-gray-50 ${vencida ? "bg-red-50/40" : ""}`}
                    >
                      <td className="px-4 py-3 max-w-[520px]">
                        <span title={titulo} className="block truncate font-medium text-gray-800">
                          {truncate(titulo)}
                        </span>
                        {t.descripcion && (
                          <span className="block text-xs text-gray-500 truncate">
                            {truncate(String(t.descripcion), 120)}
                          </span>
                        )}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {(t.colaborador && t.colaborador.trim()) || "Sin asignar"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ESTADO_BADGE[estado] || "bg-gray-100 text-gray-700"}`}>
                          {estado}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${PRIORIDAD_BADGE[prioridad] || "bg-gray-100 text-gray-700"}`}>
                          {prioridad}
                        </span>
                      </td>

                      <td className="px-4 py-3 text-right whitespace-nowrap">
                        <div className={`inline-flex flex-col items-end ${vencida ? "text-red-600" : "text-gray-700"}`}>
                          <span className="font-medium">{fmtFecha(t.fecha_vencimiento)}</span>
                          <span className="text-xs">{relDias(t.fecha_vencimiento)}</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => go(page - 1)}
              disabled={page <= 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-600">Página {page} de {totalPages}</span>
            <button
              onClick={() => go(page + 1)}
              disabled={page >= totalPages}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskTable;
