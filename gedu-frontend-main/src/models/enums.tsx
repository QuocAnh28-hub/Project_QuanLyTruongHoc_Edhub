export const GenderEnum = {
  Nam: { enum: 1, title: 'Nam' },
  Nu: { enum: 2, title: 'Nữ' },
}
export function getGenderEnum(_value?: number | null) {
  switch (_value) {
    case GenderEnum.Nam.enum:
      return GenderEnum.Nam
    case GenderEnum.Nu.enum:
      return GenderEnum.Nu
    default:
      return null
  }
}
export const SchoolTypeEnum = { // Loai hinh
  CongLap: { enum: 1, title: 'Công lập' },
  TuThuc: { enum: 2, title: 'Tư thục' },
  DanLap: { enum: 3, title: 'Dân lập' },
  NgoaiCongLap: { enum: 4, title: 'Ngoài công lập' },
  CongLapTuChu: { enum: 5, title: 'Công lập tự chủ' },
}
export function getSchoolTypeEnum(_value: number) {
  switch (_value) {
    case SchoolTypeEnum.CongLap.enum:
      return SchoolTypeEnum.CongLap
    case SchoolTypeEnum.TuThuc.enum:
      return SchoolTypeEnum.TuThuc
    case SchoolTypeEnum.DanLap.enum:
      return SchoolTypeEnum.DanLap
    case SchoolTypeEnum.NgoaiCongLap.enum:
      return SchoolTypeEnum.NgoaiCongLap
    case SchoolTypeEnum.CongLapTuChu.enum:
      return SchoolTypeEnum.CongLapTuChu
    default:
      return null
  }
}
export const SchoolLevelEnum = { // Cap hoc
  MamNon: { enum: 1, title: 'Mầm non', short: 'Mầm non' },
  TieuHoc: { enum: 2, title: 'Tiểu học', short: 'Tiểu học' },
  THCS: { enum: 3, title: 'Trung học cơ sở', short: 'THCS' },
  THPT: { enum: 4, title: 'Trung học phổ thông', short: 'THPT' },
  TTGDTX: { enum: 5, title: 'Trung tâm giáo dục thường xuyên', short: 'GDTX' },
  LienCap: { enum: 0, title: 'Liên cấp', short: 'Liên cấp' },
}
export const SchoolDailyScheduleEnum = {
  OnePerDay: { enum: 1, title: 'Một buổi/ngày' },
  TwicePerDay: { enum: 2, title: 'Hai buổi/ngày' },
  DayBoarding: { enum: 3, title: 'Bán trú' },
  Boarding: { enum: 4, title: 'Nội trú' }
}
export const SchoolStatusEnum = { // Gedu status
  MoiTao: { enum: 1, title: 'Chờ kích hoạt' },
  DangHoatDong: { enum: 2, title: 'Đang hoạt động' },
  TamDung: { enum: 3, title: 'Tạm dừng hoạt động' },
  DungVinhVien: { enum: 4, title: 'Đã dừng hoạt động' },
  ThieuQuanTriVien: { enum: 5, title: 'Thiếu quản trị viên' },
}

export const ReportReadyStatusEnum = {
  ChuaTongHop: { enum: 1, title: 'Chưa tổng hợp' },
  DangTongHop: { enum: 2, title: 'Đang tổng hợp' },
  DaTongHop: { enum: 3, title: 'Đã tổng hợp' },
}
export const AccountStatusEnum = {
  ChuaKichHoat: { enum: 1, title: 'Chưa kích hoạt' },
  DangHoatDong: { enum: 2, title: 'Đang hoạt động' },
  TamKhoa: { enum: 3, title: 'Tạm khoá' },
  KhoaVinhVien: { enum: 4, title: 'Đã khoá' }
}

export const SchoolStaffStatusEnum = {
  MoiTao: { enum: 1, title: 'Chưa kích hoạt' },
  DangHoatDong: { enum: 2, title: 'Đang hoạt động' },
  TamDungHoatDong: { enum: 3, title: 'Tạm dừng hoạt động' },
  DinhChiCongTac: { enum: 4, title: 'Đình chỉ công tác' },
  DaNghiViec: { enum: 5, title: 'Đã nghỉ việc' },
  NghiThaiSan: { enum: 6, title: 'Nghỉ thai sản' },
  NghiPhepDaiHan: { enum: 7, title: 'Nghỉ phép dài hạn' }
}
export const MaritalStatus = {
  DocThan: { enum: 1, title: 'Độc thân' },
  DaKetHon: { enum: 2, title: 'Đã kết hôn' },
  DaLyHon: { enum: 3, title: 'Đã ly hôn' },
  VoHoacChongDaMat: { enum: 4, title: 'Vợ/Chồng đã mất' },
  KhongXacDinh: { enum: 9, title: 'Không xác định' },
}

export const StudentStatusEnum = {
  ChoNhapHoc: { enum: 1, title: 'Chờ nhập học' },
  DangHoc: { enum: 2, title: 'Đang học' },
  BaoLuu: { enum: 3, title: 'Bảo lưu' },
  DaTotNghiep: { enum: 4, title: 'Đã tốt nghiệp' },

  DaThoiHoc: { enum: 5, title: 'Đã thôi học' },


  ThoiHocKyHe: { enum: 50, title: 'Thôi học kỳ hè' },
  ThoiHocKy1: { enum: 51, title: 'Thôi học kỳ 1' },
  ThoiHocKy2: { enum: 52, title: 'Thôi học kỳ 2' },

  ChuyenDenTrongHe: { enum: 100, title: 'Chuyển đến trong hè' },
  ChuyenDenKy1: { enum: 101, title: 'Chuyển đến kỳ 1' },
  ChuyenDenKy2: { enum: 102, title: 'Chuyển đến kỳ 2' },

  ChuyenDiTrongHe: { enum: 110, title: 'Chuyển đi trong hè' },
  ChuyenDiKy1: { enum: 111, title: 'Chuyển đi kỳ 1' },
  ChuyenDiKy2: { enum: 112, title: 'Chuyển đi kỳ 2' },

  XinHocLaiKy1: { enum: 121, title: 'Xin học lại kỳ 1' },
  XinHocLaiKy2: { enum: 122, title: 'Xin học lại kỳ 2' },
}

export const EstimatedLessonsPerWeekEnum = {
  FivePerWeek: { enum: 1, title: 'Học 5 buổi/tuần' },
  SixPerWeek: { enum: 2, title: 'Học 6 buổi/tuần' },
  SixToEightPerWeek: { enum: 3, title: 'Học 6-8 buổi/tuần' },
  NineToTenPerWeek: { enum: 4, title: 'Học 9-10 buổi/tuần' },
}

export interface StudentGradeModel {
  enum: number, code?: string, title: string, short?: string, edu_level?: number
}
export const StudentGradeEnum = {
  Lop1: { enum: 1, code: 'khoi-1', title: 'Khối 1', short: '1', edu_level: SchoolLevelEnum.TieuHoc.enum } as StudentGradeModel,
  Lop2: { enum: 2, code: 'khoi-2', title: 'Khối 2', short: '2', edu_level: SchoolLevelEnum.TieuHoc.enum } as StudentGradeModel,
  Lop3: { enum: 3, code: 'khoi-3', title: 'Khối 3', short: '3', edu_level: SchoolLevelEnum.TieuHoc.enum } as StudentGradeModel,
  Lop4: { enum: 4, code: 'khoi-4', title: 'Khối 4', short: '4', edu_level: SchoolLevelEnum.TieuHoc.enum } as StudentGradeModel,
  Lop5: { enum: 5, code: 'khoi-5', title: 'Khối 5', short: '5', edu_level: SchoolLevelEnum.TieuHoc.enum } as StudentGradeModel,
  Lop6: { enum: 6, code: 'khoi-6', title: 'Khối 6', short: '6', edu_level: SchoolLevelEnum.THCS.enum } as StudentGradeModel,
  Lop7: { enum: 7, code: 'khoi-7', title: 'Khối 7', short: '7', edu_level: SchoolLevelEnum.THCS.enum } as StudentGradeModel,
  Lop8: { enum: 8, code: 'khoi-8', title: 'Khối 8', short: '8', edu_level: SchoolLevelEnum.THCS.enum } as StudentGradeModel,
  Lop9: { enum: 9, code: 'khoi-9', title: 'Khối 9', short: '9', edu_level: SchoolLevelEnum.THCS.enum } as StudentGradeModel,
  Lop10: { enum: 10, code: 'khoi-10', title: 'Khối 10', short: '10', edu_level: SchoolLevelEnum.THPT.enum } as StudentGradeModel,
  Lop11: { enum: 11, code: 'khoi-11', title: 'Khối 11', short: '11', edu_level: SchoolLevelEnum.THPT.enum } as StudentGradeModel,
  Lop12: { enum: 12, code: 'khoi-12', title: 'Khối 12', short: '12', edu_level: SchoolLevelEnum.THPT.enum } as StudentGradeModel,
  NhaTre: { enum: 13, code: 'nha-tre', title: 'Nhà trẻ', short: 'Nhà trẻ', edu_level: SchoolLevelEnum.MamNon.enum } as StudentGradeModel,
  Mam: { enum: 14, code: 'lop-mam', title: 'Lớp Mầm', short: 'Mầm', edu_level: SchoolLevelEnum.MamNon.enum } as StudentGradeModel,
  Choi: { enum: 15, code: 'lop-choi', title: 'Lớp Chồi', short: 'Chồi', edu_level: SchoolLevelEnum.MamNon.enum } as StudentGradeModel,
  La: { enum: 16, code: 'lop-la', title: 'Lớp Lá', short: 'Lá', edu_level: SchoolLevelEnum.MamNon.enum } as StudentGradeModel,
}
export const StudentContactRelationshipEnum = {
  Cha: { enum: 1, title: 'Cha' },
  Me: { enum: 2, title: 'Mẹ' },
  Khac: { enum: 9, title: 'Khác' },
}
export const StudentAdmissionTypeEnum = {
  DungTuyen: { enum: 1, title: 'Đúng tuyến' },
  TraiTuyen: { enum: 2, title: 'Trái tuyến' },
  ChuyenTruong: { enum: 3, title: 'Chuyển trường đến' },
}
export const StudentMedicalInfoGroupEnum = {
  ChuaXacDinh: { enum: 1, title: 'Khác' },
  DiUng: { enum: 2, title: 'Dị ứng' },
  ManTinhHoacNen: { enum: 2, title: 'Bệnh mãn tính/Bệnh nền' }
}
export const StudentMedicalInfoTypeEnum = {
  ChuaXacDinh: { enum: 1, title: 'Khác', group: StudentMedicalInfoGroupEnum.ChuaXacDinh.enum },
  DiUngThucPham: { enum: 2, title: 'Dị ứng Thực phẩm', group: StudentMedicalInfoGroupEnum.DiUng.enum },
  DiUngThuoc: { enum: 3, title: 'Dị ứng Thuốc', group: StudentMedicalInfoGroupEnum.DiUng.enum },
  ManTinhHoacNen: { enum: 4, title: 'Bệnh mãn tính/Bệnh nền', group: StudentMedicalInfoGroupEnum.ManTinhHoacNen.enum },
}

export const SchoolYearStatusEnum = {
  MoiTao: { enum: 1, title: 'Đang thiết lập' },
  DangHoatDong: { enum: 2, title: 'Đang trong năm học' },
  KetThuc: { enum: 3, title: 'Đã kết thúc' },
  Huy: { enum: 4, title: 'Đã huỷ' },
}

export const SubjectTypeEnum = {
  BatBuoc: { enum: 1, title: 'Bắt buộc' },
  TuChon: { enum: 2, title: 'Tự chọn' },
  LuaChon: { enum: 3, title: 'Lựa chọn' },
  HoatDongGiaoDucBatBuoc: { enum: 4, title: 'Hoạt động giáo dục bắt buộc' },
  NoiDungGiaoDucCuaDiaPhuong: { enum: 5, title: 'Nội dung giáo dục của địa phương' },
}

export const SpecificClassEnum = {
  banTru: { enum: 1, title: 'Là Lớp bán trú' },
  lopGhep: { enum: 2, title: 'Là Lớp ghép' },
  coHocSinhKhuyetTat: { enum: 3, title: 'Có học sinh khuyết tật' },
  coHocSinhHocNghe: { enum: 4, title: 'Có học sinh học nghề' },
  coChaMeHoiDong: { enum: 5, title: 'Có đại diện cha mẹ học sinh tham gia Hội đồng trường' },
}

export const SchoolRegionEnum = { // Khu vực
  BienGioiHaiDao: { enum: 1, title: 'Biên giới - Hải đảo' },
  DoThi: { enum: 2, title: 'Đô thị' },
  DongBang: { enum: 3, title: 'Đồng bằng' },
  MienNuiVungSau: { enum: 4, title: 'Miền núi - vùng sâu' },
}

export const SchoolZoneEnum = { // Vùng
  VungI: { enum: 1, title: 'Vùng I' },
  VungII: { enum: 2, title: 'Vùng II' },
  VungIII: { enum: 3, title: 'Vùng III' },
  VungIV: { enum: 4, title: 'Vùng IV' },
}

export const NationalStandardStatusEnum = {
  Muc1: { enum: 1, title: "Đạt chuẩn mức 1" },
  Muc2: { enum: 2, title: "Đạt chuẩn mức 2" },
  Muc3: { enum: 3, title: "Đạt chuẩn mức 3" },
}