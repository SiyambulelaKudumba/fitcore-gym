using Microsoft.AspNetCore.Http;
using FitCoreGym.DTOs;
using FitCoreGym.Models;
using FitCoreGym.Data;
using FitCoreGym.Enums;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace FitCoreGym.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly UserManager<ApplicationUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        private readonly ApplicationDbContext _context;

        public AuthController(
            UserManager<ApplicationUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IConfiguration configuration,
            ApplicationDbContext context)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
            _context = context;
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterDto model)
        {
            // 1. Check if a user with this email already exists
            var userExists = await _userManager.FindByEmailAsync(model.Email);
            if (userExists != null)
            {
                return BadRequest(new { message = "User with this email already exists!" });
            }

            // 2. Validate Date of Birth
            if (model.DateOfBirth!.Value >= DateOnly.FromDateTime(DateTime.Today))
            {
                return BadRequest(new { message = "Date of birth must be in the past." });
            }

            // 3. Create the new ApplicationUser instance
            var user = new ApplicationUser
            {
                UserName = model.Email,
                Email = model.Email,
                Name = model.Name,
                Surname = model.Surname,
                PhoneNumber = model.PhoneNumber,
                EmailConfirmed = true
            };

            // 4. Create the user in the database with their password
            var result = await _userManager.CreateAsync(user, model.Password);
            if (!result.Succeeded)
            {
                return BadRequest(result.Errors);
            }

            // 5. Assign the Member role
            await _userManager.AddToRoleAsync(user, "Member");

            // 6. Create the linked GymMember profile with an auto-generated member number
            var member = new GymMember
            {
                ApplicationUserId = user.Id,
                MemberNumber = await GenerateMemberNumber(),
                Name = model.Name,
                Surname = model.Surname,
                Gender = model.Gender!.Value,
                DateOfBirth = model.DateOfBirth.Value,
                HomeAddress = model.HomeAddress,
                EmailAddress = model.Email,
                PhoneNumber = model.PhoneNumber,
                MembershipType = model.MembershipType!.Value
            };

            try
            {
                _context.GymMembers.Add(member);
                await _context.SaveChangesAsync();
            }
            catch
            {
                // Compensation: Roll back the Identity user creation if the member profile fails to save
                await _userManager.DeleteAsync(user);
                return StatusCode(500, new { message = "Could not create member profile." });
            }

            return Ok(new
            {
                message = "User registered successfully as a Member!",
                memberNumber = member.MemberNumber
            });
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto model)
        {
            var user = await _userManager.FindByEmailAsync(model.Email);
            if (user == null || !await _userManager.CheckPasswordAsync(user, model.Password))
            {
                return Unauthorized(new AuthResponseDto { Message = "Invalid email or password." });
            }

            var token = await GenerateJwtToken(user);
            var roles = await _userManager.GetRolesAsync(user);
            var role = roles.FirstOrDefault() ?? "Member";

            return Ok(new AuthResponseDto
            {
                Token = token,
                Email = user.Email ?? string.Empty,
                Role = role,
                Message = "Login successful!"
            });
        }

        private async Task<string> GenerateMemberNumber()
        {
            int next = await _context.GymMembers.CountAsync() + 1;
            string number;
            do
            {
                number = $"MEM-{next:D3}";
                next++;
            } while (await _context.GymMembers.AnyAsync(m => m.MemberNumber == number));

            return number;
        }

        private async Task<string> GenerateJwtToken(ApplicationUser user)
        {
            var jwtSettings = _configuration.GetSection("Jwt");
            var keyString = jwtSettings["Key"] ?? throw new InvalidOperationException("JWT Key is not configured.");
            var key = Encoding.UTF8.GetBytes(keyString);

            var roles = await _userManager.GetRolesAsync(user);
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id),
                new Claim(ClaimTypes.Email, user.Email ?? string.Empty),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var role in roles)
            {
                claims.Add(new Claim(ClaimTypes.Role, role));
            }

            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(claims),
                Expires = DateTime.UtcNow.AddDays(double.Parse(jwtSettings["DurationInDays"] ?? "7")),
                Issuer = jwtSettings["Issuer"],
                Audience = jwtSettings["Audience"],
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };

            var tokenHandler = new JwtSecurityTokenHandler();
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }
    }
}