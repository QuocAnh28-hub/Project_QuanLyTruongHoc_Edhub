
export const PAGE_MAX_WIDTH = 4000
export const CONTENT_MAX_WIDTH = 1321
export const CONTENT_SMALL_WIDTH = 860
export const PAGE_HEADER_ZINDEX = 99
export const PAGE_TITLE_PREFIX = 'Gedu'
export const PAGINATE_DEFAULT_SIZE = 10
export const PAGINATE_MAX_SIZE = 100
export const STARTED_SCHOOL_ORG_ID = 100001

export enum EDRoles {
  ADMIN = 'ed-admin',
  MOD = 'ed-mod',
}
export enum ScRoles {
  DASHBOARD = 'dshbrd_r',

  SCHOOLYEAR_ALL = 'schlyr_a',
  SCHOOLYEAR_READ = 'schlyr_r',

  GRADE_ALL = 'grd_a',
  GRADE_READ = 'grd_r',

  CURRICULUM_ALL = 'crrclm_a',
  CURRICULUM_READ = 'crrclm_r',

  STUDENT_ALL = 'stdnt_a',
  STUDENT_READ = 'stdnt_r',

  STAFF_ALL = 'stff_a',
  STAFF_READ = 'stff_r',

  DEPARTMENT_ALL = 'schldprtmnt_a',
  DEPARTMENT_READ = 'schldprtmnt_r',

  PERMISSION_ALL = 'prmssn_a',
  PERMISSION_READ = 'prmssn_r',
}