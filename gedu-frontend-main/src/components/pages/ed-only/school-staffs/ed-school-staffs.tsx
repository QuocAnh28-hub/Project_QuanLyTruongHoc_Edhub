import { Button, Col, Divider, Flex, Row } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import { PlusOutlined } from "../../../atoms/svg/outlined-icons";
import UnderConstruction from "../../../molecules/under-construction";

export default function EdSchoolStaffs() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { title: nav_links.ed_school_staffs.title },
    ], nav_links.ed_school_staffs.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Content />
}
function Content() {
  return <UnderConstruction title='Quản lý Cán bộ & Giáo viên' />
  return <ContentCover size="stretch" gap={16}>
    <Row gutter={16}>
      <Col>
        <GTitle level={3}>Thư viện Báo cáo</GTitle>
      </Col>
      <Col flex='auto' style={{ justifyItems: 'flex-end' }}>
        <Flex gap={12}>
          <Link to={'#'}><Button type='primary' icon={<PlusOutlined />}>Tạo báo cáo tuỳ chỉnh</Button></Link>
        </Flex>
      </Col>
    </Row>
    <Divider style={{ marginTop: 4, marginBottom: 8 }} />
  </ContentCover>
}
