import { Flex, Row } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import EmptyState from "../../../../../molecules/empty-state";

export default function ClassDetailTimetableView() {
  const { data, switchUpdateMode } = useClassDetailContext()

  if (!data) return null

  return <Fragment>
    <Row justify='end'>
      {/* <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Chỉnh sửa</Button> */}
    </Row>
    <Flex vertical style={{ padding: 40 }}>
      <EmptyState icon="calendar"
        title="Lớp học này chưa có thời khóa biểu."
        desc="Thời khóa biểu sẽ được hiển thị ở đây sau khi được tạo và áp dụng cho lớp. Bạn có thể tạo thời khóa biểu trong module Thời khóa biểu." />
    </Flex>

  </Fragment>
}