export const SCHOOL_LEVEL_MAP = {
  "mam-non": 1,
  "tieu-hoc": 2,
  "thcs": 3,
  "thpt": 4
};
export const SCHOOL_LEVEL_SEPARATOR = "&";

export const SCHOOL_TYPE_MAP = {
  "cong-lap": 1,
  "tu-thuc": 2,
  "dan-lap": 3
};

export const SCHOOL_DAILY_SCHEDULE_TYPE_MAP = {
  "1-buoi": 1,
  "2-buoi": 2,
  "ban-tru": 3,
  "noi-tru": 4
};

export const CODE_REGEX = /^[A-Z0-9_]{3,20}$/;

export const REGEX = {
  schoolLevelRange: /^[1-4]([&-][1-4])*$/,
  schoolCode: CODE_REGEX,
};


export const COLUMN_MAPPING = [
  'code', // Column 1: Mã trường/School code (required, unique)
  'name', // Column 2: Tên trường/School name (required)
  'type', // Column 3: Loại trường/School type (Công Lập, Tư Thục, Dân Lập)
  'schoolLevel', // Column 4: Cấp học/Education levels (Mầm Non, Tiểu Học, THCS, THPT)
  'ward', // Column 5: Tên phường/Ward name
  'address', // Column 6: Địa chỉ/Address
  'principalLastName', // Column 7: Họ hiệu trưởng/Principal last name
  'principalFirstName', // Column 8: Tên hiệu trưởng/Principal first name
  'principalPhone', // Column 9: SĐT hiệu trưởng/Principal phone
  'email', // Column 10: Email trường/School email
  'hotline', // Column 11: Đường dây nóng/Hotline
  'dailyScheduleType', // Column 12: Loại lịch học/Schedule type (1 buổi, 2 buổi, ban trú, nội trú)
  'website', // Column 13: Website trường/School website
  'isInternational', // Column 14: Trường quốc tế/Is international (Không, Có)
  'isSchoolForGifted', // Column 15: Trường chuyên/Is school for gifted (Không, Có)
  'adminEmail', // Column 16: Email quản trị/Admin email
  'adminLastName', // Column 17: Họ quản trị/Admin last name
  'adminFirstName', // Column 18: Tên quản trị/Admin first name
  'adminPhone', // Column 19: SĐT quản trị/Admin phone
];