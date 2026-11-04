export enum SEX { // QCVN 109:2017/BTTTT
  NO_INFORMATION = 0, // Chưa có thông tin
  MALE = 1, // Nam
  FEMALE = 2 // Nữ
}

export enum MARITAL_STATUS { // QCVN 109:2017/BTTTT
  NO_INFORMATION = 0, // Chưa có thông tin
  SINGLE = 1, // Chưa kết hôn
  MARRIED = 2, // Đã kết hôn
  DIVORCED = 3, // Đã ly hôn hoặc goá
}

export enum SCHOOL_TYPE {
  PUBLIC = 1, // Công lập
  PRIVATE = 2, // Tư thục
  PEOPLE_FOUNDED = 3 // Dân lập
}

export enum SCHOOL_OPERATION_MODE {
  ONE_SHIFT = 1,
  TWO_SHIFTS = 2,
  SEMI_BOARDING = 3,
  BOARDING = 4
}

export enum DAILY_SCHEDULE_TYPE {
  ONE_SHIFT = 1,
  TWO_SHIFTS = 2
}

export enum ESTIMATED_LESSONS_PER_WEEK {
  FROM_FIVE_PER_WEEK = 1,
  FROM_SIX_PER_WEEK = 2,
  FROM_SIX_TO_EIGHT_PER_WEEK = 3,
  FROM_NINE_TO_TEN_PER_WEEK = 4
}

export enum IMPORT_STATUS {
  PENDING = 1, // Chờ xử lý
  PROCESSING = 2, // Đang xử lý
  COMPLETED = 3, // Hoàn thành
  FAILED = 4 // Thất bại
}

export enum STATUS {
  CREATED = 1,
  ACTIVE = 2,
  PAUSED = 3,
  TERMINATED = 4
}

export enum CONTACT_STATUS {
  CREATED = 1,
  ACTIVE = 2,
  DEACTIVATED = 3,
  LOCKED = 4
}

export enum SCHOOL_YEAR_STATUS {
  NEW = 1, // Mới tạo
  ACTIVE = 2, // Hoạt động
  CLOSED = 3 // Kết thúc
}

// export enum CONTACT_RELATION { QCVN 109:2017/BTTTT
//   NO_INFORMATION = 0, // Chưa có thông tin
//   GRANDPA = 1, // Ông
//   GRANDMA = 2, // Bà
//   FATHER = 3, // Cha
//   MOTHER = 4, // Mẹ
//   WIFE = 5, // Vợ
//   HUSBAND = 6, // Chồng
//   CHILDREN = 7, // Con
//   BROTHER = 8, // Anh
//   SISTER = 9, // Chị
//   SIBLING = 10, // Em
//   NIBLING = 11, // Cháu ruột
//   OTHER = 99, // Khác
// }
export enum CONTACT_RELATION {
  NO_INFORMATION = 0, // Chưa có thông tin
  FATHER = 1, // Cha
  MOTHER = 2, // Mẹ
  OTHER = 9, // Khác
}

export enum GRADE_LEVEL {
  GRADE_1 = 1,
  GRADE_2 = 2,
  GRADE_3 = 3,
  GRADE_4 = 4,
  GRADE_5 = 5,
  GRADE_6 = 6,
  GRADE_7 = 7,
  GRADE_8 = 8,
  GRADE_9 = 9,
  GRADE_10 = 10,
  GRADE_11 = 11,
  GRADE_12 = 12,
  NHA_TRE = 13, // nha tre
  MAM = 14, // mam
  CHOI = 15, // choi
  LA = 16 // la
}

export enum ADMISSION_TYPE {
  TRANSFER = 1,
  NON_ZONED = 2,
  ZONED = 3
}

export enum CURRICULUM_SUBJECT_TYPE {
  OPTIONAL = 1,
  REQUIRED = 2,
  ELECTIVE = 3,
  COMPULSORY_EDUCATION_ACTIVITY = 4,
  LOCAL_EDUCATION_CONTENT = 5,
}

export enum STAFF_STATUS {
  CREATED = 1,
  ACTIVE = 2,
  PAUSED = 3,
  TERMINATED = 4,
  RESIGNED = 5,
  MATERNITY_LEAVE = 6,
  LONG_TERM_LEAVE = 7,

  // 10 - 13: Staff status
  TRANSFER_IN = 10, // Chuyển đến
  TRANSFER_OUT = 12, // Chuyển đi
  MOBILIZED = 13, // Đã điều động
  WAITING_RETIREMENT = 14, // Chờ nghỉ hưu
  RETIRED = 15,
  SECONDMENT = 16 // biệt phái
}

export enum STUDENT_STATUS {
  PENDING = 1,
  STUDYING = 2,
  DEFERRED = 3,
  GRADUATED = 4,
  
  DROPPED_OUT = 50, // Thôi học trong hè: 50, thôi học kỳ 1: 51, thôi học kỳ 2: 52

  TRANSFER_IN = 100, // Chuyển đến trong hè: 100, chuyển đến kỳ 1: 101, chuyển đến kỳ 2: 102
  TRANSFER_OUT = 110, // Chuyển đi trong hè: 110, chuyển đi kỳ 1: 111, chuyển đi kỳ 2: 112
  RESTUDY = 120 // Học lại trong hè: 120, học lại kỳ 1: 121, học lại kỳ 2: 122
}

export enum STUDENT_CLASS_STATUS {
  CREATED = 1,
  ACTIVE = 2,
  COMPLETED = 3,
  TERMINATED = 4,
  TRANSFERRED = 5,
}

type EnumObject = {
  [key: string]: string | number;
  [key: number]: string; // For numeric enums' reverse mapping
};


export function getEnumValue<T extends EnumObject>(
  enumType: T,
  value: number | string | null | undefined,
  defaultValue?: T[keyof T],
): T[keyof T] | undefined {
  if (value === null || value === undefined) {
    return defaultValue;
  }
  const enumValue = enumType[Number(value)] as T[keyof T];
  return enumValue || defaultValue;
}