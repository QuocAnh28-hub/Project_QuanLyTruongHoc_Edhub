import { Card, Col, Flex, Row, Skeleton } from "antd";
import EDPositionDetailProvider, { useEDPositionDetailContext } from "../../../../contexts/ed-only/edu-departments/EDPositionDetailContext";
import { nav_links } from "../../../../utils/routes";
import GBack from "../../../atoms/g-back";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import EDPositionMembersTable from "./ed-positions/ed-position-member-table";

const EDPositionDetail = () => <EDPositionDetailProvider><Content /></EDPositionDetailProvider>
export default EDPositionDetail

function Content() {
  const { data, fetching } = useEDPositionDetailContext()
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
    {data ? <Flex vertical gap={12}>
      <GTitle level={5}>Danh sách thành viên</GTitle>
      <EDPositionMembersTable />
    </Flex> : null}
  </Flex>
}