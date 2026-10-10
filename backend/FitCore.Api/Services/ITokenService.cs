using FitCore.Api.Models;

namespace FitCore.Api.Services;

public interface ITokenService
{
    string CreateToken(ApplicationUser user, string role, int? memberId, int? trainerId);
}