// src/components/dashboard/Dashboard.tsx
import React from 'react';
import DashboardCards from './DashboardCards';
import DashboardCharts from './DashboardCharts';
import DashboardAlerts from './DashboardAlerts';
import TaskTable from '../table/TaskTable';

interface DashboardProps {
  tareas?: any[];
  loading?: boolean;
  promedioDias?: number;
}

const Dashboard = ({
  tareas = [],
  loading = false,
  promedioDias = 0,
}: DashboardProps) => {
  if (loading) return <p className="text-center text-gray-500">Cargando datos...</p>;
  if (!Array.isArray(tareas) || tareas.length === 0) return <p className="text-center text-gray-400">No hay tareas para mostrar.</p>;

  return (
    <div className="p-4 space-y-8">
      <h2 className="text-2xl font-bold">Dashboard de Tareas</h2>

      <DashboardCards tareas={tareas} promedioDias={promedioDias} />
      <DashboardCharts tareas={tareas} />
      <DashboardAlerts tareas={tareas} />
      <TaskTable tareas={tareas} />
    </div>
  );
};

export default Dashboard;
