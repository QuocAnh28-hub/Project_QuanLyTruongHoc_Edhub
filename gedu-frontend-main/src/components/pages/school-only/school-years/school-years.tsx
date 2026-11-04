import { Button, Card, Col, Flex, Row, Typography } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext";
import SchoolYearsProvider, { useSchoolYearsContext } from "../../../../contexts/school-only/school-years/SchoolYearsContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import { PlusOutlined } from "../../../atoms/svg/outlined-icons";
import EmptyState from "../../../molecules/empty-state";
import SchoolYearsTable from "./school-years/school-years-table";

const { Title } = Typography
export default function SchoolYearsPage() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { title: nav_links.school_years.title },
    ], nav_links.school_years.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <SchoolYearsProvider>
    <Content />
  </SchoolYearsProvider>
}
function Content() {
  const { authority } = useAppContext()
  const { data, page } = useSchoolYearsContext()
  if (data && !data.length && page === 1)
    return <EmptyPanel can_create={authority?.can_touch_schoolyear || false} />
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Năm học, Học kỳ & Kì thi</Title>
      </Col>
      {authority?.can_touch_schoolyear && <Col flex='auto' style={{ justifyItems: 'flex-end' }}>
        <Flex gap={12} style={{ marginBottom: 16 }}>
          <Link to={nav_links.school_year_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo Năm học</Button></Link>
        </Flex>
      </Col>}
    </Row>
    <Card style={{ flex: 1 }}>
      <div style={{ flexGrow: 1 }}>
        <SchoolYearsTable />
      </div>
    </Card>
  </ContentCover>
}

function EmptyPanel({ can_create }: { can_create: boolean }) {
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <GTitle level={3}>Năm học, Học kỳ & Kì thi</GTitle>
      </Col>
    </Row>
    <Card style={{ paddingTop: 60, paddingBottom: 60 }}>
      <EmptyState icon="schedule" title='Chưa có Hồ sơ Năm học nào' desc='Hãy bắt đầu bằng cách thêm năm học mới.' />
      {can_create &&
        <Flex gap={12} justify="center" style={{ marginTop: 24 }}>
          <Link to={nav_links.school_year_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo Năm học</Button></Link>
        </Flex>
      }
    </Card>
  </ContentCover>
}