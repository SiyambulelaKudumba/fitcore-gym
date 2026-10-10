using FitCore.Api.Data;
using FitCore.Api.DTOs;
using FitCore.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitCore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Admin")]
public class UsersController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public UsersController(
        ApplicationDbContext context,
        UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    // GET /api/users/members
    [HttpGet("members")]
    public async Task<ActionResult<IEnumerable<MemberDto>>> GetMemberUsers()
    {
        var members = await _context.Members
            .Include(m => m.Trainer)
            .Include(m => m.TrainingProgramme)
            .OrderBy(m => m.Id)
            .ToListAsync();

        var result = members.Select(m => new MemberDto
        {
            Id = m.Id,
            MemberNumber = m.MemberNumber,
            FirstName = m.FirstName,
            LastName = m.LastName,
            Gender = m.Gender,
            DateOfBirth = m.DateOfBirth,
            HomeAddress = m.HomeAddress,
            Email = m.Email,
            PhoneNumber = m.PhoneNumber,
            MembershipType = m.MembershipType,
            JoinDate = m.JoinDate,
            TrainerId = m.TrainerId,
            TrainerName = m.Trainer != null ? $"{m.Trainer.FirstName} {m.Trainer.LastName}" : null,
            TrainingProgrammeId = m.TrainingProgrammeId,
            TrainingProgrammeName = m.TrainingProgramme?.Name
        });

        return Ok(result);
    }

    // GET /api/users/trainers
    [HttpGet("trainers")]
    public async Task<ActionResult<IEnumerable<TrainerDto>>> GetTrainerUsers()
    {
        var trainers = await _context.Trainers
            .OrderBy(t => t.Id)
            .ToListAsync();

        var result = trainers.Select(t => new TrainerDto
        {
            Id = t.Id,
            StaffNumber = t.StaffNumber,
            FirstName = t.FirstName,
            LastName = t.LastName,
            Gender = t.Gender,
            Email = t.Email,
            PhoneNumber = t.PhoneNumber,
            Specialization = t.Specialization
        });

        return Ok(result);
    }

    // GET /api/users  — list all Identity users with their role
    // Useful for the Admin "list users by type" page
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetAllUsers()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.LastName)
            .ToListAsync();

        var result = new List<UserDto>();

        foreach (var user in users)
        {
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? user.Role.ToString();

            result.Add(new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Role = role,
                MemberId = user.MemberId,
                TrainerId = user.TrainerId,
                FirstName = user.FirstName,
                LastName = user.LastName
            });
        }

        return Ok(result);
    }
}