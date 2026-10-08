import api from './api';

// ⚠️ TEMPORARY MOCK — remove when backend is ready
const USE_MOCK = true;

let MOCK_PLANS = [
  { id: 1, name: 'Test Member Weight Loss Plan', description: 'Beginner weight loss routine', memberId: 1, memberName: 'Test Member', trainerId: 1, trainerName: 'Thabo Mokoena', trainingProgrammeId: 1, trainingProgrammeName: 'Weight Loss', createdDate: '2026-10-06' },
  { id: 2, name: 'Sarah Muscle Building Plan', description: 'Hypertrophy focused plan', memberId: 2, memberName: 'Sarah Naidoo', trainerId: 2, trainerName: 'Aisha Patel', trainingProgrammeId: 2, trainingProgrammeName: 'Muscle Building', createdDate: '2026-10-06' },
];

const workoutPlanService = {
  getAll: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_PLANS];
    }
    const response = await api.get('/workoutplans');
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_PLANS.find((p) => p.id === id);
    }
    const response = await api.get(`/workoutplans/${id}`);
    return response.data;
  },

  getMyPlans: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      // Trainer sees only their own — filter by trainerId 1 (Thabo)
      return MOCK_PLANS.filter((p) => p.trainerId === 1);
    }
    const response = await api.get('/workoutplans/trainer/me');
    return response.data;
  },

  getByMember: async (memberId) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_PLANS.filter((p) => p.memberId === Number(memberId));
    }
    const response = await api.get(`/workoutplans/member/${memberId}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const newPlan = { id: Date.now(), ...data, createdDate: new Date().toISOString() };
      MOCK_PLANS.push(newPlan);
      return newPlan;
    }
    const response = await api.post('/workoutplans', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      const idx = MOCK_PLANS.findIndex((p) => p.id === id);
      if (idx >= 0) MOCK_PLANS[idx] = { ...MOCK_PLANS[idx], ...data };
      return MOCK_PLANS[idx];
    }
    const response = await api.put(`/workoutplans/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      MOCK_PLANS = MOCK_PLANS.filter((p) => p.id !== id);
      return;
    }
    await api.delete(`/workoutplans/${id}`);
  },
};

export default workoutPlanService;