import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { AdminLoginComponent } from './components/admin/admin-login/admin-login.component';
import { CreatePostComponent } from './components/admin/create-post/create-post.component';
import { SiftingComponent } from './components/admin/sifting/sifting.component';
import { ApplicantRegisterComponent } from './components/applicant/applicant-register/applicant-register.component';
import { ApplicantLoginComponent } from './components/applicant/applicant-login/applicant-login.component';
import { JobApplicationComponent } from './components/applicant/job-application/job-application.component';
import { JobListComponent } from './components/applicant/job-list/job-list.component';

import { AdminAuthGuard } from './guards/admin-auth.guard';
import { ApplicantAuthGuard } from './guards/applicant-auth.guard';

@NgModule({
  declarations: [],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppComponent,
    AdminLoginComponent,
    CreatePostComponent,
    SiftingComponent,
    ApplicantRegisterComponent,
    ApplicantLoginComponent,
    JobApplicationComponent,
    JobListComponent,
    RouterModule.forRoot([
      { path: '', component: JobListComponent },
      { path: 'applicant/register', component: ApplicantRegisterComponent },
      { path: 'applicant/login', component: ApplicantLoginComponent },
      { path: 'admin/login', component: AdminLoginComponent },
      { path: 'admin/dashboard', component: CreatePostComponent, canActivate: [AdminAuthGuard] },
      { path: 'admin/sifting', component: SiftingComponent, canActivate: [AdminAuthGuard] },
      { path: 'apply/:jobId', component: JobApplicationComponent, canActivate: [ApplicantAuthGuard] },
      { path: '**', redirectTo: '' }
    ])
  ],
  providers: [AdminAuthGuard, ApplicantAuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }