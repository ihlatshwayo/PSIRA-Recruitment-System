public class JobApplication
{
    public int Id { get; set; }
    public int ApplicantId { get; set; }
    public Applicant? Applicant { get; set; }
    public int JobPostId { get; set; }
    public JobPost? JobPost { get; set; }
    public string HighestQualification { get; set; }
    public bool HasDriversLicense { get; set; }
    public string CurrentPosition { get; set; }
    public string CurrentCompany { get; set; }
    public string YearsWithCurrentEmployer { get; set; }
    public decimal CurrentSalary { get; set; }
    public string TotalExperience { get; set; }
    public DateTime ApplicationDate { get; set; }
}