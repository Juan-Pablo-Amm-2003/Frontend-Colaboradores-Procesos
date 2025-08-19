// src/utils/tareasAdapter.ts
import { Tarea } from "../types/tarea";

/** Estados canónicos de la UI */
export const ESTADOS = [
  "No iniciado",
  "En curso",
  "Implementado",
  "Efectividad verificada",
  "No efectivo",
  "Completado",
] as const;
export type EstadoCanonico = typeof ESTADOS[number];

/** Prioridades canónicas */
export const PRIORIDADES = ["Urgente", "Importante", "Media", "Baja"] as const;
export type PrioridadCanonica = typeof PRIORIDADES[number];

/* -------- Normalizadores -------- */

const estadoMap: Record<string, EstadoCanonico> = {
  "no iniciado": "No iniciado",
  "informado": "En curso",
  "en curso": "En curso",
  "en proceso": "En curso",
  "proceso": "En curso",
  "implementado": "Implementado",
  "efectividad verificada": "Efectividad verificada",
  "no efectivo": "No efectivo",
  "completado": "Completado",
  // tolerancia
  "completo": "Completado",
  "completada": "Completado",
  "en_proceso": "En curso",
  "en-proceso": "En curso",
};

const prioridadMap: Record<string, PrioridadCanonica> = {
  "urgente": "Urgente",
  "alta": "Urgente",
  "importante": "Importante",
  "media": "Media",
  "normal": "Media",
  "baja": "Baja",
  "low": "Baja",
};

export function normalizarEstado(v: unknown): EstadoCanonico | null {
  if (!v || typeof v !== "string") return null;
  const k = v.trim().toLowerCase();
  return estadoMap[k] ?? null;
}

export function normalizarPrioridad(v: unknown): PrioridadCanonica | null {
  if (!v || typeof v !== "string") return null;
  const k = v.trim().toLowerCase();
  return prioridadMap[k] ?? null;
}

/** YYYY-MM-DD o null desde formatos comunes */
export function toYMD(input: unknown): string | null {
  if (!input) return null;

  if (input instanceof Date && !isNaN(input.getTime())) {
    return input.toISOString().slice(0, 10);
  }
  if (typeof input !== "string") return null;
  const s = input.trim();
  if (!s) return null;

  // YYYY-MM-DD / YYYY/MM/DD
  {
    const m = s.match(/^(\d{4})[-/](\d{2})[-/](\d{2})$/);
    if (m) {
      const [_, y, mo, d] = m;
      const dt = new Date(`${y}-${mo}-${d}T00:00:00`);
      return isNaN(dt.getTime()) ? null : `${y}-${mo}-${d}`;
    }
  }
  // DD-MM-YYYY / DD/MM/YYYY
  {
    const m = s.match(/^(\d{2})[-/](\d{2})[-/](\d{4})$/);
    if (m) {
      const [_, d, mo, y] = m;
      const dt = new Date(`${y}-${mo}-${d}T00:00:00`);
      return isNaN(dt.getTime()) ? null : `${y}-${mo}-${d}`;
    }
  }

  const dt = new Date(s);
  return isNaN(dt.getTime()) ? null : dt.toISOString().slice(0, 10);
}

export function esCompletada(estado: EstadoCanonico | null): boolean {
  return (
    estado === "Completado" ||
    estado === "Implementado" ||
    estado === "Efectividad verificada"
  );
}

export function calcularRetrasada(
  fecha_vencimiento: string | null,
  estado: EstadoCanonico | null,
  hoyYMD?: string
): boolean {
  if (!fecha_vencimiento) return false;
  const hoy = hoyYMD ?? new Date().toISOString().slice(0, 10);
  return fecha_vencimiento < hoy && !esCompletada(estado);
}

/** Desanida inputs raros y devuelve array seguro */
export function unwrapArray(input: any): any[] {
  if (!input) return [];
  if (Array.isArray(input)) return input;

  const candidates = [
    input?.data,
    input?.items,
    input?.results,
    input?.value,
    input?.tareas,
    input?.payload,
    input?.data?.tareas,
  ].filter(Array.isArray);

  if (candidates.length) return candidates[0] as any[];

  if (typeof input === "object") {
    const arrays = Object.values(input).filter(Array.isArray) as any[][];
    if (arrays.length) return arrays.flat();
    return [input];
  }
  return [];
}

/** Adaptación total al shape de la UI */
export function adaptarTareas(raw: any): Tarea[] {
  const arr = unwrapArray(raw);

  return arr.map((t: any): Tarea => {
    const estado = normalizarEstado(t?.estado) ?? "No iniciado";
    const prioridad = normalizarPrioridad(t?.prioridad) ?? "Media";

    const fecha_creacion = toYMD(t?.fecha_creacion);
    const fecha_vencimiento = toYMD(t?.fecha_vencimiento);
    const fecha_finalizacion = toYMD(t?.fecha_finalizacion);

    const etiquetas = Array.isArray(t?.etiquetas) ? t.etiquetas : [];
    const checklist =
      t?.checklist && typeof t.checklist === "object" ? t.checklist : { items: [] };

    const retrasada = calcularRetrasada(fecha_vencimiento, estado);

    return {
      // ids
      id: t?.id ?? cryptoId(),
      id_tarea_planner: t?.id_tarea_planner ?? null,

      // texto y metadata
      descripcion: t?.descripcion ?? "",
      estado,
      prioridad,
      etiquetas,
      checklist,
      colaborador: t?.colaborador ?? null,
      creado_por: t?.creado_por ?? null,
      completado_por: t?.completado_por ?? null,

      // fechas normalizadas
      fecha_creacion,
      fecha_vencimiento,
      fecha_finalizacion,

      // calculados/numéricos
      retrasada,
      esfuerzo: Number.isFinite(+t?.esfuerzo) ? +t.esfuerzo : 0,

      // cualquier otro campo de tu interface que uses:
      tablero: t?.tablero ?? null,
      // ...
    } as Tarea;
  });
}

function cryptoId() {
  try {
    // @ts-ignore
    return crypto.randomUUID();
  } catch {
    return "tmp-" + Math.random().toString(36).slice(2);
  }
}
