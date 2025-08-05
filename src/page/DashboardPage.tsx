// src/pages/DashboardPage.tsx
import React, { useEffect, useState } from 'react';
import { getTareasFiltradas } from '../features/tareas/api';
import Dashboard from '../components/dashboard/Dashboard';
import Filters from '../features/tareas/Filters';
import ExcelUpload from '../features/tareas/ExcelUpload';

const DashboardPage = () => {
  const [tareas, setTareas] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [colaboradores, setColaboradores] = useState<string[]>([]);

  // ✅ Mantiene una lista fija de colaboradores únicos
  const calcularColaboradoresUnicos = (tareas: any[]) => {
    return Array.from(
      new Set(
        tareas
          .map((t: any) => t.completado_por)
          .filter((c): c is string => typeof c === 'string' && c.trim() !== '')
      )
    );
  };

  const fetchTareas = async (filtros: any = {}, actualizarColaboradores = false) => {
    setLoading(true);
    try {
      const data = await getTareasFiltradas(filtros);
      setTareas(data);

      // ✅ Solo actualizar la lista al inicio o con fuerza
      if (actualizarColaboradores) {
        setColaboradores(calcularColaboradoresUnicos(data));
      }
    } catch (error) {
      console.error('Error al obtener tareas', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTareas({}, true); // ✅ carga inicial con colaboradores
  }, []);

  const tareasConFechas = tareas.filter(t => t.fecha_creacion && t.fecha_finalizacion);
  const duraciones = tareasConFechas.map(t => {
    const inicio = new Date(t.fecha_creacion).getTime();
    const fin = new Date(t.fecha_finalizacion).getTime();
    return (fin - inicio) / (1000 * 60 * 60 * 24);
  });
  const promedioDias = duraciones.length
    ? duraciones.reduce((a, b) => a + b, 0) / duraciones.length
    : 0;

  return (
    <div className="p-4 space-y-8">
      <ExcelUpload />
      <Filters onApplyFilters={(f) => fetchTareas(f)} colaboradoresDisponibles={colaboradores} />
      <Dashboard tareas={tareas} loading={loading} promedioDias={promedioDias} />
    </div>
  );
};

export default DashboardPage;
