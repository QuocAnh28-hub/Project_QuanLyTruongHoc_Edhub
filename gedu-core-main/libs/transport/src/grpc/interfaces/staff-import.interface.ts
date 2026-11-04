import { Observable } from "rxjs";

export interface StaffImportService {
  importStaffs(request: ImportStaffRequest): Observable<ImportStaffResponse>;
}

export interface StaffImportRequest {
  code: string;
  firstName: string;
  lastName: string;
  citizenId: string;
  email: string;
  dateOfBirth?: Date;
  dateOfIssue?: Date;
  dateOfExpiry?: Date;
  placeOfIssue?: string;
  permanentResidenceProvince?: string;
  permanentResidenceWard?: string;
  permanentResidenceAddress?: string;
  temporaryResidenceProvince?: string;
  temporaryResidenceWard?: string;
  temporaryResidenceAddress?: string;
  /**
   * Sex of the staff member
   * Valid values: 1 (male), 2 (female)
   */
  sex?: number;
  contactPhone?: string;
  contactPhone2?: string;
  position?: string;
  department?: string;
  nationality?: string;
  religion?: string;
  phone?: string;
  schoolPosition?: string;
}

export interface EducationLevel {
  id: number;
  name: string;
  description: string;
}

export interface ImportStaffRequest {
  orgId: number;
  staffs: StaffImportRequest[];
  createdBy: number;
  email: string;
  fileName: string;
}

export interface ImportStaffResponse {
  results: StaffImportResult[];
  totalCount: number;
  successCount: number;
  failureCount: number;
}

export interface StaffImportResult {
  id: number;
  success: boolean;
  message: string;
}
