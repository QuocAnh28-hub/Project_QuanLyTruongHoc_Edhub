import dayjs from "dayjs"
import { StudentGradeEnum, StudentGradeModel } from "../models/enums"
import { studentGradeStatus } from "../models/student-model"

export const DATETIME_FORMAT_TYPES = {
  long: 'DD/MM/YYYY HH:mm:ss',
  date: 'DD-MM',
  long_date: 'DD/MM/YYYY',
  time: 'HH:mm:ss',
  hour: 'HH:mm',
  custom: 'custom'
}
export function ToFormatedDate(
  time_z?: string | Date | null,
) {
  if (!time_z) return undefined
  return dayjs(time_z).format(DATETIME_FORMAT_TYPES.long_date)
}
// export function ToFormatedCustomDate(
//   time_z: string | Date,
//   format_type: keyof typeof DATETIME_FORMAT_TYPES = 'long_date',
//   format: string = '',
//   timezone: number = 7,
// ) {
//   if (!time_z) return ''
//   if (format_type !== 'custom')
//     format = DATETIME_FORMAT_TYPES[format_type]
//   return dayjs(time_z).format(format)
//   // return dayjs(time_z).utcOffset(60 * timezone).format(format)
// }
export function ToFormatedNumber(input?: number | null, locale = 'vi-VN') {
  if (locale == 'vi-VN') locale = 'en-US'
  if (input == null || input == undefined || isNaN(input)) return null
  return Number(input).toLocaleString(locale);
}
export function ToFullNameByLocale(first_name?: string, last_name?: string, locale = 'vi-VN') {
  first_name = first_name?.trim() || ''
  last_name = last_name?.trim() || ''
  let full_name = ''
  switch (locale) {
    case 'vi-VN':
    default:
      full_name = last_name + ' ' + first_name
      break;
  }
  return full_name.trim()
}

export function SplitNameByLocale(full_name?: string, locale = 'vn') {
  full_name = full_name?.trim()
  let first_name = '', last_name = ''
  if (!full_name || !full_name.length)
    return { first_name, last_name }
  const list = full_name.split(' ')
  switch (locale) {
    case 'vn':
    default:
      first_name = list.pop() || ''
      last_name = list.join(' ')
      break;
  }
  return { firstName: first_name, lastName: last_name }
}

export function ToUsername(type: 'staff' | 'student-contact', user_name?: string, email?: string, phone?: string) {
  switch (type) {
    case 'student-contact':
      if (user_name?.length)
        return user_name.trim()
      if (phone?.length)
        return phone.trim()
      if (email?.length)
        return email.trim()
      return '---'
    case 'staff':
    default:
      if (user_name?.length)
        return user_name.trim()
      if (email?.length)
        return email.trim()
      if (phone?.length)
        return phone.trim()
      return '---'
  }
}
export function ToAssessmentBased(commentsBased: boolean | null | undefined, scoringBased: boolean | null | undefined) {
  if (commentsBased && scoringBased)
    return 'Kết hợp nhận xét và điểm số'
  if (commentsBased) return 'Nhận xét'
  if (scoringBased) return 'Điểm số'
}
export function ToFullAddress(province?: string, ward?: string, address?: string) {
  const comma = ','
  let _address = address || ''
  if (ward) _address += comma + ' ' + ward
  if (province) _address += comma + ' ' + province
  if (_address[0] === ',') _address = _address.slice(1)
  return _address.trim()
}
export function GetGradeLevels(
  canPreschool: boolean | undefined,
  canPrimarySchool: boolean | undefined,
  canLowerSecondarySchool: boolean | undefined,
  canUpperSecondarySchool: boolean | undefined
) {
  const _list = [] as StudentGradeModel[]
  if (canPreschool) {
    _list.push(StudentGradeEnum.NhaTre)
    _list.push(StudentGradeEnum.Mam)
    _list.push(StudentGradeEnum.Choi)
    _list.push(StudentGradeEnum.La)
  }
  if (canPrimarySchool) {
    _list.push(StudentGradeEnum.Lop1)
    _list.push(StudentGradeEnum.Lop2)
    _list.push(StudentGradeEnum.Lop3)
    _list.push(StudentGradeEnum.Lop4)
    _list.push(StudentGradeEnum.Lop5)
  }
  if (canLowerSecondarySchool) {
    _list.push(StudentGradeEnum.Lop6)
    _list.push(StudentGradeEnum.Lop7)
    _list.push(StudentGradeEnum.Lop8)
    _list.push(StudentGradeEnum.Lop9)
  }
  if (canUpperSecondarySchool) {
    _list.push(StudentGradeEnum.Lop10)
    _list.push(StudentGradeEnum.Lop11)
    _list.push(StudentGradeEnum.Lop12)
  }
  return _list
}

export function GetDeptTemplateId(
  canPreschool: boolean | undefined,
  canPrimarySchool: boolean | undefined,
  canLowerSecondarySchool: boolean | undefined,
  canUpperSecondarySchool: boolean | undefined
) {
  if (canUpperSecondarySchool) return 3
  if (canLowerSecondarySchool) return 2
  if (canPrimarySchool) return 1
  return 1
}

const SEPERATOR = ', '
function JoinNoEmpty(_arr: any[], seperator: string) {
  return _arr?.filter(Boolean).join(seperator) || ''
}
export function ToGradeLevelList(grade_levels?: number[]) {
  if (!grade_levels) return ''
  grade_levels.sort((a, b) => a - b)
  const str_grades = grade_levels.filter(gl => gl > 12)
  const num_grades = grade_levels.filter(gl => gl <= 12)
  let result = JoinNoEmpty(str_grades.map(g => { return studentGradeStatus.find(s => s.value == g)?.text }), SEPERATOR)
  if (num_grades?.length) {
    let start = num_grades[0]
    let end = num_grades[0]
    for (let i = 1; i < num_grades.length; i++) {
      if (end + 1 == num_grades[i]) end++
      else {
        if (start == end)
          result = JoinNoEmpty([result, 'Khối ' + start], SEPERATOR)
        else
          result = JoinNoEmpty([result, 'Khối ' + start + ' → ' + end], SEPERATOR)
        start = num_grades[i]
        end = num_grades[i]
      }
    }
    if (start == end) result = JoinNoEmpty([result, 'Khối ' + start], SEPERATOR)
    else {
      result = JoinNoEmpty([result, 'Khối ' + start + ' → ' + end], SEPERATOR)
    }

  }
  return result
}
export function ToAvatarLetters(first_name?: string | null, last_name?: string | null) {
  let letters = ''
  if (last_name) letters += last_name[0]
  if (first_name) letters += first_name[0]
  letters.toUpperCase()
  return letters || '?'
}