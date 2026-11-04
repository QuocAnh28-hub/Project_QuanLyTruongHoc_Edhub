import { Form, FormInstance } from "antd";
import { ReactNode, createContext, useContext, useState } from "react";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callCreateAStaff, callUpdateStaffPositions } from "../../../hooks/school-only/staffs-hook";
import { Staff, StaffRequest } from "../../../models/staff-model";
import { useAppContext } from "../../AppContext";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  staff: new StaffRequest(),
  loading: false,
  form_step1: undefined as FormInstance<any> | undefined,
  form_step2: undefined as FormInstance<any> | undefined,
  form_step3: undefined as FormInstance<any> | undefined,
  createStaff: (_value: StaffRequest): any => { },
  updateStaffDeptPos: (_value: Staff): any => { },
});
interface Props {
  children: ReactNode
}
export default function StaffNewProvider({ children }: Props) {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const [staff, setStaff] = useState<StaffRequest>(new StaffRequest())
  const [loading, setLoading] = useState<boolean>(false)
  const [form_step1] = Form.useForm();
  const [form_step2] = Form.useForm();
  const [form_step3] = Form.useForm();

  async function createStaff(value: StaffRequest): Promise<boolean> {
    setLoading(true)
    const { data, error } = await callCreateAStaff(value) as any
    let result = false
    if (data?.id) {
      if (!value.id)
        callMessage('Tạo Cán bộ/Giáo viên thành công', 'success')
      value.id = data.id
      setStaff(value)
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi trong quá trình tạo Cán bộ/Giáo viên', 'error')
      }
    }
    setLoading(false)
    return result
  }
  async function updateStaffDeptPos(_value: any) {
    setLoading(true)
    const { data, error } = await callUpdateStaffPositions(staff.id, _value) as any
    let result = false
    if (data) {
      staff.departmentId = _value.departmentId
      staff.positionId = _value.positionId
      staff.schoolStaffPositions = data.schoolStaffPositions
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
  return <context.Provider value={{
    ___testing: false,
    staff, loading, form_step1, form_step2, form_step3, createStaff, updateStaffDeptPos
  }}>
    {!authority?.can_touch_staff && <ForbiddenState />}
    {authority?.can_touch_staff && children}
  </context.Provider>
}
const useStaffCreateContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStaffCreateContext wad used outside of StaffNewProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStaffCreateContext };
