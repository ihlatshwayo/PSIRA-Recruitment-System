import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { LoginRequest } from '../../../models/login-request.model';

@Component({
  selector: 'app-admin-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin-login.component.html',
  styleUrls: ['./admin-login.component.css']
})
export class AdminLoginComponent {
  loginRequest: LoginRequest = { username: '', password: '' };
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onSubmit(): void {
    this.authService.adminLogin(this.loginRequest).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.authService.setCurrentAdmin({
            name: response.name,
            position: response.position
          });
          this.router.navigate(['/admin/dashboard']);
        }
      },
      error: (error) => {
        this.errorMessage = 'Invalid credentials. Please try again.';
      }
    });
  }
}