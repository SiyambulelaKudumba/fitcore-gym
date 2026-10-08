import api from './api';

// ⚠️ TEMPORARY MOCK — remove when backend is ready
const USE_MOCK = true;

const MOCK_TRAINERS = [
  { id: 1, staffNumber: 'T0001', firstName: 'Thabo', lastName: 'Mokoena', gender: 'Male', email: 'trainer@fitcore.co.za', phoneNumber: '0711111111', specialization: 'StrengthAndConditioning' },
  { id: 2, staffNumber: 'T0002', firstName: 'Aisha', lastName: 'Patel', gender: 'Female', email: 'aisha@fitcore.co.za', phoneNumber: '0722222222', specialization: 'GeneralFitness' },
];

const MOCK_MEMBERS = [
  { id: 1, memberNumber: 'M0001', firstName: 'Test', lastName: 'Member', email: 'member@fitcore.co.za', phoneNumber: '0821234567', membershipType: 'Monthly', trainerId: 1, trainerName: 'Thabo Mokoena', trainingProgrammeId: 1, trainingProgrammeName: 'Weight Loss' },
];

const MOCK_MEMBER_PROGRAMMES = {
  1: [
    { id: 1, name: 'Weight Loss', description: 'Fat loss and cardio plan', duration: '12 weeks', fitnessGoal: 'WeightLoss' },
  ],
};

const trainerService = {
  // ============= ADMIN =============
  getAll: async (search, searchBy) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      if (!search) return MOCK_TRAINERS;
      const q = search.toLowerCase();
      return MOCK_TRAINERS.filter((t) => {
        if (searchBy === 'staffNumber') return t.staffNumber.toLowerCase().includes(q);
        if (searchBy === 'name') return t.firstName.toLowerCase().includes(q);
        if (searchBy === 'surname') return t.lastName.toLowerCase().includes(q);
        return (
          t.staffNumber.toLowerCase().includes(q) ||
          t.firstName.toLowerCase().includes(q) ||
          t.lastName.toLowerCase().includes(q)
        );
      });
    }
    const params = {};
    if (search) params.search = search;
    if (searchBy) params.searchBy = searchBy;
    const response = await api.get('/trainers', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/trainers/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/trainers', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/trainers/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/trainers/${id}`);
  },

  // ============= TRAINER (self) =============
  getMyMembers: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_MEMBERS;
    }
    const response = await api.get('/trainers/me/members');
    return response.data;
  },

  getMemberProgrammes: async (memberId) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_MEMBER_PROGRAMMES[memberId] || [];
    }
    const response = await api.get(`/trainers/me/members/${memberId}/programmes`);
    return response.data;
  },
};

export default trainerService;