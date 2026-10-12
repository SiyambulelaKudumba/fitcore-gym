using FitCore.Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace FitCore.Api.Data;

public class ApplicationDbContext : IdentityDbContext<ApplicationUser>
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<Member> Members => Set<Member>();
    public DbSet<Trainer> Trainers => Set<Trainer>();
    public DbSet<TrainingProgramme> TrainingProgrammes => Set<TrainingProgramme>();
    public DbSet<WorkoutPlan> WorkoutPlans => Set<WorkoutPlan>();
    public DbSet<WorkoutTask> WorkoutTasks => Set<WorkoutTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // ---------- Member ----------
        modelBuilder.Entity<Member>(entity =>
        {
            entity.HasIndex(m => m.MemberNumber).IsUnique();
            entity.HasIndex(m => m.Email).IsUnique();

            entity.HasOne(m => m.Trainer)
                  .WithMany(t => t.Members)
                  .HasForeignKey(m => m.TrainerId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(m => m.TrainingProgramme)
                  .WithMany(p => p.Members)
                  .HasForeignKey(m => m.TrainingProgrammeId)
                  .OnDelete(DeleteBehavior.SetNull);

            entity.HasOne(m => m.User)
                  .WithOne(u => u.Member)
                  .HasForeignKey<Member>(m => m.UserId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // ---------- Trainer ----------
        modelBuilder.Entity<Trainer>(entity =>
        {
            entity.HasIndex(t => t.StaffNumber).IsUnique();
            entity.HasIndex(t => t.Email).IsUnique();

            entity.HasOne(t => t.User)
                  .WithOne(u => u.Trainer)
                  .HasForeignKey<Trainer>(t => t.UserId)
                  .OnDelete(DeleteBehavior.SetNull);
        });

        // ---------- WorkoutPlan ----------
        modelBuilder.Entity<WorkoutPlan>(entity =>
        {
            entity.HasOne(wp => wp.Member)
                  .WithMany(m => m.WorkoutPlans)
                  .HasForeignKey(wp => wp.MemberId)
                  .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(wp => wp.Trainer)
                  .WithMany(t => t.WorkoutPlans)
                  .HasForeignKey(wp => wp.TrainerId)
                  .OnDelete(DeleteBehavior.Restrict);

            entity.HasOne(wp => wp.TrainingProgramme)
                  .WithMany(p => p.WorkoutPlans)
                  .HasForeignKey(wp => wp.TrainingProgrammeId)
                  .OnDelete(DeleteBehavior.Restrict);
        });

        // ---------- WorkoutTask ----------
        modelBuilder.Entity<WorkoutTask>(entity =>
        {
            entity.HasOne(wt => wt.WorkoutPlan)
                  .WithMany(wp => wp.WorkoutTasks)
                  .HasForeignKey(wt => wt.WorkoutPlanId)
                  .OnDelete(DeleteBehavior.Cascade);
        });

        // ---------- ApplicationUser ----------
        modelBuilder.Entity<ApplicationUser>(entity =>
        {
            entity.Property(u => u.Role)
                  .HasConversion<string>();
        });
    }
}