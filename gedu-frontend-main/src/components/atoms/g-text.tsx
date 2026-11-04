import { Typography } from "antd";
import { TextProps } from "antd/lib/typography/Text";
import { ReactNode } from "react";
import NoDataText from "./no-data-text";

const { Text } = Typography
interface Props {
  children?: ReactNode
  empty_message?: string
}
export default function GText(props: Props & TextProps) {
  if (props.children == 0 || props.children)
    return <Text {...props}></Text>
  return <NoDataText>{props.empty_message || 'Không có thông tin'}</NoDataText>
}