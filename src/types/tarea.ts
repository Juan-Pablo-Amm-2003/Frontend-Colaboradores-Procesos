export interface Tarea {
  id: number;
  nombre_tarea?: string;
  estado?: string;
  prioridad?: string;
  colaborador?: string;
  fecha_creacion?: string;
  fecha_vencimiento?: string;
  fecha_finalizacion?: string;
  id_tarea_planner?: string;
  descripcion?: string;
  creado_por?: string;
  completado_por?: string;
  etiquetas?: string[];
  checklist?: { items: string[] };
  retrasada?: boolean;
  nombre_tablero?: string;
}


export interface Filtros {
  estado?: string;
  prioridad?: string;
  colaborador?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export interface ChecklistItem {
  items: string[];
}