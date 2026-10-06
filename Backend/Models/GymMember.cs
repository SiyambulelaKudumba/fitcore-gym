using FitCoreGym.Enums;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitCoreGym.Models
{
    public class GymMember
    {
        public int Id { get; set; }

        [Required]
        public string MemberNumber { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Surname { get; set; } = string.Empty;

        public Gender Gender { get; set; }

        [DataType(DataType.Date)]
        public DateOnly DateOfBirth { get; set; }

        [Required]
        public string HomeAddress { get; set; } = string.Empty;

        [Required, EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;

        public string? PhoneNumber { get; set; } // Nullable because phone is optional in spec

        public MembershipType MembershipType { get; set; }

        //Link to ASP.NET Identity User
        public string? ApplicationUserId { get; set; }
        [ForeignKey("ApplicationUserId")]
        public ApplicationUser? ApplicationUser { get; set; }

        //Relationships (nullable since they can be unassigned initially)
        public int? PersonalTrainerId { get; set; }
        public PersonalTrainer? PersonalTrainer { get; set; }

        public int? TrainingProgrammeId { get; set; }
        public TrainingProgramme? TrainingProgramme { get; set; }

        public ICollection<WorkoutPlan> WorkoutPlans { get; set; } = new List<WorkoutPlan>();
    }
}