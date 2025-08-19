import { useMemo } from 'react';
import { normalizarEstado } from '../utils/normalizarEstado';
import { Tarea } from '../types/tarea';

interface Filtros {
  estado?: string;
  prioridad?: string;
  colaborador?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}

export const useFilteredTareas = (tareas: Tarea[], filtros: Filtros) => {
  return useMemo(() => {
    return tareas.filter((t) => {
      const fecha = t.fecha_creacion ? new Date(t.fecha_creacion) : null;

      if (filtros.estado && normalizarEstado(t.estado || '') !== filtros.estado) return false;
      if (filtros.prioridad && t.prioridad !== filtros.prioridad) return false;
      if (filtros.colaborador && t.colaborador !== filtros.colaborador) return false;
      if (filtros.fechaDesde && fecha && fecha < new Date(filtros.fechaDesde)) return false;
      if (filtros.fechaHasta && fecha && fecha > new Date(filtros.fechaHasta)) return false;

      return true;
    });
  }, [tareas, filtros]);
};
