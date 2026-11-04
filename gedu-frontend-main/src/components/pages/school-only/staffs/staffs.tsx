import { Button, Card, Col, Flex, Row, Typography } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext";
import StaffsProvider, { useStaffsContext } from "../../../../contexts/school-only/staffs/StaffsContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import SearchTextBox from "../../../atoms/search-textbox";
import { PlusOutlined, UploadOutlined } from "../../../atoms/svg/outlined-icons";
import EmptyState from "../../../molecules/empty-state";
import StaffsTable from "./staffs/staffs-table";

const { Title } = Typography
export default function SchoolStaffs() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { title: nav_links.staffs.title },
    ], nav_links.staffs.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StaffsProvider>
    <Content />
  </StaffsProvider>
}
function Content() {
  const { authority } = useAppContext()
  const { data, page, query, dept, pos } = useStaffsContext()
  if (data && !data.length && page === 1 && !query && !dept && !pos)
    return <EmptyPanel can_create={authority?.can_touch_staff || false} />
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Hồ sơ Cán bộ & Giáo viên</Title>
      </Col>
      {authority?.can_touch_staff &&
        <Col flex='auto' style={{ justifyItems: 'flex-end' }}>
          <Flex gap={12} style={{ marginBottom: 16 }}>
            <Link to={nav_links.staff_import.route}><Button icon={<UploadOutlined />}>Tải lên danh sách</Button></Link>
            <Link to={nav_links.staff_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo hồ sơ</Button></Link>
          </Flex>
        </Col>
      }
    </Row>
    <Card style={{ flex: 1 }}>
      <Flex style={{ paddingBottom: 16 }} justify="flex-end">
        <SearchTextBox placeholder='Tìm theo tên, mã Cán bộ & Giáo viên' />
      </Flex>
      <div style={{ flexGrow: 1 }}>
        <StaffsTable />
      </div>
    </Card>
  </ContentCover>
}

function EmptyPanel({ can_create }: { can_create: boolean }) {
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <GTitle level={3}>Danh sách Cán bộ & Giáo viên</GTitle>
      </Col>
    </Row>
    <Card style={{ paddingTop: 60, paddingBottom: 60 }}>
      <EmptyState icon="stationery" title='Chưa có hồ sơ nào' desc='Hãy bắt đầu bằng cách tạo hồ sơ mới.' />
      {can_create &&
        <Flex gap={12} justify="center" style={{ marginTop: 24 }}>
          <Link to={nav_links.staff_import.route}><Button icon={<UploadOutlined />}>Tải lên danh sách</Button></Link>
          <Link to={nav_links.staff_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo hồ sơ</Button></Link>
        </Flex>
      }
    </Card>
  </ContentCover>
}