import { Card, Col, Row, Typography } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links, paths } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";

const { Title } = Typography
export default function CurriculumsSubjects() {
  const navigate = useNavigate()
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { title: nav_links.curriculums.title },
    ], nav_links.curriculums.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Chương trình học & Môn học</Title>
      </Col>
    </Row>
    <Card style={{ flex: 1 }}
      tabProps={{ size: 'middle' }}
      activeTabKey={location.pathname}
      onTabChange={(_key) => navigate(_key)}
      tabList={[
        { label: 'Quản lý chương trình học', key: paths.curriculums },
        { label: 'Danh mục môn học', key: paths.subjects },
      ]}>
      <Outlet />
    </Card>
  </ContentCover>
}