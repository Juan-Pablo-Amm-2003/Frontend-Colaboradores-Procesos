import { Tarea } from "../types/tarea";


export const normalizarEstado = (estado: string): string => {
  const lower = estado.toLowerCase();
  if (['en proceso', 'en curso', 'proceso'].includes(lower)) return 'En curso';
  if (lower === 'completado') return 'Completado';
  if (lower === 'no iniciado') return 'No iniciado';
  return estado;
};

export function normalizeTareas(input: any): Tarea[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;
  if (Array.isArray(input?.data)) return input.data;
  if (Array.isArray(input?.items)) return input.items;
  if (Array.isArray(input?.results)) return input.results;
  if (Array.isArray(input?.value)) return input.value;
  if (Array.isArray(input?.tareas)) return input.tareas;
  if (Array.isArray(input?.payload)) return input.payload;
  if (Array.isArray(input?.data?.tareas)) return input.data.tareas;

  if (typeof input === "object") {
    const arrays = Object.values(input).filter(Array.isArray) as any[][];
    if (arrays.length) return arrays.flat();
    return [input as Tarea];
  }
  return [];
}