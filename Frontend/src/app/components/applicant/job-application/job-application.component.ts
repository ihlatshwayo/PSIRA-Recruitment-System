import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApplicantService } from '../../../services/applicant.service';
import { JobPostService } from '../../../services/job-post.service';
import { JobApplication } from '../../../models/job-application.model';
import { JobPost } from '../../../models/job-post.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-job-application',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './job-application.component.html',
  styleUrls: ['./job-application.component.css']
})
export class JobApplicationComponent implements OnInit {
  application: JobApplication = {
    id: 0,
    applicantId: 0,
    jobPostId: 0,
    highestQualification: '',
    hasDriversLicense: false,
    currentPosition: '',
    currentCompany: '',
    yearsWithCurrentEmployer: '',
    currentSalary: 0,
    totalExperience: '',
    applicationDate: ''
  };

  jobPost: JobPost | null = null;
  qualificationOptions = ['Diploma', 'Degree', 'Honors', 'Masters', 'Phd'];
  experienceOptions = [
    'less than 12 months', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'more than 10'
  ];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private applicantService: ApplicantService,
    private jobPostService: JobPostService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const jobId = this.route.snapshot.paramMap.get('jobId');
    if (jobId) {
      this.application.jobPostId = +jobId;
      this.loadJobPost(+jobId);
    }

    const currentApplicant = this.authService.getCurrentApplicant();
    if (currentApplicant) {
      this.application.applicantId = currentApplicant.id;
    }
  }

  loadJobPost(jobId: number): void {
    this.jobPostService.getJobPostById(jobId).subscribe({
      next: (post) => {
        this.jobPost = post;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load job post details';
      }
    });
  }

  onSubmit(): void {
    // Prepare payload: avoid sending empty applicationDate which causes model binding errors
    const payload: any = { ...this.application };
    if (!payload.applicationDate || payload.applicationDate === '') {
      delete payload.applicationDate;
    }

    this.applicantService.applyForJob(payload).subscribe({
      next: (response) => {
        this.successMessage = response?.message || 'Your application was captured successfully.';
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 3000);
      },
      error: (error) => {
        // Try to surface server-provided validation errors if present
        if (error?.error) {
          if (error.error.message) this.errorMessage = error.error.message;
          else if (error.error.errors) this.errorMessage = JSON.stringify(error.error.errors);
          else this.errorMessage = 'Failed to submit application';
        } else {
          this.errorMessage = 'Failed to submit application';
        }
      }
    });
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onExit(): void {
    // Exit behaves the same as cancel for now
    this.router.navigate(['/']);
  }
}