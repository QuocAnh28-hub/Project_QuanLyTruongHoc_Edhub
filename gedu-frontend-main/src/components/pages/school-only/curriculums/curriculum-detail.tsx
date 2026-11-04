import { Button, Card, Col, Flex, Row, Skeleton } from "antd";
import { useAppContext } from "../../../../contexts/AppContext";
import CurriculumDetailProvider, { useCurriculumDetailContext } from "../../../../contexts/school-only/curriculums/CurriculumDetailContext";
import { ToGradeLevelList } from "../../../../utils/locale-helpers";
import { nav_links } from "../../../../utils/routes";
import GBack from "../../../atoms/g-back";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import { FormOutlined } from "../../../atoms/svg/outlined-icons";
import CurriculumMembersTable from "./curriculums/curriculum-member-table";

const CurriculumDetail = () => <CurriculumDetailProvider><Content /></CurriculumDetailProvider>
export default CurriculumDetail

function Content() {
  const { authority } = useAppContext()
  const { data, fetching } = useCurriculumDetailContext()
  return <Flex vertical gap={24}>
    <Flex gap={12}>
      <GBack default_route={nav_links.curriculums.route} />
      {fetching ? <Skeleton.Input active /> : <GTitle level={4}>{data?.name}</GTitle>}
    </Flex>
    {data ? <Flex vertical gap={12}>
      <Flex justify="space-between">
        <Flex vertical gap={4}>
          <GTitle level={5}>Thông tin chung</GTitle>
          <GText italic>Chương trình giáo dục phổ thông mới, ban hành theo Thông tư số 32/2018/TT-BGDĐT, tập trung vào phát triển toàn diện phẩm chất và năng lực của học sinh.</GText>
        </Flex>
        {authority?.can_touch_curriculum && <Button size="small" icon={<FormOutlined />}>Chỉnh sửa</Button>}
      </Flex>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Mã chương trình</GText>
              <GText>{data.code}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Ngôn ngữ giảng dạy chính</GText>
              <GText>{data.instructionLanguageName}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Chuẩn đầu ra / Bằng cấp</GText>
              <GText>{data.graduationDegree}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={6}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Các Khối lớp áp dụng</GText>
              <GText>{ToGradeLevelList(data.gradeLevels)}</GText>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Flex>
      : null}
    {data ? <Flex vertical gap={12}>
      <Flex vertical gap={4}>
        <GTitle level={5}>Danh sách các Môn học đang áp dụng</GTitle>
        <GText italic>Gán và cấu hình các môn học cho chương trình này.</GText>
      </Flex>
      <CurriculumMembersTable />
    </Flex> : null}
  </Flex>
}