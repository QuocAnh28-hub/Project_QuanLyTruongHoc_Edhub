import { Typography } from "antd"
import { ReactNode } from "react"

const { Text } = Typography
interface Props {
  children?: ReactNode
}
export default function NoDataText({ children = 'Không có thông tin' }: Props) {
  return <Text italic type='secondary'>{children}</Text>
}