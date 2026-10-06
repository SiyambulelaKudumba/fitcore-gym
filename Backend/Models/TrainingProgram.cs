using FitCoreGym.Enums;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FitCoreGym.Models
{
    public class TrainingProgramme
    {
        public int Id { get; set; }

        [Required]
        public string ProgrammeName { get; set; }

        [Required]
        public string Description { get; set; }

        [Required]
        public string Duration { get; set; }

        public FitnessGoal FitnessGoal { get; set; }

        // Relationships
        public ICollection<GymMember> GymMembers { get; set; } = new List<GymMember>();
        public ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();
    }
}
