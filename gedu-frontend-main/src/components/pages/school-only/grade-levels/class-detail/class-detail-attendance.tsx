import { Flex } from "antd"
import { useClassDetailContext } from "../../../../../contexts/school-only/classes/ClassDetailContext"
import ClassDetailAttendanceUpdate from "./attendance/class-detail-attendance-update"
import ClassDetailAttendanceView from "./attendance/class-detail-attendance-view"

export default function ClassDetailAttendance() {
  const { update_mode } = useClassDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <ClassDetailAttendanceUpdate /> : <ClassDetailAttendanceView />}
  </Flex>
}