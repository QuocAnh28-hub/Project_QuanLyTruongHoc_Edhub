import { Flex } from "antd"
import { useClassDetailContext } from "../../../../../contexts/school-only/classes/ClassDetailContext"
import ClassDetailTimetableUpdate from "./timetable/class-detail-timetable-update"
import ClassDetailTimetableView from "./timetable/class-detail-timetable-view"

export default function ClassDetailTimetable() {
  const { update_mode } = useClassDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <ClassDetailTimetableUpdate /> : <ClassDetailTimetableView />}
  </Flex>
}