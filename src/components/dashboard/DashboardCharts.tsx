import React from "react";
import GraficoPrioridad from "./GraficoPrioridad";
import GraficoColaboradores from "./GraficoColaboradores";
import GraficoEvolucionPorEstado from "./GraficoEvolucionPorEstado";
import { Tarea } from "../../types/tarea";

type Props = { tareas: Tarea[] };

const DashboardCharts: React.FC<Props> = ({ tareas }) => (
  <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 items-stretch [&>*]:min-w-0">
    <section id="chart-prioridad" className="min-w-0">
      <GraficoPrioridad tareas={tareas} />
    </section>

    <section id="chart-colaboradores" className="min-w-0">
      <GraficoColaboradores tareas={tareas} />
    </section>

    <section id="chart-evolucion" className="lg:col-span-2 min-w-0">
      <GraficoEvolucionPorEstado tareas={tareas} />
    </section>
  </div>
);

export default DashboardCharts;
