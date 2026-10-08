import api from './api';

// ⚠️ TEMPORARY MOCK — remove when backend is ready
const USE_MOCK = true;

let MOCK_PROGRAMMES = [
  { id: 1, name: 'Weight Loss', description: 'Fat loss and cardio plan', duration: '12 weeks', fitnessGoal: 'WeightLoss' },
  { id: 2, name: 'Muscle Building', description: 'Hypertrophy focused plan', duration: '8 weeks', fitnessGoal: 'MuscleBuilding' },
  { id: 3, name: 'General Fitness', description: 'Balanced fitness plan', duration: '6 weeks', fitnessGoal: 'GeneralFitness' },
];

const programmeService = {
  getAll: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return [...MOCK_PROGRAMMES];
    }
    const response = await api.get('/programmes');
    return response.data;
  },

  getById: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      return MOCK_PROGRAMMES.find((p) => p.id === id);
    }
    const response = await api.get(`/programmes/${id}`);
    return response.data;
  },

  create: async (data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const newProg = { id: Date.now(), ...data };
      MOCK_PROGRAMMES.push(newProg);
      return newProg;
    }
    const response = await api.post('/programmes', data);
    return response.data;
  },

  update: async (id, data) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      const idx = MOCK_PROGRAMMES.findIndex((p) => p.id === id);
      if (idx >= 0) MOCK_PROGRAMMES[idx] = { ...MOCK_PROGRAMMES[idx], ...data };
      return MOCK_PROGRAMMES[idx];
    }
    const response = await api.put(`/programmes/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      MOCK_PROGRAMMES = MOCK_PROGRAMMES.filter((p) => p.id !== id);
      return;
    }
    await api.delete(`/programmes/${id}`);
  },
};

export default programmeService;