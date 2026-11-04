import { Flex } from "antd"
import { useStudentDetailContext } from "../../../../../contexts/school-only/students/StudentDetailContext"
import StudentDetailSpecialPoliciesUpdate from "./special-policies/student-detail-special-policies-update"
import StudentDetailSpecialPoliciesView from "./special-policies/student-detail-special-policies-view"

export default function StudentDetailSpecialPolicies() {
  const { update_mode } = useStudentDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <StudentDetailSpecialPoliciesUpdate /> : <StudentDetailSpecialPoliciesView />}
  </Flex>
}