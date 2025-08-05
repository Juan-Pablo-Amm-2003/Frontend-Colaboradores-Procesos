// components/GraficoEvolucionPorEstado.tsx
import React from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';

const GraficoEvolucionPorEstado = ({ tareas = [] }: { tareas: any[] }) => {
  const agrupadas: Record<string, any> = {};

  tareas.forEach((t) => {
    const fecha = new Date(t.fecha_vencimiento);
    const mes = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });

    if (!agrupadas[mes]) {
      agrupadas[mes] = {
        name: mes,
        Completado: 0,
        'En curso': 0,
        'No iniciado': 0,
      };
    }

    if (t.estado === 'Completado') agrupadas[mes].Completado++;
    else if (t.estado === 'En curso') agrupadas[mes]['En curso']++;
    else if (t.estado === 'No iniciado') agrupadas[mes]['No iniciado']++;
  });

  const data = Object.values(agrupadas);

  return (
    <div className="bg-white p-4 shadow rounded">
      <h3 className="text-lg font-semibold mb-4 text-center">Evolución por Estado</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis allowDecimals={false} />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Completado" stroke="#22C55E" />
          <Line type="monotone" dataKey="En curso" stroke="#FACC15" />
          <Line type="monotone" dataKey="No iniciado" stroke="#EF4444" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default GraficoEvolucionPorEstado;
