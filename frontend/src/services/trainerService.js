import api from "./api";

export const getTrainers = (search = "", searchBy = "name") =>
  api.get("/trainers", { params: { search, searchBy } }).then((r) => r.data);

export const getTrainer = (id) => api.get(`/trainers/${id}`).then((r) => r.data);
export const createTrainer = (data) => api.post("/trainers", data).then((r) => r.data);
export const updateTrainer = (id, data) => api.put(`/trainers/${id}`, data).then((r) => r.data);
export const deleteTrainer = (id) => api.delete(`/trainers/${id}`);