import { Card, Col, Flex, Row, Typography } from "antd";
import { useEffect } from "react";
import EDStaffsProvider, { useEDStaffsContext } from "../../../../contexts/ed-only/EDStaffsContext";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import SearchTextBox from "../../../atoms/search-textbox";
import EmptyState from "../../../molecules/empty-state";
import EDStaffsTable from "./staffs/ed-staffs-table";

const { Title } = Typography
export default function SchoolEDStaffs() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { title: nav_links.ed_staffs.title },
    ], nav_links.ed_staffs.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <EDStaffsProvider>
    <Content />
  </EDStaffsProvider>
}
function Content() {
  const { data, page, query, dept, pos } = useEDStaffsContext()
  if (data && !data.length && page === 1 && !query && !dept && !pos)
    return <EmptyPanel />
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <Title level={3} style={{ margin: 0 }}>Hồ sơ Cán bộ</Title>
      </Col>
    </Row>
    <Card style={{ flex: 1 }}>
      <Flex style={{ paddingBottom: 16 }} justify="flex-end">
        <SearchTextBox placeholder='Tìm theo tên, mã Cán bộ' />
      </Flex>
      <div style={{ flexGrow: 1 }}>
        <EDStaffsTable />
      </div>
    </Card>
  </ContentCover>
}

function EmptyPanel() {
  return <ContentCover size="stretch">
    <Row style={{ paddingBottom: 4 }} gutter={16}>
      <Col style={{ marginBottom: 16 }}>
        <GTitle level={3}>Danh sách Cán bộ</GTitle>
      </Col>
    </Row>
    <Card style={{ paddingTop: 60, paddingBottom: 60 }}>
      <EmptyState icon="stationery" title='Chưa có hồ sơ nào' />
    </Card>
  </ContentCover>
}