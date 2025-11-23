import { BusinessUnit } from './business-unit.model';

export interface JobPost {
  id: number;
  postName: string;
  jobDescription: string;
  businessUnitId: number;
  businessUnit?: BusinessUnit;
  managerName: string;
  managerEmail: string;
  experienceRequired: string;
  qualificationRequired: string;
  driversLicenseRequired: boolean;
  openingDate: string;
  closingDate: string;
  isActive: boolean;
  createdAt: string;
}