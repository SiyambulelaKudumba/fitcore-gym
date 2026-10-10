using FitCore.Api.Data;
using FitCore.Api.DTOs;
using FitCore.Api.Models;
using FitCore.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace FitCore.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly ApplicationDbContext _context;

    public AuthController(
        UserManager<ApplicationUser> userManager,
        ITokenService tokenService,
        ApplicationDbContext context)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _context = context;
    }

    // POST /api/auth/register
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Register([FromBody] RegisterDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var existing = await _userManager.FindByEmailAsync(dto.Email);
        if (existing != null)
            return Conflict(new { status = 409, message = "Email is already registered.", errors = new { } });

        var user = new ApplicationUser
        {
            UserName = dto.Email,
            Email = dto.Email,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Role = UserRole.Member
        };

        var createResult = await _userManager.CreateAsync(user, dto.Password);
        if (!createResult.Succeeded)
        {
            var errors = createResult.Errors
                .GroupBy(e => e.Code)
                .ToDictionary(g => g.Key, g => g.Select(e => e.Description).ToArray());

            return BadRequest(new { status = 400, message = "Registration failed.", errors });
        }

        await _userManager.AddToRoleAsync(user, "Member");

        var lastMember = await _context.Members
            .OrderByDescending(m => m.Id)
            .FirstOrDefaultAsync();
        var nextNum = (lastMember?.Id ?? 0) + 1;
        var memberNumber = $"M{nextNum:D4}";

        var member = new Member
        {
            MemberNumber = memberNumber,
            FirstName = dto.FirstName,
            LastName = dto.LastName,
            Gender = dto.Gender,
            DateOfBirth = dto.DateOfBirth,
            HomeAddress = dto.HomeAddress,
            Email = dto.Email,
            PhoneNumber = dto.PhoneNumber,
            MembershipType = dto.MembershipType,
            JoinDate = DateTime.Today,
            UserId = user.Id
        };

        _context.Members.Add(member);
        await _context.SaveChangesAsync();

        user.MemberId = member.Id;
        await _userManager.UpdateAsync(user);

        var token = _tokenService.CreateToken(user, "Member", member.Id, null);

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Role = "Member",
                MemberId = member.Id,
                TrainerId = null,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        });
    }

    // POST /api/auth/login
    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<ActionResult<AuthResponseDto>> Login([FromBody] LoginDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Unauthorized(new { status = 401, message = "Invalid email or password.", errors = new { } });

        var passwordOk = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordOk)
            return Unauthorized(new { status = 401, message = "Invalid email or password.", errors = new { } });

        var role = user.Role.ToString();
        var token = _tokenService.CreateToken(user, role, user.MemberId, user.TrainerId);

        return Ok(new AuthResponseDto
        {
            Token = token,
            User = new UserDto
            {
                Id = user.Id,
                Email = user.Email ?? string.Empty,
                Role = role,
                MemberId = user.MemberId,
                TrainerId = user.TrainerId,
                FirstName = user.FirstName,
                LastName = user.LastName
            }
        });
    }

    // GET /api/auth/me
    [HttpGet("me")]
    [Authorize]
    public async Task<ActionResult<UserDto>> Me()
    {
        var userId = User.FindFirst(System.IdentityModel.Tokens.Jwt.JwtRegisteredClaimNames.Sub)?.Value
              ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null)
            return Unauthorized();

        return Ok(new UserDto
        {
            Id = user.Id,
            Email = user.Email ?? string.Empty,
            Role = user.Role.ToString(),
            MemberId = user.MemberId,
            TrainerId = user.TrainerId,
            FirstName = user.FirstName,
            LastName = user.LastName
        });
    }
}