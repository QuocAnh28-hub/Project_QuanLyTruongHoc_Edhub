import { Button, ButtonProps } from "antd"
import { useLayoutContext } from "../../contexts/SchoolLayoutContext"
import { CopyOutlined } from "./svg/outlined-icons"

interface Props {
  text: string
  status?: 'full' | 'simple'
}
export default function CopyButton(props: Props & ButtonProps) {
  const _type = props.status || 'full'
  const { callMessage } = useLayoutContext()
  return <Button
    style={{ flex: 'none', ...props.style }}
    size="small" icon={<CopyOutlined />}
    onClick={() => {
      navigator.clipboard.writeText(props.text)
      callMessage('Đã sao chép: ' + props.text)
    }}
  >{_type == 'full' ? 'Sao chép' : ''}</Button>
}