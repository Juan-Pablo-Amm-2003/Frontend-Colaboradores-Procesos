// src/features/tareas/ExcelUpload.tsx
import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';
// ⬇️ Ajustá esta ruta si tu client está en otro lado
import { uploadTareas } from '../tareas/api';

type Props = { onUploaded?: () => void };

const CANON = ['id_tarea_planner', 'estado', 'fecha_vencimiento'] as const;

const SYNONYMS: Record<(typeof CANON)[number], string[]> = {
  id_tarea_planner: [
    'id_tarea_planner','id','id tarea','id planner','id_tarea','task id','id de tarea','id de planner'
  ],
  estado: [
    'estado','status','progreso','avance','situacion','situación'
  ],
  fecha_vencimiento: [
    'fecha_vencimiento','fecha de vencimiento','vencimiento','fecha limite','fecha límite','due date'
  ],
};

const norm = (s: string) =>
  s.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');

const detectarCabeceras = (headersRaw: string[]) => {
  const headersNorm = headersRaw.map(norm);
  const map: Record<string, string | null> = { id_tarea_planner: null, estado: null, fecha_vencimiento: null };

  for (const key of CANON) {
    const found = SYNONYMS[key].find(syn => headersNorm.includes(norm(syn)));
    if (found) {
      const idx = headersNorm.indexOf(norm(found));
      map[key] = headersRaw[idx];
    }
  }
  const missing = CANON.filter(k => !map[k]);
  return { map, missing };
};

const renombrarCabecerasYCrearFile = (
  wb: XLSX.WorkBook,
  sheetName: string,
  rows: any[][],
  map: Record<string, string | null>
) => {
  const newRows = rows.slice();
  const hdr = (newRows[0] || []) as string[];

  for (const k of CANON) {
    const real = map[k];
    if (!real) continue;
    const idx = hdr.findIndex(h => String(h).trim() === real);
    if (idx >= 0) hdr[idx] = k;
  }

  const newWs = XLSX.utils.aoa_to_sheet(newRows);
  const newWb: XLSX.WorkBook = { SheetNames: [sheetName], Sheets: { [sheetName]: newWs } };
  const out = XLSX.write(newWb, { type: 'array', bookType: 'xlsx' });

  return new File([out], 'tareas_normalizadas.xlsx', {
    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  });
};

const ExcelUpload: React.FC<Props> = ({ onUploaded }) => {
  const [file, setFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');

  const onDrop = (accepted: File[]) => setFile(accepted[0] || null);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    // Opción compatible con cualquier versión de react-dropzone
    accept: ['.xlsx', '.xls'],
  });

  const validarYPreparar = async (f: File) => {
    const buffer = await f.arrayBuffer();
    const wb = XLSX.read(buffer, { type: 'buffer' });
    const sheetName = wb.SheetNames?.[0];
    const ws = sheetName ? wb.Sheets[sheetName] : undefined;
    if (!ws) return { error: 'No se encontró la primera hoja del Excel.' as string };

    // filas crudas para leer header real
    const rows: any[][] = XLSX.utils.sheet_to_json(ws, { header: 1, blankrows: false });
    const headerRow: string[] = (rows[0] || []).map((c) => String(c ?? '').trim());
    if (!headerRow.length) return { error: 'La primera fila está vacía o no contiene cabeceras.' as string };

    const { map, missing } = detectarCabeceras(headerRow);

    if (missing.length > 0) {
      return { error: `Faltan columnas obligatorias: ${missing.join(', ')}` as string };
    }

    const necesitaRenombrar = Object.entries(map).some(([canon, real]) => real && real !== canon);
    const finalFile = necesitaRenombrar ? renombrarCabecerasYCrearFile(wb, sheetName!, rows, map) : f;

    return { finalFile };
  };

  const handleUpload = async () => {
    if (!file) return;

    setMensaje('⏳ Validando archivo...');
    const { error, finalFile } = await validarYPreparar(file);

    if (error) {
      toast.error(`❌ ${error}`);
      setMensaje('');
      return;
    }

    setMensaje('⏳ Subiendo archivo...');
    try {
      const result = await uploadTareas(finalFile!);
      setMensaje(`✅ ${result?.tareas_cargadas ?? 0} tareas cargadas con éxito`);
      toast.success('Archivo subido correctamente');
      onUploaded?.();
      setFile(null);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al subir el archivo');
      toast.error('Error al subir el archivo');
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <h3 className="text-lg font-semibold mb-4">Carga de Excel</h3>

      <div
        {...getRootProps({
          className:
            'border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer hover:bg-gray-50 transition',
        })}
      >
        <input {...getInputProps()} />
        <p className="text-center text-gray-500">
          Arrastrá y soltá un archivo aquí, o hacé clic para seleccionar uno (.xlsx / .xls)
        </p>
      </div>

      {file && <p className="text-center mt-2 text-sm text-gray-600">{file.name}</p>}

      <button
        onClick={handleUpload}
        disabled={!file}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4 disabled:opacity-50"
      >
        Subir archivo
      </button>

      {mensaje && <p className="text-center mt-2 text-sm">{mensaje}</p>}
    </div>
  );
};

export default ExcelUpload;
