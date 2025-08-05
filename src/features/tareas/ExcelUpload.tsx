import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { uploadTareas } from '../tareas/api';

const ExcelUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [mensaje, setMensaje] = useState('');

  const onDrop = (acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleUpload = async () => {
    if (!file) return;
    setMensaje('⏳ Subiendo archivo...');
    try {
      const result = await uploadTareas(file);
      setMensaje(`✅ ${result.tareas_cargadas} tareas cargadas con éxito`);
    } catch (err) {
      console.error(err);
      setMensaje('❌ Error al subir el archivo');
    }
  };

  return (
    <div className="bg-white p-4 shadow rounded mb-4">
      <h3 className="text-lg font-semibold mb-4">Carga de Excel</h3>
      <div {...getRootProps({ className: 'border-dashed border-2 border-gray-300 p-4 rounded cursor-pointer' })}>
        <input {...getInputProps()} />
        <p className="text-center text-gray-500">Arrastra y suelta un archivo aquí, o haz clic para seleccionar uno</p>
      </div>
      {file && <p className="text-center mt-2">{file.name}</p>}
      <button onClick={handleUpload} disabled={!file} className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded mt-4">
        Subir archivo
      </button>
      {mensaje && <p className="text-center mt-2 text-sm">{mensaje}</p>}
    </div>
  );
};

export default ExcelUpload;
