import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Tarea } from "../../types/tarea";

const COLORS = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
const PRIORIDADES = ["Urgente", "Importante", "Media", "Baja"] as const;

type Props = { tareas: Tarea[] };

const CustomTooltip = ({ active, payload, total }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { name: string; value: number };
  const pct = ((d.value / total) * 100).toFixed(1);
  return (
    <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs shadow">
      <div className="font-medium">{d.name}</div>
      <div>{d.value} tareas ({pct}%)</div>
    </div>
  );
};

const GraficoPrioridad: React.FC<Props> = ({ tareas }) => {
  const { data, total } = useMemo(() => {
    const raw = PRIORIDADES.map((p) => ({
      name: p,
      value: (tareas || []).filter((t) => t.prioridad === p).length,
    }));
    const d = [...raw].sort((a, b) => b.value - a.value);
    return { data: d, total: d.reduce((a, b) => a + b.value, 0) };
  }, [tareas]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <h3 className="text-base sm:text-lg font-semibold text-center mb-2">
        Distribución por Prioridad
      </h3>

      {total === 0 ? (
        <p className="text-sm text-gray-500 text-center">Sin datos</p>
      ) : (
        // ALTURA EXPLÍCITA PARA RECALCULO CORRECTO
        <div className="w-full min-w-0 h-[240px] sm:h-[300px] md:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, right: 16, bottom: 16, left: 16 }}>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={115}
                paddingAngle={1}
                minAngle={3}
                isAnimationActive={false}
                labelLine={false}
              >
                {data.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip total={total} />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default React.memo(GraficoPrioridad);
