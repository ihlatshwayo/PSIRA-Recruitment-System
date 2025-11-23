import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SiftingService } from '../../../services/sifting.service';
import { JobPostService } from '../../../services/job-post.service';
import { JobPost } from '../../../models/job-post.model';
import { SiftingResult } from '../../../models/sifting-result.model';

@Component({
  selector: 'app-sifting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sifting.component.html',
  styleUrls: ['./sifting.component.css']
})
export class SiftingComponent implements OnInit {
  closedJobPosts: JobPost[] = [];
  selectedJobPostId: number | null = null;
  siftingResults: SiftingResult[] = [];
  jobPostDetails: any = null;
  summary: any = null;
  isLoading: boolean = false;

  constructor(
    private siftingService: SiftingService,
    private jobPostService: JobPostService
  ) {}

  ngOnInit(): void {
    this.loadClosedJobPosts();
  }

  loadClosedJobPosts(): void {
    this.jobPostService.getClosedJobPosts().subscribe({
      next: (posts) => {
        this.closedJobPosts = posts;
        console.debug('Sifting: loaded closed job posts', posts);
        if (!posts || posts.length === 0) {
          console.info('Sifting: no closed job posts returned from API');
        }
      },
      error: (error) => {
        console.error('Failed to load closed job posts', error);
      }
    });
  }

  onJobPostChange(): void {
    if (this.selectedJobPostId) {
      this.loadSiftingResults(this.selectedJobPostId);
    } else {
      // clear current results when selection cleared
      this.siftingResults = [];
      this.jobPostDetails = null;
      this.summary = null;
    }
  }

  loadSiftingResults(jobPostId: number): void {
    this.isLoading = true;
    this.siftingService.getSiftingResults(jobPostId).subscribe({
      next: (response) => {
        this.jobPostDetails = response.jobPost;
        this.siftingResults = response.results;
        this.summary = {
          totalCandidates: response.totalCandidates,
          meetsRequirementsCount: response.meetsRequirementsCount
        };
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Failed to load sifting results', error);
        this.isLoading = false;
      }
    });
  }

  viewCV(cvFilePath: string): void {
    if (cvFilePath) {
      window.open(cvFilePath, '_blank');
    }
  }

  printToPDF(): void {
    window.print();
  }

  emailManager(): void {
    alert('Email Manager functionality not implemented');
  }

  onExit(): void {
    // Navigate back to admin dashboard
    // If the dashboard route is different adjust accordingly
    window.location.href = '/admin/dashboard';
  }
}