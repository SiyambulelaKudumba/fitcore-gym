import { http, HttpResponse } from "msw";

const fakeUser = {
  id: "abc-123",
  email: "admin@fitcore.co.za",
  role: "Admin",
  memberId: null,
  trainerId: null,
  firstName: "Admin",
  lastName: "User",
};

export const handlers = [
  http.post("https://localhost:7001/api/auth/login", async ({ request }) => {
    const body = await request.json();
    if (body.email === "admin@fitcore.co.za" && body.password === "Admin@123") {
      return HttpResponse.json({ token: "fake-jwt-token", user: fakeUser });
    }
    return HttpResponse.json(
      { status: 401, message: "Invalid email or password", errors: {} },
      { status: 401 }
    );
  }),

  http.get("https://localhost:7001/api/members", () =>
    HttpResponse.json([
      { id: 1, memberNumber: "M0001", firstName: "Test", lastName: "Member",
        email: "member@fitcore.co.za", membershipType: "Monthly", trainerName: "Thabo Mokoena" },
      { id: 2, memberNumber: "M0002", firstName: "Sarah", lastName: "Naidoo",
        email: "sarah@fitcore.co.za", membershipType: "Quarterly", trainerName: "Aisha Patel" },
    ])
  ),

  http.get("https://localhost:7001/api/trainers", () =>
    HttpResponse.json([
      { id: 1, staffNumber: "T0001", firstName: "Thabo", lastName: "Mokoena",
        email: "trainer@fitcore.co.za", specialization: "StrengthAndConditioning" },
      { id: 2, staffNumber: "T0002", firstName: "Aisha", lastName: "Patel",
        email: "aisha@fitcore.co.za", specialization: "GeneralFitness" },
    ])
  ),

  http.get("https://localhost:7001/api/programmes", () =>
    HttpResponse.json([
      { id: 1, name: "Weight Loss", description: "Fat loss plan", duration: "12 weeks", fitnessGoal: "WeightLoss" },
      { id: 2, name: "Muscle Building", description: "Hypertrophy plan", duration: "8 weeks", fitnessGoal: "MuscleBuilding" },
    ])
  ),
];