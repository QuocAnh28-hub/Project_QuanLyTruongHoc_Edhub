import { Button, Flex } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import { CheckOutlined, CloseOutlined } from "../../../../../atoms/svg/outlined-icons";
import EmptyState from "../../../../../molecules/empty-state";

export default function ClassDetailAttendanceUpdate() {
  const { data, switchUpdateMode } = useClassDetailContext()

  function handleSave() {
    switchUpdateMode(false)
  }
  if (!data) return null

  return <Fragment>
    <Flex justify='end' gap={12}>
      <Button icon={<CloseOutlined />} onClick={() => switchUpdateMode(false)}>Huỷ bỏ</Button>
      <Button type="primary" icon={<CheckOutlined />} onClick={() => handleSave()}>Lưu thay đổi</Button>
    </Flex>
    <Flex vertical gap={32}>
      <EmptyState
        title="Tính năng đang phát triển"
        desc="Tính năng sẽ có trong thời gian sớm nhất. Vui lòng quay lại sau" />
    </Flex>

  </Fragment>
}