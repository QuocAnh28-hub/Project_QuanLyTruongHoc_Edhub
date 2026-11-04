export const BOOL_MAPPING = {
  "khong": 0,
  "co": 1
}

export const SEX_MAPPING = {
  "nam": 1,
  "nu": 2
}

export const CONTACT_RELATION_MAPPING = {
  "cha": 1,
  "me": 2,
  "khac": 9
}

export const CODE_REGEX = /^[A-Z0-9_-]{3,20}$/;

export const PHONE_REGEX = /^(0|\+84)([1-9])[0-9]{8}$/;

export enum IMPORT_TYPE {
  SCHOOL_IMPORT = 'SCHOOL_IMPORT',
  STUDENT_IMPORT = 'STUDENT_IMPORT',
  STAFF_IMPORT = 'STAFF_IMPORT',
}