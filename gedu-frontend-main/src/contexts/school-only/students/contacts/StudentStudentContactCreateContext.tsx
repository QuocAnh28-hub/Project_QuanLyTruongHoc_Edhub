import { createContext, ReactNode, useContext, useState } from "react";
import { callCreateAStudentContact } from "../../../../hooks/school-only/students-hook";
import { useLayoutContext } from "../../../SchoolLayoutContext";
import { useStudentDetailContext } from "../StudentDetailContext";

interface Props {
  children: ReactNode
}
const context = createContext({
  ___testing: true,
  createStudentContact: (_data: any): any => { },
  create_mode: false as boolean,
  setCreateMode: (_value: boolean) => { },
  loading: false,
});

export default function StudentStudentContactCreateProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const { data: student, mutate } = useStudentDetailContext()
  const [create_mode, setCreateMode] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)

  async function createStudentContact(_data: any) {
    if (!student || !_data) return
    setLoading(true)
    _data.grantAccess = _data.grantAccess || false
    _data.isMainContact = _data.isMainContact || false
    const { data, error } = await callCreateAStudentContact(student.id, _data) as any
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

  return <context.Provider value={{
    ___testing: false,
    createStudentContact,
    create_mode, setCreateMode,
    loading,
  }}>
    {children}
  </context.Provider>
}

const useStudentStudentContactCreateContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStudentStudentContactCreateContext wad used outside of StudentStudentContactCreateProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStudentStudentContactCreateContext };
