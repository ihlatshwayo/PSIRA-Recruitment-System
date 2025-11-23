import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApplicantService } from '../../../services/applicant.service';
import { Applicant } from '../../../models/applicant.model';

@Component({
  selector: 'app-applicant-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './applicant-register.component.html',
  styleUrls: ['./applicant-register.component.css']
})
export class ApplicantRegisterComponent {
  applicant: Applicant = {
    id: 0,
    username: '',
    email: '',
    password: '',
    name: '',
    surname: '',
    idNumber: '',
    cellphoneNumber: '',
    workNumber: '',
    homeAddress: '',
    province: '',
    cvFilePath: '',
    createdAt: ''
  };

  confirmPassword: string = '';
  selectedFile: File | null = null;
  provinces = ['Gauteng', 'Western Cape', 'KwaZulu-Natal', 'Eastern Cape', 'Free State', 'Limpopo', 'Mpumalanga', 'North West', 'Northern Cape'];
  successMessage: string = '';
  errorMessage: string = '';

  constructor(
    private applicantService: ApplicantService,
    private router: Router
  ) {}

  onFileSelected(event: any): void {
    this.selectedFile = event.target.files[0];
  }

  onSubmit(): void {
    // Ensure email is populated from username if the UI only collects username as email
    if (!this.applicant.email && this.applicant.username) {
      this.applicant.email = this.applicant.username;
    }

    if (this.applicant.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }

    // Include client-side createdAt timestamp in payload (server is authoritative and may overwrite)
    this.applicant.createdAt = new Date().toISOString();

    if (this.selectedFile) {
      this.uploadCVAndRegister();
    } else {
      this.registerApplicant();
    }
  }

  uploadCVAndRegister(): void {
    if (!this.selectedFile) return;

    this.applicantService.uploadCV(this.selectedFile).subscribe({
      next: (response) => {
        this.applicant.cvFilePath = response.filePath;
        this.registerApplicant();
      },
      error: (error) => {
        this.errorMessage = 'Failed to upload CV';
      }
    });
  }

  registerApplicant(): void {
    this.applicantService.registerApplicant(this.applicant).subscribe({
      next: (response) => {
        if (response?.success) {
          // Show server message and createdAt if returned
          this.successMessage = response.message || 'Registration successful';
          if (response.applicant) {
            // Handle different casing that may come from the server (CreatedAt vs createdAt)
            const createdVal = response.applicant.createdAt ?? response.applicant.CreatedAt;
            if (createdVal) {
              try {
                const created = new Date(createdVal);
                if (!isNaN(created.getTime())) {
                  this.successMessage += ` Registered at ${created.toLocaleString()}`;
                }
              } catch {}
            }
          }
          this.resetForm();
        } else {
          this.errorMessage = response?.message || 'Registration failed. Please try again.';
        }
      },
      error: (error) => {
        // Prefer server-provided message when available
        this.errorMessage = error?.error?.message || 'Registration failed. Please try again.';
      }
    });
  }

  resetForm(): void {
    this.applicant = {
      id: 0,
      username: '',
      email: '',
      password: '',
      name: '',
      surname: '',
      idNumber: '',
      cellphoneNumber: '',
      workNumber: '',
      homeAddress: '',
      province: '',
      cvFilePath: '',
      createdAt: ''
    };
    this.confirmPassword = '';
    this.selectedFile = null;
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }

  onExit(): void {
    this.router.navigate(['/']);
  }
}