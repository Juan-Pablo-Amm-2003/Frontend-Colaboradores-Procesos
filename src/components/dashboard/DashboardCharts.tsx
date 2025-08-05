import React from 'react';
import GraficoPrioridad from './GraficoPrioridad';
import GraficoColaboradores from './GraficoColaboradores';
import GraficoEvolucionPorEstado from './GraficoEvolucionPorEstado';

const DashboardCharts = ({ tareas }: { tareas: any[] }) => (
  <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
    <GraficoPrioridad tareas={tareas} />
    <GraficoColaboradores tareas={tareas} />
    <GraficoEvolucionPorEstado tareas={tareas} />
  </div>
);

export default DashboardCharts;
