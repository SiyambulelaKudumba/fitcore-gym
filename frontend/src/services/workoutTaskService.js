import api from "./api";

export const getAllTasks = () =>
  api.get("/workouttasks").then((r) => r.data);

export const getTask = (id) =>
  api.get(`/workouttasks/${id}`).then((r) => r.data);

export const getTasksByPlan = (planId) =>
  api.get(`/workouttasks/plan/${planId}`).then((r) => r.data);

export const createTask = (data) =>
  api.post("/workouttasks", data).then((r) => r.data);

export const updateTask = (id, data) =>
  api.put(`/workouttasks/${id}`, data).then((r) => r.data);

export const updateTaskStatus = (id, status) =>
  api.put(`/workouttasks/${id}/status`, { status }).then((r) => r.data);

export const deleteTask = (id) => api.delete(`/workouttasks/${id}`);

const workoutTaskService = {
  getAll: getAllTasks,
  getById: getTask,
  getByPlan: getTasksByPlan,
  create: createTask,
  update: updateTask,
  updateStatus: updateTaskStatus,
  delete: deleteTask,
};

export default workoutTaskService;