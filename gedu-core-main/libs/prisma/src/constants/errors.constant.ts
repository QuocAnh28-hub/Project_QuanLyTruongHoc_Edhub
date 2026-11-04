export enum PrismaErrorCode {
  DUPLICATE = "P2002",
  FOREIGN_KEY_CONSTRAINT = "P2003",
  VALUE_TOO_LONG = "P2000",
  RECORD_NOT_FOUND = "P2025",
  RELATION_VIOLATION = "P2014",
  NULL_CONSTRAINT = "P2011",
  MISSING_REQUIRED_VALUE = "P2012",

  VALIDATION_ERROR = "VALIDATION_ERROR",
  RUST_PANIC = "RUST_PANIC",
  INITIALIZATION_ERROR = "INITIALIZATION_ERROR",
  UNKNOWN_ERROR = "UNKNOWN_ERROR",
}

export const PRISMA_ERROR_MESSAGE = {
  [PrismaErrorCode.DUPLICATE]: "Dữ liệu với giá trị này đã tồn tại trên hệ thống",
  [PrismaErrorCode.FOREIGN_KEY_CONSTRAINT]: "Dữ liệu tham chiếu này không tồn tại trên hệ thống",
  [PrismaErrorCode.VALUE_TOO_LONG]: "Dữ liệu vượt quá độ dài cho phép",
  [PrismaErrorCode.RECORD_NOT_FOUND]: "Không thể tìm thấy dữ liệu",
  [PrismaErrorCode.RELATION_VIOLATION]: "ID không hợp lệ",
  [PrismaErrorCode.NULL_CONSTRAINT]: "Mục này không thể null",
  [PrismaErrorCode.MISSING_REQUIRED_VALUE]: "Mục này bắt buộc phải có dữ liệu",
  [PrismaErrorCode.VALIDATION_ERROR]: "Lỗi xác thực dữ liệu",
  [PrismaErrorCode.RUST_PANIC]: "Lỗi hệ thống",
  [PrismaErrorCode.INITIALIZATION_ERROR]: "Lỗi khởi tạo",
  [PrismaErrorCode.UNKNOWN_ERROR]: "Lỗi không xác định",
}