using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace FitCoreGym.Models
{
    public class WorkoutPlan
    {
        public int Id { get; set; }

        [Required]
        public string PlanName { get; set; }

        public string Description { get; set; }

        // foreign Keys
        public int TrainingProgrammeId { get; set; }
        public TrainingProgramme TrainingProgramme { get; set; }

        public int GymMemberId { get; set; }
        public GymMember GymMember { get; set; }

        // Relationship: One Workout Plan to Many Workout Tasks
        public ICollection<WorkoutTask> WorkoutTasks { get; set; } = new List<WorkoutTask>();
    }
}
