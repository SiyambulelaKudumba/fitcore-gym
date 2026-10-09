using FitCore.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FitCore.Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(IServiceProvider services)
    {
        var context = services.GetRequiredService<ApplicationDbContext>();
        var userManager = services.GetRequiredService<UserManager<ApplicationUser>>();
        var roleManager = services.GetRequiredService<RoleManager<IdentityRole>>();

        // 1. Apply any pending migrations
        await context.Database.MigrateAsync();

        // 2. Seed roles
        await SeedRolesAsync(roleManager);

        // 3. Seed data (only if empty)
        if (!await context.Members.AnyAsync())
        {
            await SeedUsersAndDataAsync(context, userManager);
        }
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = { "Admin", "Member", "Trainer" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private static async Task SeedUsersAndDataAsync(ApplicationDbContext context, UserManager<ApplicationUser> userManager)
    {
        // ---------------- Trainers ----------------
        var trainers = new List<Trainer>
        {
            new()
            {
                StaffNumber = "T0001",
                FirstName = "Thabo",
                LastName = "Mokoena",
                Gender = Gender.Male,
                Email = "trainer@fitcore.co.za",
                PhoneNumber = "0711111111",
                Specialization = Specialization.StrengthAndConditioning
            },
            new()
            {
                StaffNumber = "T0002",
                FirstName = "Aisha",
                LastName = "Patel",
                Gender = Gender.Female,
                Email = "aisha@fitcore.co.za",
                PhoneNumber = "0722222222",
                Specialization = Specialization.GeneralFitness
            }
        };
        context.Trainers.AddRange(trainers);
        await context.SaveChangesAsync();

        // ---------------- Training Programmes ----------------
        var programmes = new List<TrainingProgramme>
        {
            new() { Name = "Weight Loss", Description = "Fat loss and cardio plan", Duration = "12 weeks", FitnessGoal = FitnessGoal.WeightLoss },
            new() { Name = "Muscle Building", Description = "Hypertrophy focused plan", Duration = "8 weeks", FitnessGoal = FitnessGoal.MuscleBuilding },
            new() { Name = "General Fitness", Description = "Balanced fitness plan", Duration = "6 weeks", FitnessGoal = FitnessGoal.GeneralFitness }
        };
        context.TrainingProgrammes.AddRange(programmes);
        await context.SaveChangesAsync();

        // ---------------- Members ----------------
        var members = new List<Member>
        {
            new()
            {
                MemberNumber = "M0001",
                FirstName = "Test",
                LastName = "Member",
                Gender = Gender.Male,
                DateOfBirth = new DateTime(1990, 1, 1),
                HomeAddress = "123 Main St",
                Email = "member@fitcore.co.za",
                PhoneNumber = "0821234567",
                MembershipType = MembershipType.Monthly,
                JoinDate = new DateTime(2026, 10, 6),
                TrainerId = trainers[0].Id,
                TrainingProgrammeId = programmes[0].Id
            },
            new()
            {
                MemberNumber = "M0002",
                FirstName = "Sarah",
                LastName = "Naidoo",
                Gender = Gender.Female,
                DateOfBirth = new DateTime(1992, 5, 15),
                HomeAddress = "45 Oak Ave",
                Email = "sarah@fitcore.co.za",
                PhoneNumber = "0839876543",
                MembershipType = MembershipType.Quarterly,
                JoinDate = new DateTime(2026, 10, 6),
                TrainerId = trainers[1].Id,
                TrainingProgrammeId = programmes[1].Id
            }
        };
        context.Members.AddRange(members);
        await context.SaveChangesAsync();

        // ---------------- ApplicationUsers ----------------
        // Admin
        await CreateUserAsync(userManager, "admin@fitcore.co.za", "Admin@123",
            "Admin", "User", UserRole.Admin, null, null);

        // Member 1
        await CreateUserAsync(userManager, "member@fitcore.co.za", "Member@123",
            "Test", "Member", UserRole.Member, members[0].Id, null);
        members[0].UserId = (await userManager.FindByEmailAsync("member@fitcore.co.za"))!.Id;

        // Member 2
        await CreateUserAsync(userManager, "sarah@fitcore.co.za", "Member@123",
            "Sarah", "Naidoo", UserRole.Member, members[1].Id, null);
        members[1].UserId = (await userManager.FindByEmailAsync("sarah@fitcore.co.za"))!.Id;

        // Trainer 1
        await CreateUserAsync(userManager, "trainer@fitcore.co.za", "Trainer@123",
            "Thabo", "Mokoena", UserRole.Trainer, null, trainers[0].Id);
        trainers[0].UserId = (await userManager.FindByEmailAsync("trainer@fitcore.co.za"))!.Id;

        // Trainer 2
        await CreateUserAsync(userManager, "aisha@fitcore.co.za", "Trainer@123",
            "Aisha", "Patel", UserRole.Trainer, null, trainers[1].Id);
        trainers[1].UserId = (await userManager.FindByEmailAsync("aisha@fitcore.co.za"))!.Id;

        await context.SaveChangesAsync();

        // ---------------- Workout Plans ----------------
        var plans = new List<WorkoutPlan>
        {
            new()
            {
                Name = "Test Member Weight Loss Plan",
                Description = "Beginner weight loss program",
                MemberId = members[0].Id,
                TrainerId = trainers[0].Id,
                TrainingProgrammeId = programmes[0].Id,
                CreatedDate = new DateTime(2026, 10, 6)
            },
            new()
            {
                Name = "Sarah Muscle Building Plan",
                Description = "Hypertrophy focused training",
                MemberId = members[1].Id,
                TrainerId = trainers[1].Id,
                TrainingProgrammeId = programmes[1].Id,
                CreatedDate = new DateTime(2026, 10, 6)
            }
        };
        context.WorkoutPlans.AddRange(plans);
        await context.SaveChangesAsync();

        // ---------------- Workout Tasks ----------------
        var tasks = new List<WorkoutTask>
        {
            new() { ExerciseName = "Treadmill Run", Description = "Run at moderate pace", NumberOfSets = 1, NumberOfRepetitions = 1, DueDate = new DateTime(2026, 10, 15), Status = WorkoutTaskStatus.NotStarted, WorkoutPlanId = plans[0].Id },
            new() { ExerciseName = "Squats", Description = "Keep back straight", NumberOfSets = 3, NumberOfRepetitions = 12, DueDate = new DateTime(2026, 10, 16), Status = WorkoutTaskStatus.InProgress, WorkoutPlanId = plans[0].Id },
            new() { ExerciseName = "Plank", Description = "Hold for 60 seconds", NumberOfSets = 3, NumberOfRepetitions = 1, DueDate = new DateTime(2026, 10, 17), Status = WorkoutTaskStatus.Complete, WorkoutPlanId = plans[0].Id },
            new() { ExerciseName = "Bench Press", Description = "Warm up first", NumberOfSets = 4, NumberOfRepetitions = 8, DueDate = new DateTime(2026, 10, 18), Status = WorkoutTaskStatus.NotStarted, WorkoutPlanId = plans[1].Id }
        };
        context.WorkoutTasks.AddRange(tasks);
        await context.SaveChangesAsync();
    }

    private static async Task CreateUserAsync(
        UserManager<ApplicationUser> userManager,
        string email,
        string password,
        string firstName,
        string lastName,
        UserRole role,
        int? memberId,
        int? trainerId)
    {
        if (await userManager.FindByEmailAsync(email) != null) return;

        var user = new ApplicationUser
        {
            UserName = email,
            Email = email,
            FirstName = firstName,
            LastName = lastName,
            Role = role,
            MemberId = memberId,
            TrainerId = trainerId,
            EmailConfirmed = true
        };

        var result = await userManager.CreateAsync(user, password);
        if (result.Succeeded)
        {
            await userManager.AddToRoleAsync(user, role.ToString());
        }
    }
}