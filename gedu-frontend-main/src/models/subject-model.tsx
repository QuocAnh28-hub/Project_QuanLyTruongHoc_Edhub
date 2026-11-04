
export class SubjectRow {
  id: number = 0
  code: string = ''
  name: string = ''
  canApply: boolean | null = null
}
export class SubjectRequest {
  id: number = 0
  code: string = ''
  name: string = ''
  canApply: boolean | null = null
}
export class SubjectDetail {
  id: number = 0
  code: string = ''
  name: string = ''
  canApply: boolean | null = null
  departments?: any[]
}
export class SubjectCurriculumRow {
  id: number = 0
  code: string = ''
  name: string = ''
  assignedGradeLevels?: SubjectCurriculumGradeLevel[]
}
export class SubjectCurriculumGradeLevel {
  id: number | null = null
  name: string = ''
  subjectType: number | null = null
  commentsBased: boolean | null = null
  scoringBased: boolean | null = null
  lessonsPerWeek: number | null = null
}