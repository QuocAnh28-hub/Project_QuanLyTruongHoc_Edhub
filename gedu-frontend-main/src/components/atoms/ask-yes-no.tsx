// component chọn có/không
// ví dụ: Học sinh có bị mắc bệnh mãn tính/bệnh nền nào không? [ Co ] [ Khong ]
import { Flex, Radio, Typography } from "antd"
import { CheckOutlined, CloseOutlined } from "./svg/outlined-icons"

interface Props {
  text?: string
  value: boolean
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  onChange?: Function
}
export default function AskYesNo({ text, value = false, onChange }: Props) {
  return <Flex justify='space-between' gap={8}>
    <Typography.Text style={{ display: 'inline-block', marginTop: 6 }}>{text}</Typography.Text>
    <Radio.Group value={value} style={{ whiteSpace: 'nowrap' }}
      onChange={(e) => {
        onChange?.(e.target.value)
      }}>
      <Radio.Button value={true}>
        <CheckOutlined style={{ marginRight: 8 }} /><span>Có</span>
      </Radio.Button>
      <Radio.Button value={false}>
        <CloseOutlined style={{ marginRight: 8 }} /><span>Không</span>
      </Radio.Button>
    </Radio.Group>
  </Flex>
}