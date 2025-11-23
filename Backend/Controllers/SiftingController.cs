using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

[ApiController]
[Route("api/[controller]")]
public class SiftingController : ControllerBase
{
    private readonly AppDbContext _context;

    public SiftingController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{jobPostId}")]
    public IActionResult GetSiftingResults(int jobPostId)
    {
        var jobPost = _context.JobPosts
            .Include(jp => jp.BusinessUnit)
            .FirstOrDefault(jp => jp.Id == jobPostId);

        if (jobPost == null)
            return NotFound("Job post not found");

        var applications = _context.JobApplications
            .Include(ja => ja.Applicant)
            .Where(ja => ja.JobPostId == jobPostId)
            .ToList();

        var results = new List<SiftingResult>();
        var qualificationOrder = new Dictionary<string, int>
        {
            {"Diploma", 1}, {"Degree", 2}, {"Honors", 3}, {"Masters", 4}, {"Phd", 5}
        };

        var experienceOrder = new Dictionary<string, int>
        {
            {"less than 12 months", 0}, {"1", 1}, {"2", 2}, {"3", 3}, {"4", 4}, 
            {"5", 5}, {"6", 6}, {"7", 7}, {"8", 8}, {"9", 9}, {"10", 10}, {"more than 10", 11}
        };

        foreach (var application in applications)
        {
            int driversLicensePoints = application.HasDriversLicense && jobPost.DriversLicenseRequired ? 2 : 0;
            
            int qualificationPoints = 0;
            if (qualificationOrder.ContainsKey(application.HighestQualification) && 
                qualificationOrder.ContainsKey(jobPost.QualificationRequired))
            {
                if (qualificationOrder[application.HighestQualification] >= qualificationOrder[jobPost.QualificationRequired])
                    qualificationPoints = 2;
            }

            int experiencePoints = 0;
            if (experienceOrder.ContainsKey(application.TotalExperience) && 
                experienceOrder.ContainsKey(jobPost.ExperienceRequired))
            {
                if (experienceOrder[application.TotalExperience] >= experienceOrder[jobPost.ExperienceRequired])
                    experiencePoints = 2;
            }

            int totalPoints = driversLicensePoints + qualificationPoints + experiencePoints;
            bool meetsRequirements = totalPoints == 6;

            results.Add(new SiftingResult
            {
                Name = application.Applicant.Name,
                Surname = application.Applicant.Surname,
                Province = application.Applicant.Province,
                DriversLicensePoints = driversLicensePoints,
                QualificationPoints = qualificationPoints,
                ExperiencePoints = experiencePoints,
                TotalPoints = totalPoints,
                MeetsRequirements = meetsRequirements,
                CVFilePath = application.Applicant.CVFilePath
            });
        }

        var summary = new
        {
            TotalCandidates = applications.Count,
            MeetsRequirementsCount = results.Count(r => r.MeetsRequirements),
            JobPost = jobPost,
            Results = results
        };

        return Ok(summary);
    }
}