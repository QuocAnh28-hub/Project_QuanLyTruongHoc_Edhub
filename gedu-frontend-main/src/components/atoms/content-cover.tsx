import { Flex, FlexProps } from "antd"
import { ReactNode, useMemo } from "react"
import { CONTENT_MAX_WIDTH, CONTENT_SMALL_WIDTH } from "../../utils/constants"

interface Props {
  children?: ReactNode
  size?: 'content' | 'stretch' | 'small'
  gap?: number
}
export default function ContentCover({ children, size = 'content', ...more }: Props & FlexProps) {
  const _width = useMemo(() => {
    switch (size) {
      case 'small':
        return CONTENT_SMALL_WIDTH
      case 'stretch':
        return '100%'
      case 'content':
      default:
        return CONTENT_MAX_WIDTH
    }
  }, [size])
  return <Flex className="cntnt-cvr" {...more} vertical={more.vertical ? more.vertical : true}
    style={{ maxWidth: _width, width: '100%', alignSelf: 'center', ...more.style }}
    flex={1}
  >
    {children}
  </Flex>
}