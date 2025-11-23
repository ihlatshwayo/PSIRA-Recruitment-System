export interface SiftingResult {
  name: string;
  surname: string;
  province: string;
  driversLicensePoints: number;
  qualificationPoints: number;
  experiencePoints: number;
  totalPoints: number;
  meetsRequirements: boolean;
  cvFilePath: string;
}