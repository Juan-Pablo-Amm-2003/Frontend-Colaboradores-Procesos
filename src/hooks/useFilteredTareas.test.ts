import { renderHook } from '@testing-library/react';
import { useFilteredTareas } from './useFilteredTareas';
import { Tarea } from '../types/tarea'; 

const tareasMock: Tarea[] = [
  {
    estado: 'Completado',
    prioridad: 'Alta',
    colaborador: 'Juan',
    fecha_creacion: '2025-01-01',
  },
  {
    estado: 'En curso',
    prioridad: 'Media',
    colaborador: 'Pedro',
    fecha_creacion: '2025-02-01',
  },
  {
    estado: 'No iniciado',
    prioridad: 'Baja',
    colaborador: 'Juan',
    fecha_creacion: '2025-03-15',
  },
];

describe('useFilteredTareas', () => {
  it('devuelve todas las tareas si no hay filtros', () => {
    const { result } = renderHook(() => useFilteredTareas(tareasMock, {}));
    expect(result.current).toHaveLength(3);
  });

  it('filtra por estado', () => {
    const { result } = renderHook(() =>
      useFilteredTareas(tareasMock, { estado: 'Completado' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].estado).toBe('Completado');
  });

  it('filtra por prioridad', () => {
    const { result } = renderHook(() =>
      useFilteredTareas(tareasMock, { prioridad: 'Media' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].prioridad).toBe('Media');
  });

  it('filtra por colaborador', () => {
    const { result } = renderHook(() =>
      useFilteredTareas(tareasMock, { colaborador: 'Juan' })
    );
    expect(result.current).toHaveLength(2);
    expect(result.current.every(t => t.colaborador === 'Juan')).toBe(true);
  });

  it('filtra por fechaDesde', () => {
    const { result } = renderHook(() =>
      useFilteredTareas(tareasMock, { fechaDesde: '2025-02-01' })
    );
    expect(result.current).toHaveLength(2);
    expect(result.current.every(t =>
      new Date(t.fecha_creacion!) >= new Date('2025-02-01')
    )).toBe(true);
  });

  it('filtra por fechaHasta', () => {
    const { result } = renderHook(() =>
      useFilteredTareas(tareasMock, { fechaHasta: '2025-01-31' })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].fecha_creacion).toBe('2025-01-01');
  });

  it('filtra por múltiples campos combinados', () => {
    const { result } = renderHook(() =>
      useFilteredTareas(tareasMock, {
        estado: 'Completado',
        prioridad: 'Alta',
        colaborador: 'Juan',
      })
    );
    expect(result.current).toHaveLength(1);
    expect(result.current[0].estado).toBe('Completado');
  });
});
