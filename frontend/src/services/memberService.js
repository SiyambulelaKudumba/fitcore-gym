import api from './api';

// ⚠️ TEMPORARY MOCK — remove when backend is ready
const USE_MOCK = true;

const MOCK_MEMBERS = [
  { id: 1, memberNumber: 'M0001', firstName: 'Test', lastName: 'Member', gender: 'Male', dateOfBirth: '1990-01-01', homeAddress: '123 Main St', email: 'member@fitcore.co.za', phoneNumber: '0821234567', membershipType: 'Monthly', joinDate: '2026-10-06', trainerId: 1, trainerName: 'Thabo Mokoena', trainingProgrammeId: 1, trainingProgrammeName: 'Weight Loss' },
  { id: 2, memberNumber: 'M0002', firstName: 'Sarah', lastName: 'Naidoo', gender: 'Female', dateOfBirth: '1992-05-15', homeAddress: '45 Oak Ave', email: 'sarah@fitcore.co.za', phoneNumber: '0839876543', membershipType: 'Quarterly', joinDate: '2026-10-06', trainerId: 2, trainerName: 'Aisha Patel', trainingProgrammeId: 2, trainingProgrammeName: 'Muscle Building' },
];

const MOCK_TASKS = [
  { id: 1, exerciseName: 'Treadmill Run', description: 'Run at moderate pace', numberOfSets: 1, numberOfRepetitions: 1, dueDate: '2026-10-15', status: 'NotStarted', workoutPlanId: 1, workoutPlanName: 'Test Member Weight Loss Plan', memberId: 1 },
  { id: 2, exerciseName: 'Squats', description: 'Keep back straight', numberOfSets: 3, numberOfRepetitions: 12, dueDate: '2026-10-16', status: 'InProgress', workoutPlanId: 1, workoutPlanName: 'Test Member Weight Loss Plan', memberId: 1 },
  { id: 3, exerciseName: 'Plank', description: 'Hold for 60 seconds', numberOfSets: 3, numberOfRepetitions: 1, dueDate: '2026-10-17', status: 'Complete', workoutPlanId: 1, workoutPlanName: 'Test Member Weight Loss Plan', memberId: 1 },
];

const MOCK_PLANS = [
  { id: 1, name: 'Test Member Weight Loss Plan', description: 'Beginner weight loss routine', memberId: 1, memberName: 'Test Member', trainerId: 1, trainerName: 'Thabo Mokoena', trainingProgrammeId: 1, trainingProgrammeName: 'Weight Loss', createdDate: '2026-10-06' },
];

const MOCK_PROGRAMME = {
  id: 1,
  name: 'Weight Loss',
  description: 'Fat loss and cardio plan',
  duration: '12 weeks',
  fitnessGoal: 'WeightLoss',
};

const memberService = {
  // ============= ADMIN =============
  getAll: async (search, searchBy) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 200));
      if (!search) return MOCK_MEMBERS;
      const q = search.toLowerCase();
      return MOCK_MEMBERS.filter((m) => {
        if (searchBy === 'memberNumber') return m.memberNumber.toLowerCase().includes(q);
        if (searchBy === 'name') return m.firstName.toLowerCase().includes(q);
        if (searchBy === 'surname') return m.lastName.toLowerCase().includes(q);
        return (
          m.memberNumber.toLowerCase().includes(q) ||
          m.firstName.toLowerCase().includes(q) ||
          m.lastName.toLowerCase().includes(q)
        );
      });
    }
    const params = {};
    if (search) params.search = search;
    if (searchBy) params.searchBy = searchBy;
    const response = await api.get('/members', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/members/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/members', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/members/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    await api.delete(`/members/${id}`);
  },

  assignTrainer: async (id, trainerId) => {
    const response = await api.put(`/members/${id}/trainer`, { trainerId });
    return response.data;
  },

  assignProgramme: async (id, trainingProgrammeId) => {
    const response = await api.put(`/members/${id}/programme`, { trainingProgrammeId });
    return response.data;
  },

  // ============= MEMBER (self) =============
  getMyTasks: async (status) => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return status ? MOCK_TASKS.filter((t) => t.status === status) : MOCK_TASKS;
    }
    const params = status ? { status } : {};
    const response = await api.get('/members/me/workouttasks', { params });
    return response.data;
  },

  getMyPlans: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_PLANS;
    }
    const response = await api.get('/members/me/workoutplans');
    return response.data;
  },

  getMyProgramme: async () => {
    if (USE_MOCK) {
      await new Promise((r) => setTimeout(r, 300));
      return MOCK_PROGRAMME;
    }
    const response = await api.get('/members/me/programme');
    return response.data;
  },
};

export default memberService;