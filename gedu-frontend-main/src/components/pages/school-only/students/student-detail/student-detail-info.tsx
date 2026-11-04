import { Flex } from "antd"
import { useStudentDetailContext } from "../../../../../contexts/school-only/students/StudentDetailContext"
import StudentDetailInfoUpdate from "./info/student-detail-info-update"
import StudentDetailInfoView from "./info/student-detail-info-view"

export default function StudentDetailInfo() {
  const { update_mode } = useStudentDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <StudentDetailInfoUpdate /> : <StudentDetailInfoView />}
  </Flex>
}