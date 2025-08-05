import React, { useState } from 'react';

const TaskTable = ({ tareas = [] }: { tareas?: any[] }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const tareasPorPagina = 5;

  const totalPaginas = Math.ceil(tareas.length / tareasPorPagina);
  const startIndex = (currentPage - 1) * tareasPorPagina;
  const tareasMostradas = tareas.slice(startIndex, startIndex + tareasPorPagina);

  const cambiarPagina = (nuevaPagina: number) => {
    if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) {
      setCurrentPage(nuevaPagina);
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded mt-8">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Lista de Tareas</h3>

      {tareas.length === 0 ? (
        <p className="text-gray-500 text-center">No hay tareas para mostrar.</p>
      ) : (
        <>
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Nombre</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Colaborador</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Estado</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Prioridad</th>
                <th className="px-4 py-2 text-left font-medium text-gray-600 uppercase">Vencimiento</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {tareasMostradas.map((task, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-4 py-3">{task.nombre_tarea || 'Sin nombre'}</td>
                  <td className="px-4 py-3">{task.completado_por || 'Sin colaborador'}</td>
                  <td className="px-4 py-3">{task.estado}</td>
                  <td className="px-4 py-3">{task.prioridad}</td>
                  <td className="px-4 py-3">
                    {task.fecha_vencimiento
                      ? new Date(task.fecha_vencimiento).toLocaleDateString()
                      : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Paginación */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => cambiarPagina(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-gray-600">
              Página {currentPage} de {totalPaginas}
            </span>
            <button
              onClick={() => cambiarPagina(currentPage + 1)}
              disabled={currentPage === totalPaginas}
              className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default TaskTable;
