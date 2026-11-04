// Card with 
// - padding
// - side bar
// - tabs

import { Col, Row, Tabs } from "antd"
import { ReactNode } from "react"

interface Props {
  side?: ReactNode
  tabItems?: any
  children?: ReactNode
  activeTabKey?: string
  onTabChange?: (_activeKey: string) => void
}
export default function ContentSplitCard({ side, tabItems, activeTabKey, onTabChange, children }: Props) {
  return <Row className="border cntnt-cvr-crd"
    style={{
      borderRadius: 8,
      backgroundColor: '#FFFFFF',
      height: '100%'
    }}
  >
    <Col className="border-right"
      sm={{ span: 24 }} xl={{ span: 6 }}
      style={{ padding: 24, width: '100%' }}>
      {side}
    </Col>
    <Col sm={{ span: 24 }} xl={{ span: 18 }} style={{ padding: 24, paddingTop: tabItems?.length ? 0 : 24 }}>
      {tabItems?.length ? <Tabs activeKey={activeTabKey}
        onChange={onTabChange}
        items={tabItems}
      /> : null}
      {children}
    </Col>
  </Row>
}
