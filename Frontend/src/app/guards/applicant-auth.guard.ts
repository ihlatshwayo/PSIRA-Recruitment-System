import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class ApplicantAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.authService.isApplicantLoggedIn()) {
      return true;
    } else {
      this.router.navigate(['/applicant/login']);
      return false;
    }
  }
}