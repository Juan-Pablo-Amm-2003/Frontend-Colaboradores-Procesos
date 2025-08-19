import React, { useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { normalizarEstado } from "../../utils/tareasAdapter";
import { Tarea } from "../../types/tarea";

type Props = { tareas: Tarea[] };
const ESTADOS_4 = ["No iniciado", "En curso", "Implementado", "Completado"] as const;
type Estado4 = typeof ESTADOS_4[number];

const COLOR_ESTADOS: Record<Estado4, string> = {
  "No iniciado": "#6b7280",
  "En curso": "#3b82f6",
  "Implementado": "#16a34a",
  "Completado": "#0ea5e9",
};
const DASH: Partial<Record<Estado4, string>> = { "No iniciado": "4 3" };

const GraficoEvolucionPorEstado: React.FC<Props> = ({ tareas }) => {
  const datos = useMemo(() => {
    if (!tareas?.length) return [];
    const bucket = () => Object.fromEntries(ESTADOS_4.map(e => [e, 0])) as Record<Estado4, number>;
    const map: Record<string, any> = {};

    for (const t of tareas) {
      const est = normalizarEstado(t.estado as any) as Estado4 | null;
      if (!est || !ESTADOS_4.includes(est)) continue;

      const ref = t.fecha_vencimiento || t.fecha_creacion || t.fecha_finalizacion;
      if (!ref) continue;

      const s = String(ref);
      const claveMes = `${s.slice(0, 4)}-${s.slice(5, 7)}`;
      if (!map[claveMes]) {
        const dt = new Date(`${claveMes}-01T00:00:00`);
        map[claveMes] = { fechaOrden: claveMes, name: dt.toLocaleDateString("es-ES", { year: "numeric", month: "short" }), ...bucket() };
      }
      map[claveMes][est] += 1;
    }
    return Object.values(map).sort((a: any, b: any) => a.fechaOrden.localeCompare(b.fechaOrden));
  }, [tareas]);

  return (
    <div className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4">
      <h3 className="text-base sm:text-lg font-semibold text-center mb-2">Evolución por estado</h3>

      {datos.length === 0 ? (
        <p className="text-sm text-gray-500 text-center">Sin datos</p>
      ) : (
        <div className="w-full min-w-0 h-[260px] sm:h-[320px] md:h-[360px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={datos} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} domain={[0, "dataMax"]} />
              <Tooltip />
              <Legend />
              {ESTADOS_4.map((e) => (
                <Line
                  key={e}
                  type="monotone"
                  dataKey={e}
                  dot={false}
                  strokeWidth={2}
                  isAnimationActive={false}
                  stroke={COLOR_ESTADOS[e]}
                  strokeDasharray={DASH[e]}
                  activeDot={{ r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};

export default React.memo(GraficoEvolucionPorEstado);
