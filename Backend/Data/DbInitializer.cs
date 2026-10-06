using FitCoreGym.Models;
using FitCoreGym.Enums; 
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace FitCoreGym.Data
{
    public static class DbInitializer
    {
        public static async Task Initialize(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<ApplicationUser>>();
            var context = serviceProvider.GetRequiredService<ApplicationDbContext>();

            //  Roles Exist
            string[] roleNames = { "Admin", "Trainer", "Member" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }

            // Seed Default Admin User
            var adminEmail = "admin@fitcore.com";
            if (await userManager.FindByEmailAsync(adminEmail) == null)
            {
                var adminUser = new ApplicationUser
                {
                    UserName = adminEmail,
                    Email = adminEmail,
                    Name = "System",
                    Surname = "Admin",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(adminUser, "AdminPassword123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(adminUser, "Admin");
                }
            }

            // Seed Default Trainer User & Link Profile
            var trainerEmail = "trainer@fitcore.com";
            var trainerUser = await userManager.FindByEmailAsync(trainerEmail);
            if (trainerUser == null)
            {
                trainerUser = new ApplicationUser
                {
                    UserName = trainerEmail,
                    Email = trainerEmail,
                    Name = "John",
                    Surname = "Potter",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(trainerUser, "TrainerPassword123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(trainerUser, "Trainer");
                }
            }

            if (trainerUser != null)
            {
                bool trainerExists = await context.PersonalTrainers.AnyAsync(t => t.ApplicationUserId == trainerUser.Id);
                if (!trainerExists)
                {
                    context.PersonalTrainers.Add(new PersonalTrainer
                    {
                        ApplicationUserId = trainerUser.Id,
                        StaffNumber = "STF-001",
                        Name = trainerUser.Name,
                        Surname = trainerUser.Surname,
                        Specialization = (Specialization)0, 
                        EmailAddress = trainerEmail
                    });
                    await context.SaveChangesAsync();
                }
            }

            //Seed Default Member User & Link Profile
            var memberEmail = "member@fitcore.com";
            var memberUser = await userManager.FindByEmailAsync(memberEmail);
            if (memberUser == null)
            {
                memberUser = new ApplicationUser
                {
                    UserName = memberEmail,
                    Email = memberEmail,
                    Name = "Amy",
                    Surname = "Fosco",
                    EmailConfirmed = true
                };

                var result = await userManager.CreateAsync(memberUser, "MemberPassword123!");
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(memberUser, "Member");
                }
            }

            if (memberUser != null)
            {
                bool memberExists = await context.GymMembers.AnyAsync(m => m.ApplicationUserId == memberUser.Id);
                if (!memberExists)
                {
                    context.GymMembers.Add(new GymMember
                    {
                        ApplicationUserId = memberUser.Id,
                        MemberNumber = "MEM-001",
                        Name = memberUser.Name,
                        Surname = memberUser.Surname,
                        DateOfBirth = new DateOnly(2000, 1, 1),
                        Gender = (Gender)0, // Casts to default enum value
                        MembershipType = (MembershipType)0, // Casts to default enum value
                        HomeAddress = "123 Gym Street", 
                        EmailAddress = memberEmail
                    });
                    await context.SaveChangesAsync();
                }
            }
        }
    }
}