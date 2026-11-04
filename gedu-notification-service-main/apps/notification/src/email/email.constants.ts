export const EMAIL_FROM = 'Sở Giáo dục - Hệ thống Gedu <support@gedu.vn>';
export const EMAIL_HOST = 'smtp.gmail.com';
export const EMAIL_PORT = 587;

export const ADMIN_EMAIL_TEMPLATE = 'activate-school-admin';
export const STAFF_EMAIL_TEMPLATE = 'activate-staff-account';

export const WEB_ADMIN_URL = 'https://gedu.vn';
export const ADMIN_USER_GUIDE_URL = 'https://docs.gedu.vn/';
export const WEB_STAFF_URL = 'https://gedu.vn';
export const STAFF_USER_GUIDE_URL = 'https://docs.gedu.vn/';
export const SUPPORT_EMAIL = 'support@gedu.vn';
export const SUPPORT_PHONE = '0909090909';

export const EmailTemplates = {
  ACTIVATE_SCHOOL_ADMIN: 'activate-school-admin',  // file: activate-school-admin.hbs
  ACTIVATE_STAFF: 'activate-staff',                // file: activate-staff.hbs
  RESET_PASSWORD: 'reset-password',                // file: reset-password.hbs
  IMPORT_FILE_STATUS: 'import-file-status',        // file: import-file-status.hbs
  CHANGE_PASSWORD: 'change-password',              // file: change-password.hbs
} as const;

export interface EmailConfig {
  from: string;
  urls: {
    accessLink: string;
  };
  support: {
    email: string;
    phone: string;
  };
}

export const EMAIL_CONFIG_KEY = "EMAIL_CONFIG_KEY";
export const EMAIL_SMTP_CONFIG_KEY = "EMAIL_SMTP_CONFIG_KEY";
export const EMAIL_MS_GRAPH_CONFIG_KEY = "EMAIL_MS_GRAPH_CONFIG_KEY";
export const EMAIL_MAILERSEND_API_KEY = "MAILERSEND_API";

export const DEFAULT_EMAIL_CONFIG: EmailConfig = {
  from: `Hệ thống Gedu <${process.env.MAIL_FROM || "no-reply@gedu.vn"}>`,
  urls: {
    accessLink: process.env.WEB_ACCESS_LINK || 'https://gedu.vn'
  },
  support: {
    email: process.env.WEB_SUPPORT_EMAIL || 'hotro@gedu.vn',
    phone: process.env.WEB_SUPPORT_PHONE || '0931 441 213',
  },
};
