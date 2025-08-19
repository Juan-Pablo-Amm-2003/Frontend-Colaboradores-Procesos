import React from "react";
import { normalizarEstado, esCompletada } from "../../utils/tareasAdapter";
import { Tarea } from "../../types/tarea";

const DashboardAlerts: React.FC<{ tareas: Tarea[] }> = ({ tareas }) => {
  const ahoraYMD = new Date().toISOString().slice(0, 10);

  const sinColaborador = (tareas || []).filter(t => !t.colaborador || !String(t.colaborador).trim());
  const vencidas = (tareas || []).filter(t => {
    const venc = t?.fecha_vencimiento ?? null;
    return venc && venc < ahoraYMD && !esCompletada(t.estado as any);
  });
  const tareasLargas = (tareas || []).filter(t => {
    const ini = t?.fecha_creacion ?? null;
    const fin = t?.fecha_finalizacion ?? null;
    if (!ini || !fin) return false;
    const dias = (new Date(fin).getTime() - new Date(ini).getTime()) / 86_400_000;
    return dias > 30;
  });

  const renderLista = (lista: Tarea[]) => (
    <ul className="ml-4 list-disc text-sm text-gray-600">
      {lista.map((t, i) => (
        <li key={t.id ?? i}>
          {(String(t.colaborador || "").trim() || "Sin asignar")} — {t.nombre_tarea || t.descripcion || "Tarea sin nombre"}
        </li>
      ))}
    </ul>
  );

  const noAlerts = !sinColaborador.length && !vencidas.length && !tareasLargas.length;

  return (
    <div className="bg-white p-4 shadow rounded space-y-4">
      <h3 className="text-lg font-semibold text-red-600">Alertas</h3>

      {sinColaborador.length > 0 && (
        <div>
          <p>🚨 {sinColaborador.length} tareas sin colaborador asignado:</p>
          {renderLista(sinColaborador)}
        </div>
      )}

      {vencidas.length > 0 && (
        <div>
          <p>🕒 {vencidas.length} tareas vencidas sin completar:</p>
          {renderLista(vencidas)}
        </div>
      )}

      {tareasLargas.length > 0 && (
        <div>
          <p>⏳ {tareasLargas.length} tareas con más de 30 días de duración:</p>
          {renderLista(tareasLargas)}
        </div>
      )}

      {noAlerts && <p className="text-green-600">✅ No hay alertas en este momento</p>}
    </div>
  );
};

export default DashboardAlerts;
