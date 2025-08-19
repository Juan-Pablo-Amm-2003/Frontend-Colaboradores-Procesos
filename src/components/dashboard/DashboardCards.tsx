import React from 'react';
import { esCompletada } from '../../utils/tareasAdapter';
import { Tarea } from '../../types/tarea';

interface Props {
  tareas: Tarea[];
  promedioDias: number;
}

const DashboardCards: React.FC<Props> = ({ tareas, promedioDias }) => {
  const total = tareas?.length || 0;

  const completadas = (tareas || []).filter(t => esCompletada(t.estado as any)).length;

  const hoyYMD = new Date().toISOString().slice(0, 10);
  const vencidas = (tareas || []).filter(t => {
    const venc = t?.fecha_vencimiento ?? null;
    return venc && venc < hoyYMD && !esCompletada(t.estado as any);
  }).length;

  const Card = ({ title, value }: { title: string; value: string | number }) => (
    <div className="bg-white p-4 rounded shadow text-center">
      <h4 className="text-sm text-gray-500 font-medium">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card title="Total de tareas" value={total} />
      <Card title="Completadas" value={completadas} />
      <Card title="Vencidas" value={vencidas} />
      <Card title="Prom. duración (días)" value={Number.isFinite(+promedioDias) ? promedioDias.toFixed(1) : '—'} />
    </div>
  );
};

export default DashboardCards;
