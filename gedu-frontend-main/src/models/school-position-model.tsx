
export class SchoolPositionRow {
  id: number = 0
  code: string = ''
  title: string = ''
}
export class SchoolPositionRequest {
  id: number = 0
  code: string = ''
}

export class SchoolPositionDetail {
  id: number = 0
  code: string = ''
  title: string = ''
  memberCount: number | null = null
  departmentId: number | null = null
  department?: SimpleSchoolDepartment
}
class SimpleSchoolDepartment {
  id: number = 0
  code: string = ''
  name: string = ''
  parentId: number | null = null
}