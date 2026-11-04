import { StudentContact } from "../../../../../models/student-model";
import StudentContactCardDetail from "./student-contacts/student-contact-card-detail";
import StudentContactCardUpdate from "./student-contacts/student-contact-card-update";
import StudentStudentContactProvider, { useStudentStudentContactContext } from "../../../../../contexts/school-only/students/contacts/StudentStudentContactContext";

interface Props {
  main_contact_id: number | null
  contact: StudentContact
}
const StudentContactCard = ({ main_contact_id, contact }: Props) => {
  return <StudentStudentContactProvider contact={contact} main_contact_id={main_contact_id} > <Content /></StudentStudentContactProvider >
}
export default StudentContactCard
function Content() {
  const { edit_mode } = useStudentStudentContactContext()
  return edit_mode ? <StudentContactCardUpdate /> : <StudentContactCardDetail />
}