import { Tag } from "antd"
import { SchoolStaffStatusEnum } from "../../models/enums"

interface Props {
  status: number
}
export default function SchoolStaffStatusTag({ status }: Props) {
  let color = 'default' as 'default' | 'success' | 'error' | 'processing' | 'warning' | undefined
  let title = ''
  if (status == SchoolStaffStatusEnum.MoiTao.enum) {
    title = SchoolStaffStatusEnum.MoiTao.title
    color = 'warning'
  }
  if (status == SchoolStaffStatusEnum.DangHoatDong.enum) {
    title = SchoolStaffStatusEnum.DangHoatDong.title
    color = 'success'
  }
  if (status == SchoolStaffStatusEnum.TamDungHoatDong.enum) {
    title = SchoolStaffStatusEnum.TamDungHoatDong.title
    color = 'warning'
  }
  if (status == SchoolStaffStatusEnum.DinhChiCongTac.enum) {
    title = SchoolStaffStatusEnum.DinhChiCongTac.title
    color = 'default'
  }
  if (status == SchoolStaffStatusEnum.DaNghiViec.enum) {
    title = SchoolStaffStatusEnum.DaNghiViec.title
    color = 'default'
  }
  if (status == SchoolStaffStatusEnum.NghiThaiSan.enum) {
    title = SchoolStaffStatusEnum.NghiThaiSan.title
    color = 'processing'
  }
  if (status == SchoolStaffStatusEnum.NghiPhepDaiHan.enum) {
    title = SchoolStaffStatusEnum.NghiPhepDaiHan.title
    color = 'processing'
  }
  return <Tag color={color} style={{ textTransform: 'uppercase' }}>{title}</Tag>
}