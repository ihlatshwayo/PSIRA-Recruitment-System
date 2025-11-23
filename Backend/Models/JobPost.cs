public class JobPost
{
    public int Id { get; set; }
    public string PostName { get; set; }
    public string JobDescription { get; set; }
    public int BusinessUnitId { get; set; }
    public BusinessUnit? BusinessUnit { get; set; }
    public string ManagerName { get; set; }
    public string ManagerEmail { get; set; }
    public string ExperienceRequired { get; set; }
    public string QualificationRequired { get; set; }
    public bool DriversLicenseRequired { get; set; }
    public DateTime OpeningDate { get; set; }
    public DateTime ClosingDate { get; set; }
    public bool IsActive { get; set; }
    public DateTime CreatedAt { get; set; }
}