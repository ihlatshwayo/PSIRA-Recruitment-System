import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { JobPost } from '../models/job-post.model';
import { BusinessUnit } from '../models/business-unit.model';

@Injectable({
  providedIn: 'root'
})
export class JobPostService {

  constructor(private apiService: ApiService) { }

  getActiveJobPosts(): Observable<JobPost[]> {
    return this.apiService.get<JobPost[]>('jobposts');
  }

  getClosedJobPosts(): Observable<JobPost[]> {
    return this.apiService.get<JobPost[]>('jobposts/closed');
  }

  createJobPost(jobPost: JobPost): Observable<any> {
    return this.apiService.post('jobposts', jobPost);
  }

  getBusinessUnits(): Observable<BusinessUnit[]> {
    return this.apiService.get<BusinessUnit[]>('jobposts/businessunits');
  }

  getJobPostById(id: number): Observable<JobPost> {
    return this.apiService.get<JobPost>(`jobposts/${id}`);
  }
}