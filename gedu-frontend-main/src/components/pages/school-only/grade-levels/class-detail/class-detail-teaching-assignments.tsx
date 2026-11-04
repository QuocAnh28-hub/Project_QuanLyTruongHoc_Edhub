import { Flex } from "antd"
import { useClassDetailContext } from "../../../../../contexts/school-only/classes/ClassDetailContext"
import ClassDetailTeachingAssignmentsUpdate from "./teaching-assignments/class-detail-teaching-assignments-update"
import ClassDetailTeachingAssignmentsView from "./teaching-assignments/class-detail-teaching-assignments-view"

export default function ClassDetailTeachingAssignments() {
  const { update_mode } = useClassDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <ClassDetailTeachingAssignmentsUpdate /> : <ClassDetailTeachingAssignmentsView />}
  </Flex>
}