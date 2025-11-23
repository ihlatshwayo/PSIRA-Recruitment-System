using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly AppDbContext _context;

    public AuthController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost("admin-login")]
    public IActionResult AdminLogin([FromBody] LoginRequest request)
    {
        var admin = _context.HRAdmins.FirstOrDefault(a => a.Username == request.Username);
        if (admin == null)
            return Unauthorized("Invalid credentials");

        // Verify password (and upgrade legacy plaintext if necessary)
        if (!Backend.Services.PasswordHasher.VerifyAndUpgrade(admin.Password, request.Password, out var upgradedHash))
            return Unauthorized("Invalid credentials");

        if (upgradedHash != null)
        {
            admin.Password = upgradedHash;
            _context.SaveChanges();
        }

        return Ok(new {
            success = true,
            name = admin.Name,
            position = admin.Position
        });
    }

    [HttpPost("applicant-login")]
    public IActionResult ApplicantLogin([FromBody] LoginRequest request)
    {
        var applicant = _context.Applicants.FirstOrDefault(a => a.Username == request.Username);
        if (applicant == null)
            return Unauthorized("Username does not exists. Please check your email address or Register");

        if (!Backend.Services.PasswordHasher.VerifyAndUpgrade(applicant.Password, request.Password, out var upgradedHash))
            return Unauthorized("Username does not exists. Please check your email address or Register");

        if (upgradedHash != null)
        {
            applicant.Password = upgradedHash;
            _context.SaveChanges();
        }

        // Do not return password in the response
        applicant.Password = string.Empty;
        return Ok(new { success = true, applicant });
    }
}