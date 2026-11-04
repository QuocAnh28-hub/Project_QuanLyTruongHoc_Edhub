import { Observable } from "rxjs";

export interface StudentImportService {
  importStudents(request: ImportStudentRequest): Observable<ImportStudentResponse>;
}

export interface StudentImport {
  code: string;
  firstName: string;
  lastName: string;
  citizenId?: string;
  dateOfBirth?: Date;
  /**
   * Sex of the student
   * Valid values: 1 (male), 2 (female)
   */
  sex?: number;
  nationality?: string;
  religion?: string;

  permanentResidenceProvince?: string;
  permanentResidenceWard?: string;
  permanentResidenceAddress?: string;

  temporaryResidenceProvince?: string;
  temporaryResidenceWard?: string;
  temporaryResidenceAddress?: string;

  guardians?: StudentGuardian[];
  admissionInfo?: StudentAdmission;
  medicalInfo?: StudentMedicalInfo;
}

export interface StudentGuardian {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
  /**
   * Relationship to student
   * Valid values should be documented (e.g., 1: Parent, 2: Guardian, etc.)
   */
  relationship?: number;
  relationshipTitle?: string;
}

export interface StudentAdmission {
  admissionDate?: Date;
  admissionType?: number;
  admissionSchoolYear?: string;
  gradeLevel?: number;
  className?: string;
  priorityPolicy?: string;
  disabilityPolicy?: string;
  youngPioneerJoinDate?: Date;
  youngPioneerTitle?: string;
  youthUnionJoinDate?: Date;
  youthUnionTitle?: string;
  communistPartyJoinDate?: Date;
  communistPartyTitle?: string;
}

export interface StudentMedicalInfo {
  foodAllergy?: string;
  drugAllergy?: string;
  disease?: string;
  note?: string;
}

export interface ImportStudentRequest {
  orgId: number;
  students: StudentImport[];
  createdBy: number;
  email: string;
  fileName: string;
}

export interface ImportStudentResponse {
  results: StudentImportResult[];
  totalCount: number;
  successCount: number;
  failureCount: number;
}

export interface StudentImportResult {
  id: number;
  success: boolean;
  message: string;
}
