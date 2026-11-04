import { Flex, Row } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import EmptyState from "../../../../../molecules/empty-state";

export default function ClassDetailScoreboardView() {
  const { data, switchUpdateMode } = useClassDetailContext()

  if (!data) return null

  return <Fragment>
    <Row justify='end'>
      {/* <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Chỉnh sửa</Button> */}
    </Row>
    <Flex vertical style={{ padding: 40 }}>
      <EmptyState icon="medal"
        title="Chưa có dữ liệu điểm số."
        desc="Bảng điểm tổng hợp của lớp sẽ được hiển thị tại đây sau khi giáo viên nhập điểm cho các môn học. Vui lòng đảm bảo lớp đã có học sinh và đã được phân công giảng dạy." />
    </Flex>
  </Fragment>
}