import { NationalStandardStatusEnum, SchoolLevelEnum, SchoolRegionEnum, SchoolStatusEnum, SchoolTypeEnum, SchoolZoneEnum } from "../enums"

export interface SchoolRow {
  id: number
  code: string
  name: string
  shortName: string
  type: number
  dailyScheduleType: number
  isInternationalSchool: boolean
  canPreschool: boolean
  canPrimarySchool: boolean
  canLowerSecondarySchool: boolean
  canUpperSecondarySchool: boolean
  email: string
  hotline: string
  website: string
  admin?: {
    id: number,
    staffId: number,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    departmentName: string,
    positionTitle: string,
    status: number,
  }[]
}
export class School {
  id: number = 0;
  code: string = '';
  name: string = '';
  shortName: string = '';
  type: number = 1;
  dailyScheduleType?: number = undefined;
  isInternationalSchool: boolean = false;
  canPreschool: boolean = false;
  canPrimarySchool: boolean = false;
  canLowerSecondarySchool: boolean = false;
  canUpperSecondarySchool: boolean = false;
  canComplementaryEducation: boolean = false;
  email?: string
  hotline?: string
  website?: string
  principalFirstName?: string
  principalLastName?: string
  principalPhone?: string
  address: string = '';
  wardId: number | null = null
  provinceId: number | null = null
  wardTitle?: string
  provinceTitle?: string
  dateFounded?: Date
  ranking?: number | null = null
  project: string = ''
  fax: string = ''
  principalEmail: string = ''
  principalIsPartyMember: boolean = false
  schoolCampuses: any[] | undefined
  schoolOperation: any
  schoolFacility: any
  admin?: {
    id: number,
    email: string,
    phone: string,
    firstName: string,
    lastName: string,
    departmentName: string,
    positionTitle: string,
    isActive: boolean,
  }[]
}
export class SchoolFacilities {
  id: number = 0;
  totalArea: number = 0;
  hasMinimumTeachingEquipment: boolean = false;
  hasComputers: boolean = false;
  hasInternetAccess: boolean = false;
  hasPowerGrid: boolean = false;
  hasCleanWaterSource: boolean = false;
  hasRestrooms: boolean = false;
  hasCleanHygieneEducationProgram: boolean = false;
  hasAccessibleInfraStudentsWithDisabilities: boolean = false;
  hasStudentServiceUnit: boolean = false;
}
export class SchoolOperations {
  id: number = 0;
  nationalStandardStatus: number | null = null;
  region: number | null = null;
  zone: number | null = null;
  hasStudentsWithDisabilities: boolean = false;
  hasLifeSkillsEducation: boolean = false;
  hasBasicEducationProgram: boolean = false;
}

export class SchoolCampus {
  id: number | null = null
  code: string = ''
  name: string = ''
  address: string = ''
  wardId: number | null = null
  wardTitle?: string
  provinceId: number | null = null
  provinceTitle?: string
  hotline: string = ''
  totalArea: number | null = null
  distance: number | null = null
  meansOfTransportation: string = ''
}
// cho cac selector
export const schoolType = [
  { value: SchoolTypeEnum.CongLap.enum, text: SchoolTypeEnum.CongLap.title },
  { value: SchoolTypeEnum.TuThuc.enum, text: SchoolTypeEnum.TuThuc.title },
  { value: SchoolTypeEnum.DanLap.enum, text: SchoolTypeEnum.DanLap.title },
  { value: 4, text: 'Quốc tế' },
]
export const schoolLevel = [
  { value: SchoolLevelEnum.MamNon.enum, text: SchoolLevelEnum.MamNon.short },
  { value: SchoolLevelEnum.TieuHoc.enum, text: SchoolLevelEnum.TieuHoc.short },
  { value: SchoolLevelEnum.THCS.enum, text: SchoolLevelEnum.THCS.short },
  { value: SchoolLevelEnum.THPT.enum, text: SchoolLevelEnum.THPT.short },
]
export const schoolStatus = [
  { value: SchoolStatusEnum.ThieuQuanTriVien.enum, text: SchoolStatusEnum.ThieuQuanTriVien.title },
  { value: SchoolStatusEnum.MoiTao.enum, text: SchoolStatusEnum.MoiTao.title },
  { value: SchoolStatusEnum.DangHoatDong.enum, text: SchoolStatusEnum.DangHoatDong.title },
  { value: SchoolStatusEnum.TamDung.enum, text: SchoolStatusEnum.TamDung.title },
  { value: SchoolStatusEnum.DungVinhVien.enum, text: SchoolStatusEnum.DungVinhVien.title },
]
export const schoolNationalStandardStatus = [
  { value: NationalStandardStatusEnum.Muc1.enum, text: NationalStandardStatusEnum.Muc1.title },
  { value: NationalStandardStatusEnum.Muc2.enum, text: NationalStandardStatusEnum.Muc2.title },
  { value: NationalStandardStatusEnum.Muc3.enum, text: NationalStandardStatusEnum.Muc3.title }
]

export const schoolRegion = [
  { value: SchoolRegionEnum.BienGioiHaiDao.enum, text: SchoolRegionEnum.BienGioiHaiDao.title },
  { value: SchoolRegionEnum.DoThi.enum, text: SchoolRegionEnum.DoThi.title },
  { value: SchoolRegionEnum.DongBang.enum, text: SchoolRegionEnum.DongBang.title },
  { value: SchoolRegionEnum.MienNuiVungSau.enum, text: SchoolRegionEnum.MienNuiVungSau.title },
]

export const schoolZone = [
  { value: SchoolZoneEnum.VungI.enum, text: SchoolZoneEnum.VungI.title },
  { value: SchoolZoneEnum.VungII.enum, text: SchoolZoneEnum.VungII.title },
  { value: SchoolZoneEnum.VungIII.enum, text: SchoolZoneEnum.VungIII.title },
  { value: SchoolZoneEnum.VungIV.enum, text: SchoolZoneEnum.VungIV.title }
]