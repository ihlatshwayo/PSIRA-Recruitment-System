using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

    public DbSet<HRAdmin> HRAdmins { get; set; }
    public DbSet<BusinessUnit> BusinessUnits { get; set; }
    public DbSet<JobPost> JobPosts { get; set; }
    public DbSet<Applicant> Applicants { get; set; }
    public DbSet<JobApplication> JobApplications { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<JobPost>()
            .HasOne(jp => jp.BusinessUnit)
            .WithMany()
            .HasForeignKey(jp => jp.BusinessUnitId);

        modelBuilder.Entity<JobApplication>()
            .HasOne(ja => ja.Applicant)
            .WithMany()
            .HasForeignKey(ja => ja.ApplicantId);

        modelBuilder.Entity<JobApplication>()
            .HasOne(ja => ja.JobPost)
            .WithMany()
            .HasForeignKey(ja => ja.JobPostId);
    }
}