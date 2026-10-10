using Microsoft.AspNetCore.Identity;

namespace FitCore.Api.Models;

public class ApplicationUser : IdentityUser
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public UserRole Role { get; set; }

    public int? MemberId { get; set; }
    public Member? Member { get; set; }

    public int? TrainerId { get; set; }
    public Trainer? Trainer { get; set; }
}