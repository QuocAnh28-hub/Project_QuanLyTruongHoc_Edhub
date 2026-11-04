import { Flex } from "antd"
import ClassDetailStudentsProvider, { useClassDetailStudentsContext } from "../../../../../contexts/school-only/classes/class-detail/ClassDetailStudentsContext"
import EmptyState from "../../../../molecules/empty-state"
import StudentsTable from "./students/students-table"

export default function ClassDetailStudents() {
  return <ClassDetailStudentsProvider>
    <Content />
  </ClassDetailStudentsProvider>
}
function Content() {
  const { students, fetching } = useClassDetailStudentsContext()

  if (fetching) return null
  if (!fetching && students && !students.length)
    return <Flex vertical style={{ padding: 40 }}>
      <EmptyState icon="school-bag"
        title="Lớp học này chưa có học sinh."
        desc="Hãy bắt đầu bằng cách thêm học sinh vào lớp để quản lý hồ sơ, điểm danh và kết quả học tập." />
    </Flex>

  return <StudentsTable />
}