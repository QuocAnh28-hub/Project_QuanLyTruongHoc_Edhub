import { Flex, Result, Typography } from "antd";
import { SmileOutlined } from "../atoms/svg/outlined-icons";

const { Title, Text } = Typography
interface Props {
  title: string
}
export default function UnderConstruction({ title = '' }: Props) {
  return <Flex vertical align="center" justify="center" style={{ height: '100%' }}>
    <Result
      icon={<SmileOutlined />}
      title={<div><Title level={3}>{title}</Title><Text>Chức năng đang được phát triển vui lòng quay lại sau</Text></div>}
    />
  </Flex>
}