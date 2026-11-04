import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callUpdateAStaff, callUpdateStaffPositions, useStaffDetail } from "../../../hooks/school-only/staffs-hook";
import { Staff } from "../../../models/staff-model";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as Staff | null,
  fetching: true,
  loading: false,
  error: null,
  update_mode: false,
  switchUpdateMode: (_mode: boolean) => { },
  updateStaff: (_value: any): any => { },
  updateStaffDeptPos: (_value: any): any => { },
});
interface Props {
  children: ReactNode
}
export default function StaffDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams();
  const staff_id = useMemo(() => {
    if (!id) return
    return Number(id)
  }, [id])
  const { data, fetching, error, mutate } = useStaffDetail(staff_id)
  const [update_mode, setUpdateMode] = useState<boolean>(false)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.staffs.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 2709) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.staffs.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  function switchUpdateMode(_mode: boolean) {
    setUpdateMode(_mode)
  }
  async function updateStaff(_value: any) {
    setLoading(true)
    const { data, error } = await callUpdateAStaff(staff_id, _value) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      mutate()
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
  async function updateStaffDeptPos(_value: any) {
    setLoading(true)
    const { data, error } = await callUpdateStaffPositions(staff_id, _value) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      mutate()
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
    data, fetching, error, loading,
    update_mode, switchUpdateMode,
    updateStaff, updateStaffDeptPos,
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useStaffDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStaffDetailContext wad used outside of StaffDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStaffDetailContext };
