import api from "./api";

export const getMembers = (search = "", searchBy = "name") =>
  api.get("/members", { params: { search, searchBy } }).then((r) => r.data);

export const getMember = (id) => api.get(`/members/${id}`).then((r) => r.data);
export const createMember = (data) => api.post("/members", data).then((r) => r.data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data).then((r) => r.data);
export const deleteMember = (id) => api.delete(`/members/${id}`);
export const assignTrainer = (id, trainerId) =>
  api.put(`/members/${id}/trainer`, { trainerId }).then((r) => r.data);
export const assignProgramme = (id, trainingProgrammeId) =>
  api.put(`/members/${id}/programme`, { trainingProgrammeId }).then((r) => r.data);