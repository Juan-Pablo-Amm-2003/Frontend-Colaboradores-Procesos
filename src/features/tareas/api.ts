import axios from "axios";

const api = axios.create({
  baseURL: "http://127.0.0.1:8000",
});

export const uploadTareas = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post("/upload-tareas", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

export const getTareasFiltradas = async (filtros: any) => {
  const res = await api.get("/tareas-filtradas", { params: filtros });
  return res.data;
};
