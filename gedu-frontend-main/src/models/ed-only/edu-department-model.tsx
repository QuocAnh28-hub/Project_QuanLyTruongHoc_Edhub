
export class EduDepartmentRow {
  id: number = 0
  code: string = ''
  name: string = ''
  count?: number | null = null
  parentId: number | null = null
  children?: EduDepartmentRow[]
}

export class EduDepartmentRowCount {
  id: number = 0
  count: number | null = null
  parentId: number | null = null
}
export class EduDepartmentRequest {
  id: number = 0
  code: string = ''
}
export class EduDepartmentDetail {
  id: number = 0
  code: string = ''
  name: string = ''
  memberCount: number | null = null
  headPositions?: HeadPosition[]
  parentId?: number | null = null
  parentDepartmentName: string = ''
  subDepartments?: EduDepartmentDetail[]
}
class HeadPosition {
  id: number | null = null
  firstName: string = ''
  lastName: string = ''
  email: string = ''
  phone: string = ''
  positionTitle: string = ''
}