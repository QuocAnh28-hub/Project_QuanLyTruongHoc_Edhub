export type SMTPConfig = {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

export type MailerSendAPIConfig = {
  apiKey: string;
}

export type MsGraphConfig = {
  tenantId: string;
  clientId: string;
  clientSecret: string;
}

export type SendEmailConfig = {
  mailFrom: string;
  accessLink: string;
  supportEmail: string;
  supportPhone: string;
}

export type MailPayload = {
}

export type SendAdminAccountEmailPayload = MailPayload & {
  schoolName: string;
  adminName: string;
  email: string;
  password: string;
  accessLink?: string;
}

export type SendStaffAccountEmailPayload = MailPayload & {
  schoolName: string;
  staffName: string;
  email: string;
  password: string;
  accessLink?: string;
}

export type SendChangePasswordEmailPayload = MailPayload & {
  staffName: string;
}

export type SendResetPasswordEmailPayload = MailPayload & {
  staffName: string;
  username: string;
  password: string;
  accessLink?: string;
  supportEmail?: string;
  supportPhone?: string;
}

export type SendImportFileStatusEmailPayload = MailPayload & {
  fileName: string;
  totalCount: number;
  successCount: number;
  failureCount: number;
}