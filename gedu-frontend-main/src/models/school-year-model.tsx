
export class SchoolYearRow {
  id: number = 0
  title: string = ''
  fromDate: Date | null = null
  toDate: Date | null = null
  semesterCount: number = 0
  examCount: number = 0
  status: number | null = null
}
export class SchoolYearRequest {
  id: number = 0
  title: string = ''
  fromDate: Date | null = null
  toDate: Date | null = null
  semesters?: Semester[]
  examinations?: Examination[]
}
export class SchoolYearDetail {
  id: number = 0
  title: string = ''
  fromDate: Date | null = null
  toDate: Date | null = null
  semesterCount: number = 0
  examCount: number = 0
  status: number | null = null
  semesters?: Semester[]
  examinations?: Examination[]
}
class Semester {
  id?: number = 0
  title?: string = ''
  fromDate?: Date | null = null
  toDate?: Date | null = null
  examinations?: Examination[]
  isDeleted?: boolean | undefined = undefined
}
class Examination {
  id?: number = 0
  title?: string = ''
  fromDate?: Date | null = null
  toDate?: Date | null = null
  isDeleted?: boolean | undefined = undefined
}

// CREATE MODELs

export class SchoolYearCreateForm {
  id: number = 0
  title: string = ''
  school_year_date_range: any | null = null
  semesters?: {
    id?: number
    key: string
    title?: string
    semester_date_range?: any
    examinations?: any[]
  }[]
  examinations?: {
    id?: number
    key: string
    title?: string
    semester_id?: number
    semester_key?: string
    examination_date_range?: any
  }[]
}
export const default_create_form = {
  semesters: [{
    key: 'hoc-ky-1',
    title: 'Học kỳ I'
  }, {
    key: 'hoc-ky-2',
    title: 'Học kỳ II'
  }],
  examinations: [{
    key: 'ky-thi-1',
    title: 'Giữa học kỳ I',
    semester_key: 'hoc-ky-1'
  }, {
    key: 'ky-thi-2',
    title: 'Cuối học kỳ I',
    semester_key: 'hoc-ky-1'
  }, {
    key: 'ky-thi-2',
    title: 'Giữa học kỳ II',
    semester_key: 'hoc-ky-2'
  }, {
    key: 'ky-thi-2',
    title: 'Cuối học kỳ II',
    semester_key: 'hoc-ky-2'
  }]
} as SchoolYearCreateForm