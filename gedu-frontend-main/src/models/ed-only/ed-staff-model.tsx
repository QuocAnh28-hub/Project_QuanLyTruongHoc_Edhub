
export class EDStaffRow {
  id: number = 0
  userId: number = 0
  firstName: string = ''
  lastName: string = ''
  schoolDepartment?: { id: number, name: string }
  departmentId: number = 0
  positionId: number = 0
  schoolPositions?: [{ id: number, title: string }]
  email: string = ''
  phone?: string
  isActive: boolean = false
}

export class EDStaff {
  id: number | null = null
  code: string = ''
  orgId: number | null = null
  userId: number | null = null
  firstName: string = ''
  lastName: string = ''
  sex: number | null = null
  departmentId: number | null = null
  departmentName: string = ''
  positionId: number | null = null
  positionTitle: string = ''
  schoolPositions?: [{ id: number, title: string }]
  email: string = ''
  phone: string = ''
  ethnic: number | null = null
  placeOfResidence?: string
  citizenId: string = ''
  dateOfIssue: Date | null = null
  dateOfExpiry: Date | null = null
  dateOfBirth: Date | null = null
  placeOfIssue: string = ''
  originPlaceProvinceId: number | null = null
  originPlaceWardId: number | null = null
  originPlaceProvinceTitle?: string
  originPlaceWardTitle?: string
  originPlaceAddress?: string
  permanentResidenceProvinceId: number | null = null
  permanentResidenceWardId: number | null = null
  permanentResidenceProvinceTitle?: string
  permanentResidenceWardTitle?: string
  permanentResidenceAddress?: string
  temporaryResidenceProvinceId: number | null = null
  temporaryResidenceWardId: number | null = null
  temporaryResidenceProvinceTitle?: string
  temporaryResidenceWardTitle?: string
  temporaryResidenceAddress?: string
  maritalStatus: number | null = null
  address?: string
  ethnicityId: number | null = null
  ethnicityTitle: string = ''
  nationalityId: number | null = 1
  nationalityTitle: string = ''
  religionId: number | null = null
  religionTitle: string = ''
  contactPhone1: string = ''
  contactPhone2: string = ''
  status: number = 1

  same_as_permanent: boolean = false
}

export class EDStaffRequest {
  id: number = 0
  code: string = ''
  firstName: string = ''
  lastName: string = ''
  sex: number | null = null
  email: string = ''
  phone: string = ''
  citizenId: string = ''
  dateOfIssue: Date | null = null
  dateOfExpiry: Date | null = null
  dateOfBirth: Date | null = null
  placeOfIssue: string = ''
  permanentResidenceProvinceId: number | null = null
  permanentResidenceWardId: number | null = null
  temporaryResidenceProvinceId: number | null = null
  temporaryResidenceWardId: number | null = null
  temporaryResidenceAddress: string = ''
  ethnicityId: number | null = null
  nationalityId: number | null = 1
  religionId: number | null = null
  contactPhone: string = ''
  contactPhone2: string = ''

  departmentId: number | null = null
  positionId: number | null = null

  same_as_permanent: boolean = false
}