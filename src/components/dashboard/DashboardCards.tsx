// components/DashboardCards.tsx
import React from 'react';

interface Props {
  tareas: any[];
  promedioDias: number;
}

const DashboardCards: React.FC<Props> = ({ tareas, promedioDias }) => {
  const total = tareas.length;
  const completadas = tareas.filter(t => t.estado === 'Completado').length;
  const vencidas = tareas.filter(t => {
    const venc = new Date(t.fecha_vencimiento);
    return venc < new Date() && t.estado !== 'Completado';
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
      <Card title="Prom. duración (días)" value={promedioDias.toFixed(1)} />
    </div>
  );
};

export default DashboardCards;
