import { Form, FormInstance } from "antd";
import { ReactNode, createContext, useContext, useState } from "react";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callCreateAStudent, callGrantAccessContact, callUpdateStudentAcademicAndPolicies, callUpdateStudentContacts, callUpdateStudentMedicalInfo } from "../../../hooks/school-only/students-hook";
import { StudentContact, StudentRequest } from "../../../models/student-model";
import { useAppContext } from "../../AppContext";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  student: new StudentRequest(),
  studentContacts: [] as any[],
  loading: false,
  form_step1: undefined as FormInstance<any> | undefined,
  form_step2: undefined as FormInstance<any> | undefined,
  form_step3: undefined as FormInstance<any> | undefined,
  form_step4: undefined as FormInstance<any> | undefined,
  grant_access_id: 0,
  setGrantAccessId: (_value: number) => { },
  createStudent: (_value: StudentRequest): any => { },
  createStudentContacts: (_id: number, _value: StudentContact[], _raw: any): any => { },
  updateStudentAcademicAndPolicies: (_id: number, _value: any): any => { },
  updateStudentMedicalInfo: (_id: number, _value: any, _raw: any): any => { },
  grantAccessContact: (_id: number, _contact_id: number): any => { },
});
interface Props {
  children: ReactNode
}
export default function StudentNewProvider({ children }: Props) {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const [student, setStudent] = useState<StudentRequest>(new StudentRequest())
  const [studentContacts, setStudentContacts] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [form_step1] = Form.useForm();
  const [form_step2] = Form.useForm();
  const [form_step3] = Form.useForm();
  const [form_step4] = Form.useForm();
  const [grant_access_id, setGrantAccessId] = useState(0)

  async function createStudent(value: StudentRequest): Promise<boolean> {
    setLoading(true)
    const { data, error } = await callCreateAStudent(value) as any
    let result = false
    if (data?.id) {
      if (!value.id)
        callMessage('Tạo học sinh thành công', 'success')
      value.id = data.id
      setStudent(value)
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình tạo học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function createStudentContacts(_id: number, _value: StudentContact[], _raw: any) {
    if (!_id || !_value) return
    setLoading(true)
    const { data, error } = await callUpdateStudentContacts(_id, _value) as any
    let result = false
    if (data?.length) {
      const main = data.find((_d: StudentContact) => _d.isMainContact)
      if (main) setGrantAccessId(main)
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      student.studentContacts = _raw
      setStudentContacts(data)
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình tạo học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function updateStudentAcademicAndPolicies(_id: number, _value: any) {
    if (!_id || !_value) return
    setLoading(true)
    const { data, error } = await callUpdateStudentAcademicAndPolicies(_id, _value) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      setStudent({ ...student, ..._value })
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình tạo học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function updateStudentMedicalInfo(_id: number, _value: any[], _raw: any) {
    if (!_id || !_value) return
    setLoading(true)
    const { data, error } = await callUpdateStudentMedicalInfo(_id, _value) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      student.medicalInfo = _raw
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình tạo học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function grantAccessContact(_id: number, _contact_id: number) {
    if (!_id || !_contact_id) return
    setLoading(true)
    const { data, error } = await callGrantAccessContact(_id, _contact_id) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình tạo học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }
  return <context.Provider value={{
    ___testing: false,
    student, studentContacts, loading,
    form_step1, form_step2, form_step3, form_step4,
    grant_access_id, setGrantAccessId,
    createStudent, createStudentContacts,
    updateStudentAcademicAndPolicies,
    updateStudentMedicalInfo,
    grantAccessContact
  }}>
    {!authority?.can_touch_student && <ForbiddenState />}
    {authority?.can_touch_student && children}
  </context.Provider>
}
const useStudentCreateContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStudentCreateContext wad used outside of StudentNewProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStudentCreateContext };
