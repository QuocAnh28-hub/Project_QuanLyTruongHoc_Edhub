import { Flex } from "antd"
import { useStudentDetailContext } from "../../../../../contexts/school-only/students/StudentDetailContext"
import StudentDetailMedicalInfoUpdate from "./medical-info/student-detail-medical-info-update"
import StudentDetailMedicalInfoView from "./medical-info/student-detail-medical-info-view"

export default function StudentDetailMedicalInfo() {
  const { update_mode } = useStudentDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <StudentDetailMedicalInfoUpdate /> : <StudentDetailMedicalInfoView />}
  </Flex>
}