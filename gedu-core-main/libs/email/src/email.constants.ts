export const EmailTemplates = {
  ACTIVATE_SCHOOL_ADMIN: 'activate-school-admin',  // file: activate-school-admin.hbs
  ACTIVATE_STAFF: 'activate-staff',                // file: activate-staff.hbs
  RESET_PASSWORD: 'reset-password',                // file: reset-password.hbs
  IMPORT_FILE_STATUS: 'import-file-status',        // file: import-file-status.hbs
  CHANGE_PASSWORD: 'change-password',              // file: change-password.hbs
} as const;


export const KAFKA_EMAIL_SERVICE = 'KAFKA_EMAIL_SERVICE';
export const KAFKA_EMAIL_TOPIC = 'gedu.notification.send.email';

export const EMAIL_CONFIG_TOKEN = 'EMAIL_CONFIG';