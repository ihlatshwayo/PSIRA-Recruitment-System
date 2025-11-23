import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';
import { JobPostService } from '../../../services/job-post.service';
import { JobPost } from '../../../models/job-post.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './job-list.component.html',
  styleUrls: ['./job-list.component.css']
})
export class JobListComponent implements OnInit {
  jobPosts: JobPost[] = [];

  constructor(
    private jobPostService: JobPostService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadJobPosts();
  }

  loadJobPosts(): void {
    this.jobPostService.getActiveJobPosts().subscribe({
      next: (posts) => {
        this.jobPosts = posts;
      },
      error: (error) => {
        console.error('Failed to load job posts', error);
      }
    });
  }

  applyForJob(jobId: number): void {
    this.router.navigate(['/applicant/login'], { 
      queryParams: { jobId: jobId } 
    });
  }
}