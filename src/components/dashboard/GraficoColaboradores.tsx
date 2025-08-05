// components/GraficoColaboradores.tsx
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';

const GraficoColaboradores = ({ tareas = [] }: { tareas: any[] }) => {
  const conteo: Record<string, number> = {};
  tareas.forEach((t) => {
    const nombre = t.completado_por || 'Sin asignar';
    conteo[nombre] = (conteo[nombre] || 0) + 1;
  });

  const data = Object.entries(conteo).map(([name, value]) => ({ name, value }));

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-lg font-semibold mb-4 text-center">Ranking por Colaborador</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} layout="vertical" margin={{ top: 20, right: 30, left: 80, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" allowDecimals={false} />
          <YAxis type="category" dataKey="name" />
          <Tooltip />
          <Bar dataKey="value" fill="#4F46E5" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoColaboradores;
