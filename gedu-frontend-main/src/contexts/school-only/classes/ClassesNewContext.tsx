import { Form, FormInstance } from "antd";
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callCreateClasses } from "../../../hooks/school-only/classes-hook";
import { ClassesRequest } from "../../../models/class-model";
import { StudentGradeModel } from "../../../models/enums";
import { useAppContext } from "../../AppContext";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  grade: undefined as StudentGradeModel | undefined | null,
  school_year: undefined as number | undefined | null,
  loading: false,
  form: undefined as FormInstance<any> | undefined,
  form_result: undefined as FormInstance<any> | undefined,
  createClasses: (_values: ClassesRequest): any => { },
  initData: (_values: any): any => { },
  input_data: undefined as any | undefined,
  callSetGrade: (_grade: StudentGradeModel): any => { },
});
interface Props {
  children: ReactNode
}
export default function ClassesNewProvider({ children }: Props) {
  const { account, authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();
  const [form_result] = Form.useForm();
  const [grade, setGrade] = useState<StudentGradeModel | undefined | null>(undefined)
  const [school_year, setSchoolYear] = useState<number | undefined | null>(account?.additional.school_year_id)
  const [input_data, setInputData] = useState<any | undefined>(undefined)
  const location = useLocation()
  useEffect(() => {
    setGrade(location.state?.grade || null)
    if (location.state?.school_year)
      setSchoolYear(location.state.school_year)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function initData(_values: any) {
    setInputData(_values)
  }
  async function createClasses(_values: ClassesRequest): Promise<boolean> {
    setLoading(true)
    const { data, error } = await callCreateClasses(_values) as any
    let result = false
    if (data) {
      callMessage('Tạo danh sách lớp học thành công', 'success')
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình tạo danh sách lớp', 'error')
      }
    }
    setLoading(false)
    return result
  }
  function callSetGrade(_grade: StudentGradeModel) {
    setGrade(_grade)
  }
  return <context.Provider value={{
    ___testing: false,
    grade, callSetGrade,
    school_year,
    loading, form,
    createClasses,
    input_data, initData,
    form_result,
  }}>
    {!authority?.can_touch_grade && <ForbiddenState />}
    {authority?.can_touch_grade && children}
  </context.Provider>
}
const useClassesNewContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useClassesNewContext wad used outside of ClassesNewProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useClassesNewContext };
