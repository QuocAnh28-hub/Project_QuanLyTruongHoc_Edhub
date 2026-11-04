import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { callActivateContact, callDeleteAStudentContact, callUpdateAStudentContact } from "../../../../hooks/school-only/students-hook";
import { StudentContact } from "../../../../models/student-model";
import { useLayoutContext } from "../../../SchoolLayoutContext";
import { useStudentDetailContext } from "../StudentDetailContext";

interface Props {
  children: ReactNode
  main_contact_id: number | null
  contact: StudentContact
}
const context = createContext({
  ___testing: true,
  contact: undefined as StudentContact | undefined,
  activateStudentContact: (_contact_id: number, _first_activate: boolean): any => { },
  updateStudentContact: (_contact_id: number, _data: any): any => { },
  deleteStudentContact: (_contact_id: number): any => { },
  edit_mode: false as boolean,
  setEditMode: (_value: boolean) => { },
  loading: false,
  is_main_contact: false,
  can_grant_access: false,
});

export default function StudentStudentContactProvider({ children, contact, main_contact_id }: Props) {
  const { callMessage } = useLayoutContext()
  const { data: student, mutate } = useStudentDetailContext()
  const [edit_mode, setEditMode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const { is_main_contact, can_grant_access } = useMemo(() => {
    const is_main_contact = main_contact_id == contact?.id
    const can_grant_access = contact?.grantAccess || false
    return { is_main_contact, can_grant_access }
  }, [contact, main_contact_id])


  async function activateStudentContact(_contact_id: number, first_activate: boolean = true) {
    if (!student || !_contact_id) return
    setLoading(true)

    const { data, error } = await callActivateContact(student.id, _contact_id) as any
    let result = false
    if (data) {
      if (first_activate)
        callMessage('Kích hoạt thông tin thành công', 'success')
      else
        callMessage('Đặt lại mật khẩu thành công', 'success')
      mutate()
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình thực thi', 'error')
      }
    }
    setLoading(false)
    return result
  }

  async function updateStudentContact(contact_id: number, _data: any) {
    if (!student || !_data) return
    setLoading(true)
    const { data, error } = await callUpdateAStudentContact(student.id, contact_id, _data) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      mutate()
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật người giám hộ', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function deleteStudentContact(contact_id: number) {
    if (!student) return
    setLoading(true)
    const { data, error } = await callDeleteAStudentContact(student.id, contact_id) as any
    let result = false
    if (data) {
      callMessage('Xoá người giám hộ thành công', 'success')
      mutate()
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình xoá người giám hộ', 'error')
      }
    }
    setLoading(false)
    return result
  }

  return <context.Provider value={{
    ___testing: false,
    contact, activateStudentContact, updateStudentContact, deleteStudentContact,
    edit_mode, setEditMode,
    is_main_contact, can_grant_access,
    loading,
  }}>
    {children}
  </context.Provider>
}

const useStudentStudentContactContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStudentStudentContactContext wad used outside of StudentStudentContactProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStudentStudentContactContext };
