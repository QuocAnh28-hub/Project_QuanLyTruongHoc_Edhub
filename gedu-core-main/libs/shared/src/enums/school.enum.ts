import { GRADE_LEVEL } from './db.enum';

export enum EDUCATION_LEVEL {
  PRESCHOOL = 1,
  PRIMARY = 2,
  SECONDARY = 3,
  TERTIARY = 4,
}

export enum SCHOOL_LEVEL {
  PRESCHOOL = 'PRESCHOOL',
  PRIMARY = 'PRIMARY',
  LOWER_SECONDARY = 'LOWER_SECONDARY',
  UPPER_SECONDARY = 'UPPER_SECONDARY',
}

export enum SCHOOL_EXTEND_STATUS {
  CREATED = 1,
  ACTIVE = 2,
  PAUSED = 3,
  TERMINATED = 4,
  NO_ADMIN = 5,
}

// TODO: Check usage of this enum
export const GRADE_LEVEL_NAME: Record<string, string> = {
  [GRADE_LEVEL.NHA_TRE]: 'Nhà trẻ',
  [GRADE_LEVEL.MAM]: 'Mầm',
  [GRADE_LEVEL.CHOI]: 'Chồi',
  [GRADE_LEVEL.LA]: 'Lá',
  [GRADE_LEVEL.GRADE_1]: 'Khối 1',
  [GRADE_LEVEL.GRADE_2]: 'Khối 2',
  [GRADE_LEVEL.GRADE_3]: 'Khối 3',
  [GRADE_LEVEL.GRADE_4]: 'Khối 4',
  [GRADE_LEVEL.GRADE_5]: 'Khối 5',
  [GRADE_LEVEL.GRADE_6]: 'Khối 6',
  [GRADE_LEVEL.GRADE_7]: 'Khối 7',
  [GRADE_LEVEL.GRADE_8]: 'Khối 8',
  [GRADE_LEVEL.GRADE_9]: 'Khối 9',
  [GRADE_LEVEL.GRADE_10]: 'Khối 10',
  [GRADE_LEVEL.GRADE_11]: 'Khối 11',
  [GRADE_LEVEL.GRADE_12]: 'Khối 12',
};
