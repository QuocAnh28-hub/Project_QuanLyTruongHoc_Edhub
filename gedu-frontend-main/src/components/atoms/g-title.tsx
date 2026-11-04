import { Typography } from "antd"
import { TitleProps } from "antd/lib/typography/Title"

const { Title } = Typography
export default function GTitle(props: TitleProps) {
  return <Title style={{ margin: 0 }} {...props} />
}