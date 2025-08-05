// components/GraficoPrioridad.tsx
import React from 'react';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

const COLORS = ['#FF6384', '#FFCE56', '#36A2EB', '#A78BFA']; // Alta, Media, Baja, Importante

const GraficoPrioridad = ({ tareas = [] }: { tareas: any[] }) => {
  const prioridadData = ['Alta', 'Media', 'Baja', 'Importante'].map((p) => ({
    name: p,
    value: tareas.filter((t) => t.prioridad === p).length,
  }));

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-lg font-semibold mb-4 text-center">Distribución por Prioridad</h3>
      <PieChart width={400} height={300}>
        <Pie
          data={prioridadData}
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          dataKey="value"
        >
          {prioridadData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
};

export default GraficoPrioridad;
