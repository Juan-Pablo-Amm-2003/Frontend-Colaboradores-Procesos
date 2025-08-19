import React, { useState, useMemo } from "react";
import DashboardCards from "./DashboardCards";
import DashboardCharts from "./DashboardCharts";
import DashboardAlerts from "./DashboardAlerts";
import TaskTable from "../table/TaskTable";
import Filters from "../../features/tareas/Filters";
import { useFilteredTareas } from "../../hooks/useFilteredTareas";
import { exportDashboardPdf } from "../../utils/exportDashboardPdf";

interface DashboardProps {
  tareas?: any[];
  loading?: boolean;
  promedioDias?: number;
}
interface Filtros {
  estado?: string;
  prioridad?: string;
  colaborador?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

const Dashboard: React.FC<DashboardProps> = ({
  tareas = [],
  loading = false,
  promedioDias = 0,
}) => {
  const [filtros, setFiltros] = useState<Filtros>({});
  const [exporting, setExporting] = useState(false);
  const tareasFiltradas = useFilteredTareas(tareas, filtros);

  const colaboradoresDisponibles = useMemo(() => {
    const s = new Set<string>();
    tareas.forEach((t) => t.colaborador && s.add(t.colaborador));
    return Array.from(s);
  }, [tareas]);

  const exportarPDF = async () => {
    try {
      setExporting(true);
      await exportDashboardPdf({
        filtros,
        tareas: tareasFiltradas,
        fileName: "Dashboard_Tareas",
        blockIds: ["cards", "chart-prioridad", "chart-colaboradores", "chart-evolucion", "alerts"],
      });
    } finally {
      setExporting(false);
    }
  };

  if (loading) return <p className="text-center text-gray-500">Cargando datos...</p>;
  if (!Array.isArray(tareas) || tareas.length === 0) {
    return <p className="text-center text-gray-400">No hay tareas para mostrar.</p>;
  }

  return (
    <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 2xl:px-12 py-6 lg:py-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-3">
        <div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight">
            Dashboard de Colaboradores
          </h2>
          <p className="mt-1 text-sm text-gray-600">
            Mostrando <strong>{tareasFiltradas.length}</strong> de{" "}
            <strong>{tareas.length}</strong> tareas totales
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={exportarPDF}
            disabled={exporting}
            className="bg-green-600 hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md shadow-sm"
          >
            {exporting ? "Generando PDF…" : "Exportar a PDF"}
          </button>
        </div>
      </div>

      {/* STACK principal: KPIs -> Filtros -> Gráficos -> Alertas -> Tabla */}
      <div className="mt-6 space-y-6 2xl:space-y-8">
        {/* KPIs (full width, altura natural) */}
        <section
          id="cards"
          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 self-start"
        >
          <DashboardCards tareas={tareasFiltradas} promedioDias={promedioDias} />
        </section>

        {/* Filtros debajo de KPIs (full width) */}
        <section
          id="filters"
          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-5"
        >
          <Filters
            onApplyFilters={setFiltros}
            colaboradoresDisponibles={colaboradoresDisponibles}
          />
        </section>

        {/* Charts (full width) */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4 lg:p-6">
          <DashboardCharts tareas={tareasFiltradas} />
        </section>

        {/* Alertas con scroll propio para no romper el layout */}
        <section
          id="alerts"
          className="rounded-2xl border border-gray-200 bg-white shadow-sm p-4"
        >
          <div className="max-h-[360px] overflow-auto pr-2">
            <DashboardAlerts tareas={tareasFiltradas} />
          </div>
        </section>

        {/* Tabla (full width) */}
        <section className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <TaskTable tareas={tareasFiltradas} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
