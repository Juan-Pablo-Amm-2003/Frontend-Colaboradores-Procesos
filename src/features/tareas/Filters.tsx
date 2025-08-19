// src/components/dashboard/Filters.tsx
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

type AppliedFilters = {
  estado?: string;
  prioridad?: string;
  colaborador?: string;
  fechaDesde?: string; // YYYY-MM-DD
  fechaHasta?: string; // YYYY-MM-DD
};

type UiFilters = {
  estado: string;
  prioridad: string;
  colaborador: string;
  fechaDesde: Date | null;
  fechaHasta: Date | null;
};

interface Props {
  onApplyFilters: (filters: AppliedFilters) => void;
  colaboradoresDisponibles: string[];
}

const toYMD = (d: Date) => d.toISOString().slice(0, 10);

const Filters: React.FC<Props> = ({ onApplyFilters, colaboradoresDisponibles }) => {
  const [filters, setFilters] = useState<UiFilters>({
    estado: "",
    prioridad: "",
    colaborador: "",
    fechaDesde: null,
    fechaHasta: null,
  });

  const applyFilters = () => {
    const f: AppliedFilters = {};
    if (filters.estado) f.estado = filters.estado;
    if (filters.prioridad) f.prioridad = filters.prioridad;
    if (filters.colaborador) f.colaborador = filters.colaborador;
    if (filters.fechaDesde) f.fechaDesde = toYMD(filters.fechaDesde);
    if (filters.fechaHasta) f.fechaHasta = toYMD(filters.fechaHasta);
    onApplyFilters(f);
  };

  const resetFilters = () => {
    setFilters({
      estado: "",
      prioridad: "",
      colaborador: "",
      fechaDesde: null,
      fechaHasta: null,
    });
    onApplyFilters({});
  };

  return (
    <div className="bg-white p-5 shadow rounded-2xl">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Filtros</h3>
        <button onClick={resetFilters} className="text-sm text-blue-600 hover:underline">
          Limpiar filtros
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Estado */}
        <select
          aria-label="Estado"
          value={filters.estado}
          onChange={(e) => setFilters({ ...filters, estado: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Estado</option>
          <option value="No iniciado">No iniciado</option>
          <option value="En curso">En curso</option>
          <option value="Implementado">Implementado</option>
          <option value="Completado">Completado</option>
        </select>

        {/* Prioridad */}
        <select
          aria-label="Prioridad"
          value={filters.prioridad}
          onChange={(e) => setFilters({ ...filters, prioridad: e.target.value })}
          className="w-full border p-2 rounded"
        >
          <option value="">Prioridad</option>
          <option value="Urgente">Urgente</option>
          <option value="Importante">Importante</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        {/* Colaborador */}
        <select
          aria-label="Colaborador"
          value={filters.colaborador}
          onChange={(e) => setFilters({ ...filters, colaborador: e.target.value })}
          className="w-full border p-2 rounded sm:col-span-2"
        >
          <option value="">Colaborador</option>
          {colaboradoresDisponibles.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Fecha desde */}
        <DatePicker
          selected={filters.fechaDesde}
          onChange={(date: Date | null) => setFilters({ ...filters, fechaDesde: date })}
          placeholderText="Fecha desde"
          dateFormat="yyyy-MM-dd"
          isClearable
          className="w-full border p-2 rounded"
          maxDate={filters.fechaHasta ?? undefined}
        />

        {/* Fecha hasta */}
        <DatePicker
          selected={filters.fechaHasta}
          onChange={(date: Date | null) => setFilters({ ...filters, fechaHasta: date })}
          placeholderText="Fecha hasta"
          dateFormat="yyyy-MM-dd"
          isClearable
          className="w-full border p-2 rounded"
          minDate={filters.fechaDesde ?? undefined}
        />
      </div>

      <div className="mt-4">
        <button
          onClick={applyFilters}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full sm:w-auto"
        >
          Aplicar Filtros
        </button>
      </div>
    </div>
  );
};

export default Filters;
