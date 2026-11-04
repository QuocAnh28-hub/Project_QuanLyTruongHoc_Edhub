import { Button, Card, Col, Flex, Row, Typography } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext";
import BulkActionProvider from "../../../../contexts/BulkActionContext";
import StudentsProvider, { useStudentsContext } from "../../../../contexts/school-only/students/StudentsContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import { PlusOutlined, UploadOutlined } from "../../../atoms/svg/outlined-icons";
import EmptyState from "../../../molecules/empty-state";
import StudentsBulkAction from "./students/students-bulk-action";
import StudentsTable from "./students/students-table";

const { Title } = Typography
export default function StudentsPage() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { title: nav_links.students.title },
    ], nav_links.students.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StudentsProvider>
    <Content />
  </StudentsProvider>
}
function Content() {
  const { authority } = useAppContext()
  const { data, page, query, grd, clss } = useStudentsContext()
  if (data && !data.length && page === 1 && !query && !grd && !clss)
    return <EmptyPanel can_create={authority?.can_touch_student || false} />
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Hồ sơ Học sinh</Title>
      </Col>
      {authority?.can_touch_student && <Col flex='auto' style={{ justifyItems: 'flex-end' }}>
        <Flex gap={12} style={{ marginBottom: 16 }}>
          <Link to={nav_links.student_import.route}><Button icon={<UploadOutlined />}>Tải lên danh sách</Button></Link>
          <Link to={nav_links.student_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo hồ sơ</Button></Link>
        </Flex>
      </Col>}
    </Row>
    <BulkActionProvider>
      <Card style={{ flex: 1 }}>
        <Flex vertical gap={16}>
          <StudentsBulkAction />
          <div style={{ flexGrow: 1 }}>
            <StudentsTable />
          </div>
        </Flex>
      </Card>
    </BulkActionProvider>
  </ContentCover>
}

function EmptyPanel({ can_create }: { can_create: boolean }) {
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <GTitle level={3}>Hồ sơ Học sinh</GTitle>
      </Col>
    </Row>
    <Card style={{ paddingTop: 60, paddingBottom: 60 }}>
      <EmptyState icon="school-bag" title='Chưa có hồ sơ nào' desc='Hãy bắt đầu bằng cách thêm hồ sơ mới.' />
      {can_create &&
        <Flex gap={12} justify="center" style={{ marginTop: 24 }}>
          <Link to={nav_links.student_import.route}><Button icon={<UploadOutlined />}>Tải lên danh sách</Button></Link>
          <Link to={nav_links.student_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo hồ sơ</Button></Link>
        </Flex>
      }
    </Card>
  </ContentCover>
}