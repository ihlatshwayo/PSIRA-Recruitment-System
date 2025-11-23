import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JobPostService } from '../../../services/job-post.service';
import { BusinessUnit } from '../../../models/business-unit.model';
import { JobPost } from '../../../models/job-post.model';

@Component({
  selector: 'app-create-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css']
})
export class CreatePostComponent implements OnInit {
  jobPost: JobPost = {
    id: 0,
    postName: '',
    jobDescription: '',
    businessUnitId: 0,
    managerName: '',
    managerEmail: '',
    experienceRequired: '',
    qualificationRequired: '',
    driversLicenseRequired: false,
    openingDate: '',
    closingDate: '',
    isActive: true,
    createdAt: ''
  };

  businessUnits: BusinessUnit[] = [];
  experienceOptions = [
    'less than 12 months', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'more than 10'
  ];
  qualificationOptions = ['Diploma', 'Degree', 'Honors', 'Masters', 'Phd'];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private jobPostService: JobPostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadBusinessUnits();
  }

  loadBusinessUnits(): void {
    this.jobPostService.getBusinessUnits().subscribe({
      next: (units) => {
        this.businessUnits = units;
      },
      error: (error) => {
        this.errorMessage = 'Failed to load business units';
      }
    });
  }

  onSubmit(): void {
    // Ensure createdAt is set on the client so the payload contains a timestamp
    // (best practice is for the server to set this, but set it here so the UI shows it immediately)
    this.jobPost.createdAt = new Date().toISOString();
    console.log('Submitting jobPost', this.jobPost);

    this.jobPostService.createJobPost(this.jobPost).subscribe({
      next: (response) => {
        this.successMessage = 'Job post created successfully!';
        this.resetForm();
      },
      error: (error) => {
        this.errorMessage = 'Failed to create job post';
      }
    });
  }

  resetForm(): void {
    this.jobPost = {
      id: 0,
      postName: '',
      jobDescription: '',
      businessUnitId: 0,
      managerName: '',
      managerEmail: '',
      experienceRequired: '',
      qualificationRequired: '',
      driversLicenseRequired: false,
      openingDate: '',
      closingDate: '',
      isActive: true,
      createdAt: ''
    };
  }

  onCancel(): void {
    this.router.navigate(['/admin/dashboard']);
  }

  onExit(): void {
    // Exit navigates back to admin dashboard
    this.router.navigate(['/admin/dashboard']);
  }
}