import { Tag } from "antd"
import { ReportReadyStatusEnum } from "../../models/enums"

interface Props {
  status: number
}
export default function ReportReadyStatusTag({ status }: Props) {
  let color = 'default'
  let title = ''
  if (status == ReportReadyStatusEnum.ChuaTongHop.enum) {
    title = ReportReadyStatusEnum.ChuaTongHop.title
    color = 'default'
  }
  if (status == ReportReadyStatusEnum.DangTongHop.enum) {
    title = ReportReadyStatusEnum.DangTongHop.title
    color = 'processing'
  }
  if (status == ReportReadyStatusEnum.DaTongHop.enum) {
    title = ReportReadyStatusEnum.DaTongHop.title
    color = 'success'
  }
  return <Tag color={color} style={{
    textTransform: 'uppercase'
  }}> {title}</Tag>
}