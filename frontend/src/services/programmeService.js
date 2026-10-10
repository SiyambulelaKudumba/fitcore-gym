import api from "./api";

export const getProgrammes = () =>
  api.get("/programmes").then((r) => r.data);

export const getProgramme = (id) =>
  api.get(`/programmes/${id}`).then((r) => r.data);

export const createProgramme = (data) =>
  api.post("/programmes", data).then((r) => r.data);

export const updateProgramme = (id, data) =>
  api.put(`/programmes/${id}`, data).then((r) => r.data);

export const deleteProgramme = (id) => api.delete(`/programmes/${id}`);

const programmeService = {
  getAll: getProgrammes,
  getById: getProgramme,
  create: createProgramme,
  update: updateProgramme,
  delete: deleteProgramme,
};

export default programmeService;