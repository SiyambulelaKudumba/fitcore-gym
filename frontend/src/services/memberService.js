import api from "./api";

export const getMembers = (search = "", searchBy = "name") => {
  const params = {};
  if (search) params.search = search;
  if (searchBy) params.searchBy = searchBy;
  return api.get("/members", { params }).then((r) => r.data);
};
export const getMember = (id) => api.get(`/members/${id}`).then((r) => r.data);
export const createMember = (data) => api.post("/members", data).then((r) => r.data);
export const updateMember = (id, data) => api.put(`/members/${id}`, data).then((r) => r.data);
export const deleteMember = (id) => api.delete(`/members/${id}`);
export const assignTrainer = (id, trainerId) => api.put(`/members/${id}/trainer`, { trainerId }).then((r) => r.data);
export const assignProgramme = (id, trainingProgrammeId) => api.put(`/members/${id}/programme`, { trainingProgrammeId }).then((r) => r.data);
export const getMyTasks = (status) => {
  const params = status ? { status } : {};
  return api.get("/members/me/workouttasks", { params }).then((r) => r.data);
};
export const getMyPlans = () => api.get("/members/me/workoutplans").then((r) => r.data);
export const getMyProgramme = () => api.get("/members/me/programme").then((r) => r.data);

const memberService = {
  getAll: getMembers, getById: getMember, create: createMember, update: updateMember, delete: deleteMember,
  assignTrainer, assignProgramme, getMyTasks, getMyPlans, getMyProgramme,
};
export default memberService;