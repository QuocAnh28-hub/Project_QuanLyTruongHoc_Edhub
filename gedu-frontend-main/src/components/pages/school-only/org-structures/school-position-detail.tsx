import { Card, Col, Flex, Row, Skeleton, Tabs } from "antd";
import SchoolPositionDetailProvider, { useSchoolPositionDetailContext } from "../../../../contexts/school-only/school-departments/SchoolPositionDetailContext";
import { nav_links } from "../../../../utils/routes";
import GBack from "../../../atoms/g-back";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import SchoolPositionMembersTable from "./school-positions/school-position-member-table";
import SchoolPositionAuthorities from "./school-positions/school-position-authorities";
import { POS_DEFAULT_SELECTED_TAB, pos_tab_items, POS_TAB_TYPEs } from "./school-positions/model";

const SchoolPositionDetail = () => <SchoolPositionDetailProvider><Content /></SchoolPositionDetailProvider>
export default SchoolPositionDetail

function Content() {
  const { data, fetching, selected_tab, setSelectedTab } = useSchoolPositionDetailContext()

  return <Flex vertical gap={24}>
    <Flex gap={12}>
      <GBack default_route={nav_links.school_positions.route} />
      {fetching ? <Skeleton.Input active /> : <GTitle level={4}>{data?.title}</GTitle>}
    </Flex>
    {data ? <Flex vertical gap={12}>
      <GTitle level={5}>Thông tin chung</GTitle>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Mã chức danh</GText>
              <GText>{data.code}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Tên chức danh</GText>
              <GText>{data.title}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Phòng ban / Tổ trực thuộc</GText>
              <GText>{data.department?.name}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Số lượng thành viên</GText>
              <GText>{data.memberCount}</GText>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Flex>
      : null}
    {data ? <Flex vertical>
      <Tabs defaultActiveKey={POS_DEFAULT_SELECTED_TAB} items={pos_tab_items} onChange={(key: string) => setSelectedTab(key)} />
      {selected_tab == POS_TAB_TYPEs.permission && <SchoolPositionAuthorities />}
      {selected_tab == POS_TAB_TYPEs.members && <SchoolPositionMembersTable />}
    </Flex>
      : null}
  </Flex>
}