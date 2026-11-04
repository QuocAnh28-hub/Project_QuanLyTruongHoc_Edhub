import { Button, Card, Col, Flex, Row, Skeleton } from "antd";
import { useState } from "react";
import { useAppContext } from "../../../../contexts/AppContext";
import SubjectDetailProvider, { useSubjectDetailContext } from "../../../../contexts/school-only/curriculums/SubjectDetailContext";
import { nav_links } from "../../../../utils/routes";
import GBack from "../../../atoms/g-back";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import { FormOutlined } from "../../../atoms/svg/outlined-icons";
import SubjectMembersTable from "./subjects/subject-member-table";
import UpdateSubjectModal from "./subjects/update-subject-modal";

const SubjectDetail = () => <SubjectDetailProvider><Content /></SubjectDetailProvider>
export default SubjectDetail

function Content() {
  const { authority } = useAppContext()
  const { data, fetching, mutate, updateSubject } = useSubjectDetailContext()
  const [open_update, setOpenUpdate] = useState<boolean>(false)

  return <Flex vertical gap={24}>
    <Flex gap={12}>
      <GBack default_route={nav_links.subjects.route} />
      {fetching ? <Skeleton.Input active /> : <GTitle level={4}>{data?.name}</GTitle>}
    </Flex>
    {data ? <Flex vertical gap={12}>
      <Flex justify="space-between">
        <GTitle level={5}>Thông tin chung</GTitle>
        {authority?.can_touch_curriculum && (
          <Button
            size="small"
            icon={<FormOutlined />}
            onClick={() => setOpenUpdate(true)}
          >
            Chỉnh sửa
          </Button>
        )}
      </Flex>
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} xl={8}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Mã môn học</GText>
              <GText>{data.code}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Tên môn học</GText>
              <GText>{data.name}</GText>
            </Flex>
          </Card>
        </Col>
        <Col xs={24} xl={8}>
          <Card styles={{ body: { padding: 16 } }} style={{ height: '100%' }}>
            <Flex vertical gap={2}>
              <GText strong type="secondary">Tổ chuyên môn phụ trách</GText>
              <GText>{data.departments?.map(d => d.name).join(', ')}</GText>
            </Flex>
          </Card>
        </Col>
      </Row>
    </Flex>
      : null}
    {data ? <Flex vertical gap={12}>
      <Flex vertical gap={4}>
        <GTitle level={5}>Danh sách các Chương trình học đang áp dụng</GTitle>
      </Flex>
      <SubjectMembersTable />
    </Flex> : null}
    {open_update && data && (
      <UpdateSubjectModal
        record={data}
        close={() => setOpenUpdate(false)}
        ok={() => {
          setOpenUpdate(false)
          mutate?.()
        }}
        onUpdate={updateSubject}
      />
    )}
  </Flex>
}