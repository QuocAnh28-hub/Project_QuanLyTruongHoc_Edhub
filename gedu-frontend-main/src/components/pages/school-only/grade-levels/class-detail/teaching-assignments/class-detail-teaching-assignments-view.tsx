import { Flex, Row } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import EmptyState from "../../../../../molecules/empty-state";

export default function ClassDetailTeachingAssignmentsView() {
  const { data, switchUpdateMode } = useClassDetailContext()

  if (!data) return null

  return <Fragment>
    <Row justify='end'>
      {/* <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Chỉnh sửa</Button> */}
    </Row>
    <Flex vertical style={{ padding: 40 }}>
      <EmptyState
        title="Chưa có phân công giảng dạy cho lớp này."
        desc="Bạn cần gán các môn học và giáo viên phụ trách để có thể xây dựng thời khóa biểu và quản lý điểm số." />
    </Flex>

  </Fragment>
}