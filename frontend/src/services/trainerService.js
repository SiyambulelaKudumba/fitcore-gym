import api from "./api";

export const getTrainers = (search = "", searchBy = "name") => {
  const params = {};
  if (search) params.search = search;
  if (searchBy) params.searchBy = searchBy;
  return api.get("/trainers", { params }).then((r) => r.data);
};
export const getTrainer = (id) => api.get(`/trainers/${id}`).then((r) => r.data);
export const createTrainer = (data) => api.post("/trainers", data).then((r) => r.data);
export const updateTrainer = (id, data) => api.put(`/trainers/${id}`, data).then((r) => r.data);
export const deleteTrainer = (id) => api.delete(`/trainers/${id}`);
export const getMyMembers = () => api.get("/trainers/me/members").then((r) => r.data);
export const getMemberProgrammes = (memberId) => api.get(`/trainers/me/members/${memberId}/programmes`).then((r) => r.data);

const trainerService = {
  getAll: getTrainers, getById: getTrainer, create: createTrainer, update: updateTrainer, delete: deleteTrainer,
  getMyMembers, getMemberProgrammes,
};
export default trainerService;