import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";
import html2canvas from "html2canvas";

type Filtros = {
  estado?: string;
  prioridad?: string;
  colaborador?: string;
  fechaDesde?: string;
  fechaHasta?: string;
};

const A4 = { w: 210, h: 297 };
const MARGIN = 10;

async function captureToImg(id: string): Promise<{ img: string; w: number; h: number } | null> {
  const node = document.getElementById(id);
  if (!node) return null;
  const canvas = await html2canvas(node, { scale: 2, backgroundColor: "#fff", useCORS: true, logging: false });
  const img = canvas.toDataURL("image/png");
  const ratio = canvas.height / canvas.width;
  const w = A4.w - MARGIN * 2;
  const h = w * ratio;
  return { img, w, h };
}

function header(pdf: jsPDF, filtros: Filtros) {
  pdf.setFontSize(16);
  pdf.text(`Reporte de Tareas – ${new Date().toLocaleDateString()}`, MARGIN, 18);
  pdf.setFontSize(10);
  const parts = [
    filtros.estado && `Estado: ${filtros.estado}`,
    filtros.prioridad && `Prioridad: ${filtros.prioridad}`,
    filtros.colaborador && `Colaborador: ${filtros.colaborador}`,
    filtros.fechaDesde && `Desde: ${new Date(filtros.fechaDesde).toLocaleDateString()}`,
    filtros.fechaHasta && `Hasta: ${new Date(filtros.fechaHasta).toLocaleDateString()}`,
  ].filter(Boolean) as string[];
  pdf.text(parts.join("   ") || "Sin filtros aplicados", MARGIN, 26);
}

function paginate(pdf: jsPDF) {
  const pages = pdf.getNumberOfPages();
  pdf.setFontSize(9);
  for (let p = 1; p <= pages; p++) {
    pdf.setPage(p);
    pdf.text(`Página ${p} de ${pages}`, A4.w - MARGIN, A4.h - 6, { align: "right" });
  }
}

export async function exportDashboardPdf(opts: {
  filtros: Filtros;
  tareas: any[];
  fileName?: string;
  blockIds?: string[]; // por defecto: cards + 3 charts + alerts
}) {
  const { filtros, tareas, fileName = "Dashboard_Tareas", blockIds } = opts;
  const pdf = new jsPDF("p", "mm", "a4");
  let y = MARGIN;

  header(pdf, filtros);
  y = 32;

  const ids = blockIds ?? ["cards", "chart-prioridad", "chart-colaboradores", "chart-evolucion", "alerts"];
  for (const id of ids) {
    const snap = await captureToImg(id);
    if (!snap) continue;
    if (y + snap.h > A4.h - MARGIN) { pdf.addPage(); y = MARGIN; }
    pdf.addImage(snap.img, "PNG", MARGIN, y, snap.w, snap.h);
    y += snap.h + 6;
  }

  if (tareas?.length) {
    if (y > A4.h - 60) { pdf.addPage(); y = MARGIN; }
    const head = [["Nombre", "Colaborador", "Estado", "Prioridad", "Vencimiento"]];
    const body: RowInput[] = tareas.map((t) => [
      (t.nombre_tarea || t.nombre || t.titulo || t.id_tarea_planner || "—").toString(),
      (t.colaborador || "Sin asignar").toString(),
      (t.estado || "—").toString(),
      (t.prioridad || "—").toString(),
      t.fecha_vencimiento ? new Date(t.fecha_vencimiento).toLocaleDateString() : "—",
    ]);
    autoTable(pdf, {
      startY: y,
      head, body,
      styles: { fontSize: 8, cellPadding: 2 },
      headStyles: { fillColor: [245, 245, 245] },
      theme: "striped",
      margin: { left: MARGIN, right: MARGIN },
    });
  }

  paginate(pdf);
  pdf.save(`${fileName}.pdf`);
}