import { Form, FormInstance } from "antd";
import { ReactNode, createContext, useContext, useState } from "react";
import { callUpdateASchool, createASchool, createASchoolAdmin } from "../../hooks/ed-only/schools-hook";
import { School } from "../../models/ed-only/school-model";
import { useLayoutContext } from "../EDLayoutContext";

const context = createContext({
  ___testing: true,
  school: new School(),
  loading: false,
  form_step1: undefined as FormInstance<any> | undefined,
  form_step2: undefined as FormInstance<any> | undefined,
  form_step3: undefined as FormInstance<any> | undefined,
  createSchool: (_value: School): any => { },
  updateSchool: (_value: School): any => { },
  createSchoolAdmin: (_value: any): any => { },
});
interface Props {
  children: ReactNode
}
export default function SchoolNewProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const [school, setSchool] = useState<School>(new School())
  const [loading, setLoading] = useState<boolean>(false)
  const [form_step1] = Form.useForm();
  const [form_step2] = Form.useForm();
  const [form_step3] = Form.useForm();

  async function createSchool(value: School): Promise<boolean> {
    setLoading(true)
    const { data, error } = await createASchool(value) as any
    let result = false
    if (data?.id) {
      if (!value.id)
        callMessage('Tạo Trường thành công', 'success')
      value.id = data.id
      setSchool(value)
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi trong quá trình tạo Trường', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function updateSchool(_value: School) {
    setLoading(true)
    const { data, error } = await callUpdateASchool(_value.id, _value) as any
    let result = false
    if (data) {
      school.dailyScheduleType = _value.dailyScheduleType
      result = true
      callMessage('Cập nhật thông tin thành công', 'success')
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi trong quá trình cập nhật', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function createSchoolAdmin(value: any): Promise<number | undefined> {
    if (!school || !school.id) return
    setLoading(true)
    const { data, error } = await createASchoolAdmin(school.id, value) as any
    if (error?.message) {
      if (error.code == 'user_name.exists')
        callMessage('Email đã được sử dụng', 'error')
      else
        callMessage(error.message, 'error')
    } else {
      callMessage('Thêm tài khoản admin trường thành công', 'success')
    }
    setLoading(false)
    return data
  }
  return <context.Provider value={{
    ___testing: false,
    school, loading, form_step1, form_step2, form_step3, createSchool, updateSchool, createSchoolAdmin
  }}>
    {children}
  </context.Provider>
}
const useSchoolCreateContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolCreateContext wad used outside of SchoolNewProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolCreateContext };
