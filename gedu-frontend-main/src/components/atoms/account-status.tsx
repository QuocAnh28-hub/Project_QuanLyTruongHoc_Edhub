import { Badge } from "antd"
import { AccountStatusEnum } from "../../models/enums"

interface Props {
  status: number
}
export default function AccountStatusTag({ status }: Props) {
  let color = 'default' as 'default' | 'success' | 'error' | 'processing' | 'warning' | undefined
  let title = ''
  if (status == AccountStatusEnum.ChuaKichHoat.enum) {
    title = AccountStatusEnum.ChuaKichHoat.title
    color = 'error'
  }
  if (status == AccountStatusEnum.DangHoatDong.enum) {
    title = AccountStatusEnum.DangHoatDong.title
    color = 'success'
  }
  if (status == AccountStatusEnum.TamKhoa.enum) {
    title = AccountStatusEnum.TamKhoa.title
    color = 'warning'
  }
  if (status == AccountStatusEnum.KhoaVinhVien.enum) {
    title = AccountStatusEnum.KhoaVinhVien.title
    color = 'default'
  }
  return <Badge status={color} text={title} />
}