import { StudentAdmissionTypeEnum, StudentGradeEnum } from "./enums"

export class StudentRow {
  id: number = 0
  code: string = ''
  firstName: string = ''
  lastName: string = ''
  sex: number | null = null
  status: number | null = null
  gradeLevel: number | null = null
  classId: number[] | null = null
  className: string = ''
  mainStudentContact: any
}
export class StudentRequest {
  id: number = 0
  code: string = ''
  firstName: string = ''
  lastName: string = ''
  citizenId: string = ''
  dateOfIssue: Date | null = null
  dateOfExpiry: Date | null = null
  placeOfIssue: string = ''
  dateOfBirth: Date | null = null
  sex: number | null = null
  nationalityId: number = 1
  religionId: number | null = null
  permanentResidenceProvinceId: number | null = null
  permanentResidenceWardId: number | null = null
  permanentResidenceAddress: string = ''
  temporaryResidenceProvinceId: number | null = null
  temporaryResidenceWardId: number | null = null
  temporaryResidenceAddress: string = ''

  priorityPolicyId: number | null = null
  specialNeedsPolicyId: number | null = null
  admissionDate: Date | null = null
  classId: number | null = null
  admissionSchoolYearId: number | null = null
  admissionSchoolYearTitle: string = ''
  admissionType: number = StudentAdmissionTypeEnum.DungTuyen.enum
  status: number = 1
  mainContact?: any
  studentContacts?: any
  medicalInfo?: any[]

  same_as_permanent: boolean = false
}
export class StudentDetail {
  id: number = 0
  code: string = ''
  firstName: string = ''
  lastName: string = ''
  citizenId: string = ''
  dateOfIssue: Date | null = null
  dateOfExpiry: Date | null = null
  placeOfIssue: string = ''
  dateOfBirth: Date | null = null
  sex: number | null = null
  nationalityId: number = 1
  religionId: number | null = null
  nationalityTitle: string = ''
  religionTitle: string = ''
  permanentResidenceProvinceId: number | null = null
  permanentResidenceWardId: number | null = null
  permanentResidenceProvinceTitle: string = ''
  permanentResidenceWardTitle: string = ''
  permanentResidenceAddress: string = ''
  temporaryResidenceProvinceId: number | null = null
  temporaryResidenceWardId: number | null = null
  temporaryResidenceProvinceTitle: string = ''
  temporaryResidenceWardTitle: string = ''
  temporaryResidenceAddress: string = ''

  priorityPolicyId: number | null = null
  specialNeedsPolicyId: number | null = null
  priorityPolicyTitle: string = ''
  specialNeedsPolicyTitle: string = ''
  admissionDate: Date | null = null
  classId: number | null = null
  className: string = ''
  admissionSchoolYearId: number | null = null
  admissionSchoolYearTitle: string = ''
  admissionType: number | null = null
  status: number | null = null
  mainContactId: number | null = null
  mainStudentContact?: any
  studentContacts?: any[]
  studentMedicalInfo?: any[]
  gradeLevel: number | null = null
  class?: any

  same_as_permanent: boolean = false
}
export class StudentClass {
  gradeLevel: number | null = null
  id: number = 0
  code: string = ''
  name: string = ''
}
export class StudentContact {
  id: number = 0
  avatar: string = ''
  firstName: string = ''
  lastName: string = ''
  phone: string = ''
  email: string = ''
  relationship: number = 0
  relationshipTitle: string = ''
  isMainContact: boolean = false
  grantAccess?: boolean | undefined = undefined
  status?: number | undefined = undefined
  dateOfBirth?: Date | null = null
  citizenId?: string = ''
  occupation?: string = ''
}

export class StudentMedicalInfo {
  id?: number
  studentId?: number
  group?: number
  type?: number
  info?: string
}

export const studentGradeStatus = [
  { value: StudentGradeEnum.NhaTre.enum, text: StudentGradeEnum.NhaTre.title },
  { value: StudentGradeEnum.Mam.enum, text: StudentGradeEnum.Mam.title },
  { value: StudentGradeEnum.Choi.enum, text: StudentGradeEnum.Choi.title },
  { value: StudentGradeEnum.La.enum, text: StudentGradeEnum.La.title },
  { value: StudentGradeEnum.Lop1.enum, text: StudentGradeEnum.Lop1.title },
  { value: StudentGradeEnum.Lop2.enum, text: StudentGradeEnum.Lop2.title },
  { value: StudentGradeEnum.Lop3.enum, text: StudentGradeEnum.Lop3.title },
  { value: StudentGradeEnum.Lop4.enum, text: StudentGradeEnum.Lop4.title },
  { value: StudentGradeEnum.Lop5.enum, text: StudentGradeEnum.Lop5.title },
  { value: StudentGradeEnum.Lop6.enum, text: StudentGradeEnum.Lop6.title },
  { value: StudentGradeEnum.Lop7.enum, text: StudentGradeEnum.Lop7.title },
  { value: StudentGradeEnum.Lop8.enum, text: StudentGradeEnum.Lop8.title },
  { value: StudentGradeEnum.Lop9.enum, text: StudentGradeEnum.Lop9.title },
  { value: StudentGradeEnum.Lop10.enum, text: StudentGradeEnum.Lop10.title },
  { value: StudentGradeEnum.Lop11.enum, text: StudentGradeEnum.Lop11.title },
  { value: StudentGradeEnum.Lop12.enum, text: StudentGradeEnum.Lop12.title },
]
export const studentAdmissionType = [
  { value: StudentAdmissionTypeEnum.DungTuyen.enum, text: StudentAdmissionTypeEnum.DungTuyen.title },
  { value: StudentAdmissionTypeEnum.TraiTuyen.enum, text: StudentAdmissionTypeEnum.TraiTuyen.title },
  { value: StudentAdmissionTypeEnum.ChuyenTruong.enum, text: StudentAdmissionTypeEnum.ChuyenTruong.title },
]