import { SubjectTypeEnum } from "./enums"

export class CurriculumRow {
  id: number = 0
  code: string = ''
}
export class CurriculumRequest {
  id: number = 0
  code: string = ''
}
export class CurriculumDetail {
  id: number = 0
  code: string = ''
  name: string = ''
  instructionLanguageId: number | null = null
  instructionLanguageName: string = ''
  graduationDegree: string = ''
  isReceived: boolean | null = null
  canApply: boolean | null = null
  gradeLevels?: any[]
}

export class CurriculumSubjectRow {
  id: number = 0
  code: string = ''
  name: string = ''
}
export const subjectType = [
  { value: SubjectTypeEnum.BatBuoc.enum, text: SubjectTypeEnum.BatBuoc.title },
  { value: SubjectTypeEnum.TuChon.enum, text: SubjectTypeEnum.TuChon.title },
  { value: SubjectTypeEnum.LuaChon.enum, text: SubjectTypeEnum.LuaChon.title },
  { value: SubjectTypeEnum.HoatDongGiaoDucBatBuoc.enum, text: SubjectTypeEnum.HoatDongGiaoDucBatBuoc.title },
  { value: SubjectTypeEnum.NoiDungGiaoDucCuaDiaPhuong.enum, text: SubjectTypeEnum.NoiDungGiaoDucCuaDiaPhuong.title },
]