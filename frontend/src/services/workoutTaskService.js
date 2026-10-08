import api from './api';

// ⚠️ TEMPORARY MOCK — remove when backend is ready
const USE_MOCK = true;

let MOCK_TASKS = [
  { id: 1, exerciseName: 'Treadmill Run', description: 'Run at moderate pace', numberOfSets: 1, numberOfRepetitions: 1, dueDate: '2026-10-15', status: 'NotStarted', workoutPlanId: 1, workoutPlanName: 'Test Member Weight Loss Plan', memberId: 1 },
  { id: 2, exerciseName: 'Squats', description: 'Keep back straight', numberOfSets: 3, numberOfRepetitions: 12, dueDate: '2026-10-16', status: 'InProgress', workoutPlanId: 1, workoutPlanName: 'Test Member Weight Loss Plan', memberId: 1 },
  { id: 3, exerciseName: 'Plank', description: 'Hold for 60 seconds', numberOfSets: 3, numberOfRepetitions: 1, dueDate: '2026-10-17', status: 'Complete', workoutPlanId: 1, workoutPlanName: 'Test Member Weight Loss Plan', memberId: 1 },
  { id: 4, exerciseName: 'Bench Press', description: 'Warm up first', numberOfSets: 4, numberOfRepetitions: 8, dueDate: '2026-10-18', status: 'NotStarted', workoutPlanId: 2, workoutPlanName: 'Sarah Muscle Building Plan', memberId: 2 },
];

const workoutTaskService = {
  getAll: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_TASKS];
    }
    const response = await api.get('/workouttasks');
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/workouttasks/${id}`);
    return response.data;
  },

  // GET /workouttasks/plan/{planId}?status=...
  getByPlan: async (planId, status) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      let filtered = MOCK_TASKS.filter((t) => t.workoutPlanId === Number(planId));
      if (status) filtered = filtered.filter((t) => t.status === status);
      return filtered;
    }
    const params = status ? { status } : {};
    const response = await api.get(`/workouttasks/plan/${planId}`, { params });
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const newTask = {
        id: Date.now(),
        ...data,
        status: 'NotStarted',
        workoutPlanName: 'Plan #' + data.workoutPlanId,
        memberId: 1,
      };
      MOCK_TASKS.push(newTask);
      return newTask;
    }
    const response = await api.post('/workouttasks', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const idx = MOCK_TASKS.findIndex((t) => t.id === id);
      if (idx >= 0) MOCK_TASKS[idx] = { ...MOCK_TASKS[idx], ...data };
      return MOCK_TASKS[idx];
    }
    const response = await api.put(`/workouttasks/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      MOCK_TASKS = MOCK_TASKS.filter((t) => t.id !== id);
      return;
    }
    await api.delete(`/workouttasks/${id}`);
  },

  updateStatus: async (id, status) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const idx = MOCK_TASKS.findIndex((t) => t.id === id);
      if (idx >= 0) MOCK_TASKS[idx] = { ...MOCK_TASKS[idx], status };
      return MOCK_TASKS[idx];
    }
    const response = await api.patch(`/workouttasks/${id}/status`, { status });
    return response.data;
  },
};

export default workoutTaskService;