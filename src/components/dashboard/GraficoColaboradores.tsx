import React, { useMemo } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend, LabelList } from "recharts";
import { normalizarEstado } from "../../utils/tareasAdapter";
import { Tarea } from "../../types/tarea";

type Buckets = {
  no_iniciado: number; en_proceso: number; implementado: number; completado: number;
  total: number; colaborador: string;
};

const COLORS = {
  no_iniciado: "#9ca3af",
  en_proceso: "#60a5fa",
  implementado: "#16a34a",
  completado: "#22c55e",
} as const;

const TOP_N = 10;
const MAX_LABEL = 18;
const trunc = (s: string, n = MAX_LABEL) => (s.length > n ? s.slice(0, n - 1) + "…" : s);

const GraficoColaboradores: React.FC<{ tareas: Tarea[] }> = ({ tareas }) => {
  const data = useMemo(() => {
    if (!tareas?.length) return [] as Buckets[];
    const grouped: Record<string, Buckets> = {};
    for (const t of tareas) {
      const nombre = String(t.colaborador || "").trim() || "Sin asignar";
      const est = normalizarEstado(t.estado as any);
      if (!grouped[nombre]) grouped[nombre] = { colaborador: nombre, no_iniciado: 0, en_proceso: 0, implementado: 0, completado: 0, total: 0 };
      if (est === "No iniciado") grouped[nombre].no_iniciado++;
      else if (est === "En curso") grouped[nombre].en_proceso++;
      else if (est === "Implementado") grouped[nombre].implementado++;
      else if (est === "Completado") grouped[nombre].completado++;
      grouped[nombre].total++;
    }
    let arr = Object.values(grouped).sort((a, b) => b.total - a.total);
    if (arr.length > TOP_N) {
      const top = arr.slice(0, TOP_N);
      const rest = arr.slice(TOP_N).reduce<Buckets>(
        (acc, x) => ({
          colaborador: "Otros",
          no_iniciado: acc.no_iniciado + x.no_iniciado,
          en_proceso: acc.en_proceso + x.en_proceso,
          implementado: acc.implementado + x.implementado,
          completado: acc.completado + x.completado,
          total: acc.total + x.total,
        }),
        { colaborador: "Otros", no_iniciado: 0, en_proceso: 0, implementado: 0, completado: 0, total: 0 }
      );
      arr = [...top, rest];
    }
    return arr;
  }, [tareas]);

  const height = Math.min(700, Math.max(260, data.length * 44));

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 min-w-0">
      <h3 className="text-base sm:text-lg font-semibold text-center mb-2">Distribución de Tareas por Colaborador</h3>

      {data.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">Sin datos</p>
      ) : (
        <div style={{ height }} className="w-full min-w-0">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ top: 6, right: 24, left: 8, bottom: 8 }} barCategoryGap={14} barGap={6}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis type="number" allowDecimals={false} domain={[0, (max: number) => Math.ceil(max * 1.2)]} tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis type="category" dataKey="colaborador" width={104} tick={{ fontSize: 12 }} tickLine={false} axisLine={false} tickFormatter={(v: string) => trunc(v)} />
              <Tooltip />
              <Legend verticalAlign="top" align="center" wrapperStyle={{ paddingBottom: 4 }} />
              <Bar dataKey="no_iniciado"  stackId="a" name="No iniciado"  fill={COLORS.no_iniciado} />
              <Bar dataKey="en_proceso"   stackId="a" name="En curso"     fill={COLORS.en_proceso} />
              <Bar dataKey="implementado" stackId="a" name="Implementado" fill={COLORS.implementado} />
              <Bar dataKey="completado"   stackId="a" name="Completado"   fill={COLORS.completado}>
                <LabelList dataKey="total" position="right" className="fill-gray-600" />
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default React.memo(GraficoColaboradores);
