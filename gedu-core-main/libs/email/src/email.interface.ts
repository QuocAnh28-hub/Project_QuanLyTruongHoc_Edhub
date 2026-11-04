export interface EmailPayload {
  id?: string;
  to: string;
  template: string;
  metadata:
    | ActivateSchoolAdminMetadata
    | ActivateStaffMetadata
    | ResetPasswordMetadata
    | ImportFileStatusMetadata
    | ChangePasswordMetadata;
}

export interface ActivateSchoolAdminMetadata {
  schoolName: string;
  adminName: string;
  email: string;
  password: string;
  accessLink?: string;
}

export interface ActivateStaffMetadata {
  schoolName: string;
  staffName: string;
  email: string;
  password: string;
  accessLink?: string;
}

export interface ResetPasswordMetadata {
  staffName: string;
  username: string;
  password: string;
  accessLink?: string;
  supportEmail?: string;
  supportPhone?: string;
}

export interface ImportFileStatusMetadata {
  fileName: string;
  totalCount: number;
  successCount: number;
  failureCount: number;
}

export interface ChangePasswordMetadata {
  staffName: string;
}
