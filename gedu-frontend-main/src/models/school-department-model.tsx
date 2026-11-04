
export class SchoolDepartmentRow {
  id: number = 0
  code: string = ''
  name: string = ''
  count?: number | null = null
  parentId: number | null = null
  children?: SchoolDepartmentRow[]
}

export class SchoolDepartmentRowCount {
  id: number = 0
  count: number | null = null
  parentId: number | null = null
}
export class SchoolDepartmentRequest {
  id: number = 0
  code: string = ''
}
export class SchoolDepartmentDetail {
  id: number = 0
  code: string = ''
  name: string = ''
  memberCount: number | null = null
  headPositions?: HeadPosition[]
  parentId?: number | null = null
  parentDepartmentName: string = ''
  subDepartments?: SchoolDepartmentDetail[]
}
class HeadPosition {
  id: number | null = null
  firstName: string = ''
  lastName: string = ''
  email: string = ''
  phone: string = ''
  positionTitle: string = ''
}