import { TextProps } from "antd/lib/typography/Text";

interface Props {
  type?: 'primary' | 'secondary'
}
export default function GChartText({ type, ...props }: Props & TextProps) {
  return <span className='ant-chart-text' {...props} style={{ opacity: type === 'secondary' ? '0.65' : '0.9', ...props.style }} />
}