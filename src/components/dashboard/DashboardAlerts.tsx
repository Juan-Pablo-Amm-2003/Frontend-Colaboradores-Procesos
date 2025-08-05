const DashboardAlerts = ({ tareas }: { tareas: any[] }) => {
  const sinColaborador = tareas.filter(t => !t.completado_por);
  const vencidas = tareas.filter(t => {
    const fecha = new Date(t.fecha_vencimiento);
    return t.estado !== 'Completado' && fecha < new Date();
  });
  const tareasLargas = tareas.filter(t => {
    if (!t.fecha_creacion || !t.fecha_finalizacion) return false;
    const inicio = new Date(t.fecha_creacion).getTime();
    const fin = new Date(t.fecha_finalizacion).getTime();
    const dias = (fin - inicio) / (1000 * 60 * 60 * 24);
    return dias > 30;
  });

  return (
    <div className="bg-white p-4 shadow rounded space-y-2">
      <h3 className="text-lg font-semibold text-red-600">Alertas</h3>
      {sinColaborador.length > 0 && (
        <p>🚨 {sinColaborador.length} tareas sin colaborador asignado</p>
      )}
      {vencidas.length > 0 && (
        <p>🕒 {vencidas.length} tareas vencidas sin completar</p>
      )}
      {tareasLargas.length > 0 && (
        <p>⏳ {tareasLargas.length} tareas con más de 30 días de duración</p>
      )}
      {sinColaborador.length === 0 && vencidas.length === 0 && tareasLargas.length === 0 && (
        <p className="text-green-600">✅ No hay alertas en este momento</p>
      )}
    </div>
  );
};

export default DashboardAlerts;
