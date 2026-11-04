
export class EDPositionRow {
  id: number = 0
  code: string = ''
  title: string = ''
}
export class EDPositionRequest {
  id: number = 0
  code: string = ''
}

export class EDPositionDetail {
  id: number = 0
  code: string = ''
  title: string = ''
  memberCount: number | null = null
  departmentId: number | null = null
  department?: SimpleEduDepartment
}
class SimpleEduDepartment {
  id: number = 0
  code: string = ''
  name: string = ''
  parentId: number | null = null
}