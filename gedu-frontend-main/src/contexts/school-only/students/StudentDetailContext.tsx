import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callUpdateStudentAcademicAndPolicies, callUpdateStudentInfo, callUpdateStudentMedicalInfo, useStudentDetail } from "../../../hooks/school-only/students-hook";
import { StudentDetail } from "../../../models/student-model";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as StudentDetail | null,
  fetching: true,
  loading: false,
  error: null,
  mutate: () => { },
  update_mode: false,
  switchUpdateMode: (_mode: boolean) => { },
  updateStudentInfo: (_data: any): any => { },
  updateStudentAcademicAndPolicies: (_data: any): any => { },
  updateStudentMedicalInfo: (_data: any,): any => { },
});
interface Props {
  children: ReactNode
}
export default function StudentDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams();
  const student_id = useMemo(() => {
    if (!id) return null
    return Number(id) || null
  }, [id])
  const { data, fetching, error, mutate } = useStudentDetail(student_id)
  const [update_mode, setUpdateMode] = useState<boolean>(false)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.students.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 2709) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.students.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  function switchUpdateMode(_mode: boolean) {
    setUpdateMode(_mode)
  }

  async function updateStudentInfo(_data: any) {
    if (!_data) return
    setLoading(true)
    const { data, error } = await callUpdateStudentInfo(student_id, _data) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      mutate()
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }

  async function updateStudentAcademicAndPolicies(_data: any) {
    if (!_data) return
    setLoading(true)
    const { data, error } = await callUpdateStudentAcademicAndPolicies(student_id, _data) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      mutate()
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function updateStudentMedicalInfo(_data: any[]) {
    if (!_data) return
    setLoading(true)
    const { data, error } = await callUpdateStudentMedicalInfo(student_id, _data) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      mutate()
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật học sinh', 'error')
      }
    }
    setLoading(false)
    return result
  }

  return <context.Provider value={{
    ___testing: false,
    data, fetching, error, loading, mutate,
    update_mode, switchUpdateMode,
    updateStudentInfo,
    updateStudentAcademicAndPolicies,
    updateStudentMedicalInfo,
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useStudentDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStudentDetailContext wad used outside of StudentDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStudentDetailContext };
