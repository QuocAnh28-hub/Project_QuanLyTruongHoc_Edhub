import { Flex, FlexProps } from "antd";
import { MouseEventHandler } from "react";

interface Props {
  size?: 'sm' | 'md' | 'lg'
  type?: 'primary' | 'secondary',
  onClick?: MouseEventHandler
}
export default function GCard({ type = 'primary', size = 'md', onClick, ...more }: Props & FlexProps) {
  const bgColor = type == 'primary' ? '#FFFFFF' : 'rgba(0, 0, 0, 0.02)'
  const border = type == 'primary' ? '1px solid var(--border-color)' : 'none'
  return <Flex {...more} onClick={onClick} style={{ padding: size == 'sm' ? 8 : size == 'md' ? 16 : 24, borderRadius: 8, border, backgroundColor: bgColor, ...more.style }}>
    {more.children}
  </Flex>
}