import { Tag } from "antd"
import { StudentStatusEnum } from "../../models/enums"

interface Props {
  status: number | null
}
export default function StudentStatusTag({ status }: Props) {
  if (!status) return null
  let color = 'default'
  let title = ''
  if (status == StudentStatusEnum.ChoNhapHoc.enum) {
    title = StudentStatusEnum.ChoNhapHoc.title
    color = 'success'
  }
  if (status == StudentStatusEnum.DangHoc.enum) {
    title = StudentStatusEnum.DangHoc.title
    color = 'success'
  }
  if (status == StudentStatusEnum.BaoLuu.enum) {
    title = StudentStatusEnum.BaoLuu.title
    color = 'default'
  }
  if (status == StudentStatusEnum.DaTotNghiep.enum) {
    title = StudentStatusEnum.DaTotNghiep.title
    color = 'default'
  }
  if (status == StudentStatusEnum.DaThoiHoc.enum) {
    title = StudentStatusEnum.DaThoiHoc.title
    color = 'default'
  }
  if (status == StudentStatusEnum.ChuyenDenTrongHe.enum) {
    title = StudentStatusEnum.ChuyenDenTrongHe.title
    color = 'default'
  }
  if (status == StudentStatusEnum.ChuyenDenKy1.enum) {
    title = StudentStatusEnum.ChuyenDenKy1.title
    color = 'default'
  }
  if (status == StudentStatusEnum.ChuyenDenKy2.enum) {
    title = StudentStatusEnum.ChuyenDenKy2.title
    color = 'default'
  }
  if (status == StudentStatusEnum.ChuyenDiTrongHe.enum) {
    title = StudentStatusEnum.ChuyenDiTrongHe.title
    color = 'default'
  }
  if (status == StudentStatusEnum.ChuyenDiKy1.enum) {
    title = StudentStatusEnum.ChuyenDiKy1.title
    color = 'default'
  }
  if (status == StudentStatusEnum.ChuyenDiKy2.enum) {
    title = StudentStatusEnum.ChuyenDiKy2.title
    color = 'default'
  }
  // Đã thôi học kỳ 1, 2
  if (status == StudentStatusEnum.ThoiHocKy1.enum) {
    title = StudentStatusEnum.ThoiHocKy1.title
    color = 'default'
  }
  if (status == StudentStatusEnum.ThoiHocKy2.enum) {
    title = StudentStatusEnum.ThoiHocKy2.title
    color = 'default'
  }

  if (status == StudentStatusEnum.XinHocLaiKy1.enum) {
    title = StudentStatusEnum.XinHocLaiKy1.title
    color = 'default'
  }
  
  if (status == StudentStatusEnum.XinHocLaiKy2.enum) {
    title = StudentStatusEnum.XinHocLaiKy2.title
    color = 'default'
  }
  
  return <Tag color={color} style={{
    textTransform: 'uppercase'
  }}> {title}</Tag>
}