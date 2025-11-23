import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from './api.service';
import { Applicant } from '../models/applicant.model';
import { JobApplication } from '../models/job-application.model';

@Injectable({
  providedIn: 'root'
})
export class ApplicantService {

  constructor(private apiService: ApiService) { }

  registerApplicant(applicant: Applicant): Observable<any> {
    return this.apiService.post('applicants/register', applicant);
  }

  applyForJob(application: JobApplication): Observable<any> {
    return this.apiService.post('applicants/apply', application);
  }

  uploadCV(file: File): Observable<any> {
    return this.apiService.uploadFile('applicants/upload-cv', file);
  }

  getApplicantProfile(id: number): Observable<Applicant> {
    return this.apiService.get<Applicant>(`applicants/${id}`);
  }
}