using FitCoreGym.Enums;
using FitCoreGym.Models;
using System;
using System.ComponentModel.DataAnnotations;

namespace FitCoreGym.Models
{
    public class WorkoutTask
    {
        public int Id { get; set; }

        [Required]
        public string ExerciseName { get; set; }

        public string Description { get; set; }

        [Range(1, 100)]
        public int NumberOfSets { get; set; }

        [Range(1, 1000)]
        public int NumberOfRepetitions { get; set; }

        [DataType(DataType.Date)]
        public DateTime DueWorkoutDate { get; set; }

        public WorkoutTaskStatus TaskStatus { get; set; } = WorkoutTaskStatus.NotStarted;

        // Foreign Key
        public int WorkoutPlanId { get; set; }
        public WorkoutPlan WorkoutPlan { get; set; }
    }
}