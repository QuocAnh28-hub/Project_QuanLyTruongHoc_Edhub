import { Observable } from "rxjs";

export interface SchoolImportService {
  importSchools(
    request: ImportSchoolsRequest
  ): Observable<ImportSchoolsResponse>;
}

export interface SchoolImportRequest {
  code: string;
  name: string;
  type: number;
  address: string;
  dailyScheduleType: number;
  email: string;
  website: string;
  hotline: string;
  principalFirstName: string;
  principalLastName: string;
  principalPhone: string;
  ward: string;
  isSchoolForGifted: boolean;
  canPreschool: boolean;
  canPrimarySchool: boolean;
  canLowerSecondarySchool: boolean;
  canUpperSecondarySchool: boolean;
  isInternationalSchool: boolean;
  admin: AdminInfo | null;
}

export interface AdminInfo {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface SchoolImportResponse {
  id: number;
  success: boolean;
  message: string;
}

export interface ImportSchoolsRequest {
  jobId: string;
  orgId: number;
  schools: SchoolImportRequest[];
  email: string;
  fileName: string;
  createdBy: number;
}

export interface ImportSchoolsResponse {
  results: SchoolImportResult[];
  totalCount: number;
  successCount: number;
  failureCount: number;
}

export interface SchoolImportResult {
  id: number;
  success: boolean;
  message: string;
}
