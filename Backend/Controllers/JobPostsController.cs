using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class JobPostsController : ControllerBase
{
    private readonly AppDbContext _context;

    public JobPostsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public IActionResult GetActiveJobPosts()
    {
        var today = DateTime.Today;
        var jobPosts = _context.JobPosts
            .Include(jp => jp.BusinessUnit)
            .Where(jp => jp.IsActive && jp.OpeningDate <= today && jp.ClosingDate >= today)
            .ToList();

        return Ok(jobPosts);
    }

    [HttpPost]
    public IActionResult CreateJobPost([FromBody] JobPost jobPost)
    {
        if (jobPost == null)
        {
            return BadRequest(new { success = false, message = "Job post payload is missing" });
        }

        // Validate BusinessUnitId
        if (jobPost.BusinessUnitId <= 0)
        {
            return BadRequest(new { success = false, message = "BusinessUnitId is required and must be a positive integer" });
        }

        var unitExists = _context.BusinessUnits.Any(u => u.Id == jobPost.BusinessUnitId);
        if (!unitExists)
        {
            return BadRequest(new { success = false, message = $"BusinessUnit with id {jobPost.BusinessUnitId} does not exist" });
        }

        // Validate dates
        if (jobPost.OpeningDate == default || jobPost.ClosingDate == default)
        {
            return BadRequest(new { success = false, message = "OpeningDate and ClosingDate must be valid dates" });
        }

        if (jobPost.OpeningDate > jobPost.ClosingDate)
        {
            return BadRequest(new { success = false, message = "OpeningDate must be earlier than or equal to ClosingDate" });
        }

        // Server authoritative timestamp (UTC)
        jobPost.CreatedAt = DateTime.UtcNow;

        _context.JobPosts.Add(jobPost);
        _context.SaveChanges();

        // Return the created entity so client receives server-assigned fields
        return Ok(new { success = true, jobPost });
    }

    [HttpGet("closed")]
    public IActionResult GetClosedJobPosts()
    {
        var today = DateTime.Today;
        var closedPosts = _context.JobPosts
            .Include(jp => jp.BusinessUnit)
            .Where(jp => jp.ClosingDate < today)
            .ToList();

        return Ok(closedPosts);
    }

    [HttpGet("businessunits")]
    public IActionResult GetBusinessUnits()
    {
        var units = _context.BusinessUnits.ToList();
        return Ok(units);
    }

    [HttpGet("{id}")]
    public IActionResult GetJobPostById(int id)
    {
        var jobPost = _context.JobPosts
            .Include(jp => jp.BusinessUnit)
            .FirstOrDefault(jp => jp.Id == id);

        if (jobPost == null)
        {
            return NotFound(new { success = false, message = $"JobPost with id {id} not found" });
        }

        return Ok(jobPost);
    }
}