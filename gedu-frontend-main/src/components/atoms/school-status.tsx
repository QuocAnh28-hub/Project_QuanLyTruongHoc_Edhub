import { Badge } from "antd"
import { SchoolStatusEnum } from "../../models/enums"

interface Props {
  status: number
}
export default function SchoolStatusTag({ status }: Props) {
  let color = 'default' as 'default' | 'success' | 'error' | 'processing' | 'warning' | undefined
  let title = ''
  if (status == SchoolStatusEnum.ThieuQuanTriVien.enum) {
    title = SchoolStatusEnum.ThieuQuanTriVien.title
    color = 'error'
  }
  if (status == SchoolStatusEnum.MoiTao.enum) {
    title = SchoolStatusEnum.MoiTao.title
    color = 'processing'
  }
  if (status == SchoolStatusEnum.DangHoatDong.enum) {
    title = SchoolStatusEnum.DangHoatDong.title
    color = 'success'
  }
  if (status == SchoolStatusEnum.TamDung.enum) {
    title = SchoolStatusEnum.TamDung.title
    color = 'warning'
  }
  if (status == SchoolStatusEnum.DungVinhVien.enum) {
    title = SchoolStatusEnum.DungVinhVien.title
    color = 'default'
  }
  return <Badge status={color} text={title} />
}