import React, { useMemo } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { Tarea } from "../../types/tarea";

const PRIORIDADES = ["Urgente", "Importante", "Media", "Baja"] as const;

// Colores fijos por nombre (match imagen 2: Media en rojo, etc.)
const COLOR_BY_NAME: Record<typeof PRIORIDADES[number], string> = {
  Media: "#ef4444",
  Importante: "#f59e0b",
  Baja: "#3b82f6",
  Urgente: "#10b981",
};

type Props = { tareas: Tarea[] };

const CustomTooltip = ({ active, payload, total }: any) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload as { name: string; value: number };
  const pct = total ? ((d.value / total) * 100).toFixed(1) : "0.0";
  return (
    <div className="bg-white border border-gray-200 rounded px-2 py-1 text-xs shadow">
      <div className="font-medium">{d.name}</div>
      <div>
        {d.value} tareas ({pct}%)
      </div>
    </div>
  );
};

const LegendRight = ({
  data,
  total,
}: {
  data: { name: string; value: number; color: string }[];
  total: number;
}) => (
  <div className="text-sm md:pl-4">
    <ul className="space-y-2">
      {data.map((d) => {
        const pct = total ? Math.round((d.value / total) * 100) : 0;
        return (
          <li
            key={d.name}
            className="flex items-center justify-between gap-3"
            title={`${d.name}: ${d.value} (${pct}%)`}
          >
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-sm"
                style={{ background: d.color }}
              />
              <span>{d.name}</span>
            </div>
            <span className="tabular-nums">{d.value} ({pct}%)</span>
          </li>
        );
      })}
    </ul>
    <div className="mt-3 text-xs text-gray-500">Total: {total} tareas</div>
  </div>
);

const GraficoPrioridad: React.FC<Props> = ({ tareas }) => {
  const { data, total } = useMemo(() => {
    const raw = PRIORIDADES.map((p) => ({
      name: p,
      value: (tareas || []).filter((t) => t.prioridad === p).length,
      color: COLOR_BY_NAME[p],
    }));
    // Ordenamos por valor desc para que el donut “muestre” primero lo más grande,
    // pero sin perder el color fijo por nombre.
    const sorted = [...raw].sort((a, b) => b.value - a.value);
    const tot = sorted.reduce((a, b) => a + b.value, 0);
    return { data: sorted, total: tot };
  }, [tareas]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <h3 className="text-base sm:text-lg font-semibold text-center mb-2">
        Distribución por Prioridad
      </h3>

      {total === 0 ? (
        <p className="text-sm text-gray-500 text-center">Sin datos</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 items-center">
          {/* Donut */}
          <div className="md:col-span-2 w-full min-w-0 h-[240px] sm:h-[300px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart margin={{ top: 10, right: 8, bottom: 8, left: 8 }}>
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
                  {data.map((d, i) => (
                    <Cell key={i} fill={d.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip total={total} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Leyenda a la derecha (como la barra de la imagen 2) */}
          <div className="md:col-span-1 mt-4 md:mt-0">
            <LegendRight data={data} total={total} />
          </div>
        </div>
      )}
    </div>
  );
};

export default React.memo(GraficoPrioridad);
