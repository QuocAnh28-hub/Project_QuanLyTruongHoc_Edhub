
export class ClassRow {
  id: number = 0
  code: string = ''
  name: string = ''
  gradeLevel: number | null = null
  curriculumId: number | null = null
  homeroomTeacherId: number | null = null
  maxClassSize: number | null = null
  classSize: number | null = null
}
export class ClassRequest {
  id: number = 0
  code: string = ''
}
export class ClassDetail {
  id: number = 0
  code: string = ''
  name: string = ''
  gradeLevel: number | null = null
  schoolYearId: number | null = null
  curriculumId: number | null = null
  curriculumName: string = ''
  firstForeignLanguageName: string = ''
  secondForeignLanguageName: string = ''
  classSize: number = 0
  maxClassSize: number = 0
  hasStudentsWithDisabilities: boolean = false
  dailyScheduleType: number | null = null
  isMultiGrade: boolean = false
  isDayBoarding: boolean = false
  hasParentRepInSchoolBoard: boolean = false
  hasParentRepInClass: boolean = false
  homeroomTeacherId: number | null = null
  homeroomTeacher: {
    firstName: string,
    lastName: string,
    id: number
  } | null = null
}

export class ClassesRequest {
  schoolYearId?: number | null = null
  gradeLevel?: number | null = null
  dailyScheduleType?: number | null = null
  isDayBoarding?: boolean | null = null
  classes?: {
    code?: string
    name?: string
    curriculum_id?: number
    max_class_size?: number
    first_foreign_language_id?: number
    second_foreign_language_id?: number
  }[]
}
