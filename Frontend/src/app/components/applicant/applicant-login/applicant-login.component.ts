import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/login-request.model';

@Component({
  selector: 'app-applicant-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './applicant-login.component.html',
  styleUrls: ['./applicant-login.component.css']
})
export class ApplicantLoginComponent {
  loginRequest: LoginRequest = { username: '', password: '' };
  errorMessage: string = '';
  jobId: number | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.route.queryParams.subscribe(params => {
      this.jobId = params['jobId'] || null;
    });
  }

  onSubmit(): void {
    this.authService.applicantLogin(this.loginRequest).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.authService.setCurrentApplicant(response.applicant);
          if (this.jobId) {
            this.router.navigate(['/apply', this.jobId]);
          } else {
            this.router.navigate(['/']);
          }
        }
      },
      error: (error) => {
        this.errorMessage = 'Username does not exists. Please check your email address or Register';
      }
    });
  }

  resetPassword(): void {
    alert('Reset Password functionality not implemented');
  }
}