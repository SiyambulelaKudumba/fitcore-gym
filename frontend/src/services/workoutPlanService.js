import api from "./api";

export const getAllPlans = () => api.get("/workoutplans").then((r) => r.data);
export const getPlan = (id) => api.get(`/workoutplans/${id}`).then((r) => r.data);
export const getMyPlans = () => api.get("/trainers/me/workoutplans").then((r) => r.data);
export const createPlan = (data) => api.post("/workoutplans", data).then((r) => r.data);
export const updatePlan = (id, data) => api.put(`/workoutplans/${id}`, data).then((r) => r.data);
export const deletePlan = (id) => api.delete(`/workoutplans/${id}`);

const workoutPlanService = {
  getAll: getAllPlans,
  getById: getPlan,
  getMyPlans,
  create: createPlan,
  update: updatePlan,
  delete: deletePlan,
};
export default workoutPlanService;