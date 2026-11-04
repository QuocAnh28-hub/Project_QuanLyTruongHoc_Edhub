import StudentStudentContactCreateProvider, { useStudentStudentContactCreateContext } from "../../../../../contexts/school-only/students/contacts/StudentStudentContactCreateContext";
import { PlusOutlined } from "../../../../atoms/svg/outlined-icons";
import { Button } from "antd";
import StudentContactCardCreate from "./student-contacts/student-contact-card-create";
import RouterBlockerProvider from "../../../../../contexts/RouterBlockerContext";

const StudentContactCardNew = () => {
  return <StudentStudentContactCreateProvider> <Content /></StudentStudentContactCreateProvider >
}
export default StudentContactCardNew

function Content() {
  const { create_mode, setCreateMode } = useStudentStudentContactCreateContext()
  return create_mode ?
    <RouterBlockerProvider>
      <StudentContactCardCreate />
    </RouterBlockerProvider> :
    <Button type="link"
      icon={<PlusOutlined />}
      onClick={() => setCreateMode(true)}
    >
      Thêm người liên hệ
    </Button>
}