using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class ApplicantsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly IWebHostEnvironment _environment;

    public ApplicantsController(AppDbContext context, IWebHostEnvironment environment)
    {
        _context = context;
        _environment = environment;
    }

    [HttpPost("register")]
    public IActionResult RegisterApplicant([FromBody] Applicant applicant)
    {
        if (applicant == null)
            return BadRequest(new { success = false, message = "Invalid applicant payload" });

        if (_context.Applicants.Any(a => a.Username == applicant.Username))
            return BadRequest(new { success = false, message = "Username already exists" });

        // Ensure Email is populated (the UI currently uses username as email)
        if (string.IsNullOrWhiteSpace(applicant.Email) && !string.IsNullOrWhiteSpace(applicant.Username))
        {
            applicant.Email = applicant.Username;
        }

        // Server authoritative timestamp
        applicant.CreatedAt = DateTime.UtcNow;

        // Hash password before saving
        try
        {
            if (!string.IsNullOrEmpty(applicant.Password))
            {
                applicant.Password = Backend.Services.PasswordHasher.Hash(applicant.Password);
            }
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine("Password hashing failed: " + ex);
            return StatusCode(500, new { success = false, message = "Failed to process password" });
        }

        try
        {
            _context.Applicants.Add(applicant);
            _context.SaveChanges();

            // Do not expose password in API responses
            applicant.Password = string.Empty;
            return Ok(new {
                success = true,
                message = $"Dear {applicant.Name}, Your registration was successful. Thank you for registering with us. Regards, Human Capital - PSiRA",
                applicant
            });
        }
        catch (Exception ex)
        {
            Console.Error.WriteLine(ex);
            return StatusCode(500, new { success = false, message = "Failed to register applicant" });
        }
    }

    [HttpPost("apply")]
    public IActionResult ApplyForJob([FromBody] JobApplication application)
    {
        application.ApplicationDate = DateTime.Now;
        _context.JobApplications.Add(application);
        _context.SaveChanges();

        return Ok(new { 
            success = true, 
            message = "Your application was captured successfully." 
        });
    }

    [HttpPost("upload-cv")]
    public async Task<IActionResult> UploadCV(IFormFile file)
    {
        if (file == null || file.Length == 0)
            return BadRequest(new { success = false, message = "No file uploaded" });

        // Determine a safe web root folder — fall back to ContentRootPath/wwwroot if WebRootPath is not configured
        var webRoot = _environment.WebRootPath;
        if (string.IsNullOrEmpty(webRoot))
        {
            webRoot = Path.Combine(_environment.ContentRootPath ?? Directory.GetCurrentDirectory(), "wwwroot");
        }

        var uploadsFolder = Path.Combine(webRoot, "uploads", "cvs");
        try
        {
            if (!Directory.Exists(uploadsFolder))
                Directory.CreateDirectory(uploadsFolder);

            // Sanitize file name to prevent path traversal
            var originalFileName = Path.GetFileName(file.FileName) ?? "uploaded_cv";
            var fileName = $"{Guid.NewGuid()}_{originalFileName}";
            var filePath = Path.Combine(uploadsFolder, fileName);

            using (var stream = new FileStream(filePath, FileMode.Create))
            {
                await file.CopyToAsync(stream);
            }

            // Return the relative path the frontend can use
            var relativePath = $"/uploads/cvs/{fileName}";
            return Ok(new { success = true, filePath = relativePath });
        }
        catch (Exception ex)
        {
            // Log exception via console/Serilog (Serilog is configured in Program.cs)
            Console.Error.WriteLine(ex);
            return StatusCode(500, new { success = false, message = "Failed to save uploaded file" });
        }
    }
}