import { Form, FormInstance } from "antd";
import { createContext, ReactNode, useContext, useState } from "react";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callCreateASchoolYear } from "../../../hooks/school-only/school-years-hook";
import { default_create_form, SchoolYearCreateForm, SchoolYearRequest } from "../../../models/school-year-model";
import { useAppContext } from "../../AppContext";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  school_year: new SchoolYearCreateForm(),
  loading: false,
  form: undefined as FormInstance<any> | undefined,
  createSchoolYear: (_value: SchoolYearCreateForm): any => { },
});
interface Props {
  children: ReactNode
}
export default function SchoolYearNewProvider({ children }: Props) {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const [school_year, setSchoolYear] = useState<SchoolYearCreateForm>(default_create_form)
  const [loading, setLoading] = useState<boolean>(false)
  const [form] = Form.useForm();

  async function createSchoolYear(form_value: SchoolYearCreateForm): Promise<boolean> {
    if (!form_value) return false
    setLoading(true)
    const request = new SchoolYearRequest()
    request.title = form_value.title
    request.fromDate = form_value.school_year_date_range?.[0] || null
    request.toDate = form_value.school_year_date_range?.[1] || null
    if (form_value.semesters) request.semesters = []
    form_value.semesters?.map(semester => {
      const _sem = {
        title: semester.title,
        fromDate: semester.semester_date_range?.[0] || null,
        toDate: semester.semester_date_range?.[1] || null,
        examinations: [] as any[]
      }
      const _exams = form_value.examinations?.filter(e => e.semester_key == semester.key)
      _exams?.map(exam => {
        const _exam = {
          title: exam.title,
          fromDate: exam.examination_date_range?.[0] || null,
          toDate: exam.examination_date_range?.[1] || null,
        }
        _sem.examinations.push(_exam)
      })
      request.semesters?.push(_sem)
    })
    const { data, error } = await callCreateASchoolYear(request) as any
    let result = false
    if (data?.id) {
      if (!form_value.id)
        callMessage('Tạo năm mới thành công', 'success')
      form_value.id = data.id
      setSchoolYear(form_value)
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi trong quá trình tạo năm mới', 'error')
      }
    }
    setLoading(false)
    return result
  }
  return <context.Provider value={{
    ___testing: false,
    school_year, loading, form, createSchoolYear
  }}>
    {!authority?.can_touch_schoolyear && <ForbiddenState />}
    {authority?.can_touch_schoolyear && children}
  </context.Provider>
}
const useSchoolYearCreateContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolYearCreateContext wad used outside of SchoolYearNewProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolYearCreateContext };
