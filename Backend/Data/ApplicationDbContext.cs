using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using FitCoreGym.Models;

namespace FitCoreGym.Data
{
    public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public DbSet<GymMember> GymMembers { get; set; }
        public DbSet<PersonalTrainer> PersonalTrainers { get; set; }
        public DbSet<TrainingProgramme> TrainingProgrammes { get; set; }
        public DbSet<WorkoutPlan> WorkoutPlans { get; set; }
        public DbSet<WorkoutTask> WorkoutTasks { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            //unique indexes for GymMember and PersonalTrainer
            builder.Entity<GymMember>()
                .HasIndex(m => m.MemberNumber)
                .IsUnique();

            builder.Entity<PersonalTrainer>()
                .HasIndex(t => t.StaffNumber)
                .IsUnique();
            
            // PersonalTrainer to GymMembers (One-to-Many)
            builder.Entity<GymMember>()
                .HasOne(g => g.PersonalTrainer)
                .WithMany(pt => pt.GymMembers)
                .HasForeignKey(g => g.PersonalTrainerId)
                .OnDelete(DeleteBehavior.SetNull);

            // TrainingProgramme to GymMembers (One-to-Many)
            builder.Entity<GymMember>()
                .HasOne(g => g.TrainingProgramme)
                .WithMany(tp => tp.GymMembers)
                .HasForeignKey(g => g.TrainingProgrammeId)
                .OnDelete(DeleteBehavior.SetNull);

            //trainingProgramme to WorkoutPlans (One-to-Many)
            builder.Entity<WorkoutPlan>()
                .HasOne(wp => wp.TrainingProgramme)
                .WithMany(tp => tp.WorkoutPlans)
                .HasForeignKey(wp => wp.TrainingProgrammeId)
                .OnDelete(DeleteBehavior.Cascade);

            // gymMember to WorkoutPlans (One-to-Many)
            builder.Entity<WorkoutPlan>()
                .HasOne(wp => wp.GymMember)
                .WithMany(gm => gm.WorkoutPlans)
                .HasForeignKey(wp => wp.GymMemberId)
                .OnDelete(DeleteBehavior.Cascade);

            //WorkoutPlan to WorkoutTasks (One-to-Many)
            builder.Entity<WorkoutTask>()
                .HasOne(wt => wt.WorkoutPlan)
                .WithMany(wp => wp.WorkoutTasks)
                .HasForeignKey(wt => wt.WorkoutPlanId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}