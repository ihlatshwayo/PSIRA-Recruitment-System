import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from './api.service';
import { LoginRequest } from '../models/login-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentAdminSubject = new BehaviorSubject<any>(null);
  public currentAdmin$ = this.currentAdminSubject.asObservable();

  private currentApplicantSubject = new BehaviorSubject<any>(null);
  public currentApplicant$ = this.currentApplicantSubject.asObservable();

  constructor(private apiService: ApiService) {
    const storedAdmin = localStorage.getItem('currentAdmin');
    if (storedAdmin) {
      this.currentAdminSubject.next(JSON.parse(storedAdmin));
    }

    const storedApplicant = localStorage.getItem('currentApplicant');
    if (storedApplicant) {
      this.currentApplicantSubject.next(JSON.parse(storedApplicant));
    }
  }

  adminLogin(loginRequest: LoginRequest): Observable<any> {
    return this.apiService.post('auth/admin-login', loginRequest);
  }

  applicantLogin(loginRequest: LoginRequest): Observable<any> {
    return this.apiService.post('auth/applicant-login', loginRequest);
  }

  setCurrentAdmin(admin: any): void {
    // Ensure only one user type is active at a time
    this.currentApplicantSubject.next(null);
    localStorage.removeItem('currentApplicant');

    this.currentAdminSubject.next(admin);
    localStorage.setItem('currentAdmin', JSON.stringify(admin));
  }

  setCurrentApplicant(applicant: any): void {
    // Ensure only one user type is active at a time
    this.currentAdminSubject.next(null);
    localStorage.removeItem('currentAdmin');

    this.currentApplicantSubject.next(applicant);
    localStorage.setItem('currentApplicant', JSON.stringify(applicant));
  }

  logout(): void {
    this.currentAdminSubject.next(null);
    this.currentApplicantSubject.next(null);
    localStorage.removeItem('currentAdmin');
    localStorage.removeItem('currentApplicant');
  }

  isAdminLoggedIn(): boolean {
    return this.currentAdminSubject.value !== null;
  }

  isApplicantLoggedIn(): boolean {
    return this.currentApplicantSubject.value !== null;
  }

  getCurrentAdmin(): any {
    return this.currentAdminSubject.value;
  }

  getCurrentApplicant(): any {
    return this.currentApplicantSubject.value;
  }
}