import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Props {
  onApplyFilters: (filters: any) => void;
  colaboradoresDisponibles: string[];
}

const Filters: React.FC<Props> = ({ onApplyFilters, colaboradoresDisponibles }) => {
  const [estado, setEstado] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [colaborador, setColaborador] = useState('');
  const [fechaDesde, setFechaDesde] = useState<Date | null>(null);
  const [fechaHasta, setFechaHasta] = useState<Date | null>(null);

  const applyFilters = () => {
    const filtros: any = {};
    if (estado) filtros.estado = estado;
    if (prioridad) filtros.prioridad = prioridad;
    if (colaborador) filtros.completado_por = colaborador; // ⬅ correcto
    if (fechaDesde) filtros.fechaDesde = fechaDesde.toISOString();
    if (fechaHasta) filtros.fechaHasta = fechaHasta.toISOString();

    onApplyFilters(filtros);
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <h3 className="text-lg font-semibold mb-4">Filtros</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <select value={estado} onChange={(e) => setEstado(e.target.value)} className="border p-2 rounded">
          <option value="">Estado</option>
          <option value="No iniciado">No iniciado</option>
          <option value="En curso">En curso</option>
          <option value="Completado">Completado</option>
        </select>

        <select value={prioridad} onChange={(e) => setPrioridad(e.target.value)} className="border p-2 rounded">
          <option value="">Prioridad</option>
          <option value="Alta">Alta</option>
          <option value="Media">Media</option>
          <option value="Baja">Baja</option>
        </select>

        <select
          value={colaborador}
          onChange={(e) => setColaborador(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Colaborador</option>
          {colaboradoresDisponibles.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <DatePicker
          selected={fechaDesde}
          onChange={(date) => setFechaDesde(date)}
          placeholderText="Fecha desde"
          className="border p-2 rounded"
        />
        <DatePicker
          selected={fechaHasta}
          onChange={(date) => setFechaHasta(date)}
          placeholderText="Fecha hasta"
          className="border p-2 rounded"
        />
      </div>

      <button
        onClick={applyFilters}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4"
      >
        Aplicar Filtros
      </button>
    </div>
  );
};

export default Filters;
