import { Col, Row, RowProps } from "antd"
import { ReactNode } from "react"
import GText from "./g-text"
import GTitle from "./g-title"

interface Props {
  title?: string | ReactNode
  children?: ReactNode
  type?: 'primary' | 'secondary'
}
export default function TitleSegmentRow(props: Props & RowProps) {
  switch (props.type) {
    case 'secondary':
      return <Row gutter={[16, 16]} style={props.style}>
        <Col xs={{ flex: '100%' }} sm={{ flex: '0 0 204px' }}>
          <GText strong type="secondary">{props.title}</GText>
        </Col>
        <Col xs={{ flex: '100%' }} sm={{ flex: 'auto' }}>
          {props.children}
        </Col>
      </Row>
    case 'primary':
    default:
      return <Row gutter={[16, 16]} style={props.style}>
        <Col xs={{ flex: '100%' }} xl={{ flex: '0 0 210px' }}>
          <GTitle level={5}>{props.title}</GTitle>
        </Col>
        <Col xs={{ flex: '100%' }} xl={{ flex: 'auto' }}>
          {props.children}
        </Col>
      </Row>
  }
}