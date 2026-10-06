using FitCoreGym.Enums;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FitCoreGym.Models
{
    public class PersonalTrainer
    {
        public int Id { get; set; }

        [Required]
        public string StaffNumber { get; set; } = string.Empty;

        [Required]
        public string Name { get; set; } = string.Empty;

        [Required]
        public string Surname { get; set; } = string.Empty;

        public Gender Gender { get; set; }

        [Required, EmailAddress]
        public string EmailAddress { get; set; } = string.Empty;

        [Required]
        public string PhoneNumber { get; set; } = string.Empty;

        public Specialization Specialization { get; set; }

        // --- NEW: Link to ASP.NET Identity User ---
        public string? ApplicationUserId { get; set; }
        [ForeignKey("ApplicationUserId")]
        public ApplicationUser? ApplicationUser { get; set; }

        // Relationship: One Trainer -> Many Gym Members
        public ICollection<GymMember> GymMembers { get; set; } = new List<GymMember>();
    }
}