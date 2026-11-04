import { Card, Col, Row, Typography } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links, paths } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";

const { Title } = Typography
export default function EDOrgStructures() {
  const navigate = useNavigate()
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { title: nav_links.ed_org_structures.title },
    ], nav_links.ed_org_structures.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Cấu trúc Tổ chức & Phân quyền</Title>
      </Col>
    </Row>
    <Card style={{ flex: 1 }}
      tabProps={{ size: 'middle' }}
      activeTabKey={location.pathname}
      onTabChange={(_key) => navigate(_key)}
      tabList={[
        { label: 'Phòng ban / Tổ chuyên môn', key: paths.edu_departments },
        { label: 'Chức danh & Phân quyền', key: paths.ed_positions },
      ]}>
      <Outlet />
    </Card>
  </ContentCover>
}