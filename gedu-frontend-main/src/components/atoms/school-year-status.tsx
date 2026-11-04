import { Badge } from "antd"
import { SchoolYearStatusEnum } from "../../models/enums"

interface Props {
  status: number | null
}
export default function SchoolYearStatusTag({ status }: Props) {
  if (!status) return null
  let color = 'default' as any
  let title = ''
  if (status == SchoolYearStatusEnum.MoiTao.enum) {
    title = SchoolYearStatusEnum.MoiTao.title
    color = 'processing'
  }
  if (status == SchoolYearStatusEnum.DangHoatDong.enum) {
    title = SchoolYearStatusEnum.DangHoatDong.title
    color = 'success'
  }
  if (status == SchoolYearStatusEnum.KetThuc.enum) {
    title = SchoolYearStatusEnum.KetThuc.title
    color = 'default'
  }
  return <Badge status={color} text={title} />
}