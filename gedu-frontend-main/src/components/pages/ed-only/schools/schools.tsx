import { Button, Card, Col, Flex, Row } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import SchoolsProvider, { useSchoolsContext } from "../../../../contexts/ed-only/SchoolsContext";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import SearchTextBox from "../../../atoms/search-textbox";
import { PlusOutlined, UploadOutlined } from "../../../atoms/svg/outlined-icons";
import EmptyState from "../../../molecules/empty-state";
import SchoolsTable from "./schools/schools-table";

export default function SchoolsPage() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { title: nav_links.schools.title },
    ], nav_links.schools.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <SchoolsProvider>
    <Content />
  </SchoolsProvider>
}
function Content() {
  const { data, page, query, type, status, level, intl } = useSchoolsContext()
  if (data && !data.length && page === 1 && !query && !type && !status && !level && !intl)
    return <EmptyPanel />
  return <ContentCover size='stretch'>
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <GTitle level={3}>Danh sách Trường học</GTitle>
      </Col>
      <Col flex='auto' style={{ justifyItems: 'flex-end' }}>
        <Flex gap={12} style={{ marginBottom: 16 }}>
          <Link to={nav_links.school_import.route}><Button icon={<UploadOutlined />}>Tải lên danh sách</Button></Link>
          <Link to={nav_links.school_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo trường học</Button></Link>
        </Flex>
      </Col>
    </Row>
    <Card style={{ flex: 1 }}>
      <Flex style={{ paddingBottom: 16 }} justify="flex-end">
        <SearchTextBox placeholder='Tìm theo tên trường, mã trường' />
      </Flex>
      <div style={{ flexGrow: 1 }}>
        <SchoolsTable />
      </div>
    </Card>
  </ContentCover>
}

function EmptyPanel() {
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <GTitle level={3}>Danh sách Trường học</GTitle>
      </Col>
    </Row>
    <Card style={{ paddingTop: 60, paddingBottom: 60 }}>
      <EmptyState title='Chưa có trường học nào' desc='Hãy bắt đầu bằng cách thêm trường học mới.' />
      <Flex gap={12} justify="center" style={{ marginTop: 24 }}>
        <Link to={nav_links.school_import.route}><Button icon={<UploadOutlined />}>Tải lên danh sách</Button></Link>
        <Link to={nav_links.school_new.route}><Button type='primary' icon={<PlusOutlined />}>Tạo trường học</Button></Link>
      </Flex>
    </Card>
  </ContentCover>
}