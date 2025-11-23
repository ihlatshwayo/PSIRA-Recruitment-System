import { Applicant } from './applicant.model';
import { JobPost } from './job-post.model';

export interface JobApplication {
  id: number;
  applicantId: number;
  jobPostId: number;
  highestQualification: string;
  hasDriversLicense: boolean;
  currentPosition: string;
  currentCompany: string;
  yearsWithCurrentEmployer: string;
  currentSalary: number;
  totalExperience: string;
  applicationDate: string;
  applicant?: Applicant;
  jobPost?: JobPost;
}