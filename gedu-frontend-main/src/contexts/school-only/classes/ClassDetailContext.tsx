import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callUpdateAClass, useClassDetail } from "../../../hooks/school-only/classes-hook";
import { ClassDetail } from "../../../models/class-model";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as ClassDetail | null,
  fetching: false,
  refreshing: false,
  loading: false,
  error: null,
  update_mode: false,
  switchUpdateMode: (_mode: boolean) => { },
  updateClassInfo: (_data: any): any => { },
});
interface Props {
  children: ReactNode
}
export default function ClassDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams();
  const class_id = useMemo(() => {
    if (!id) return null
    return Number(id) || null
  }, [id])
  const { data, fetching, refreshing, error, mutate } = useClassDetail(class_id)
  const [update_mode, setUpdateMode] = useState<boolean>(false)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.grade_levels.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 2709) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.grade_levels.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  function switchUpdateMode(_mode: boolean) {
    setUpdateMode(_mode)
  }

  async function updateClassInfo(_data: any) {
    if (!_data) return
    setLoading(true)
    const { data, error } = await callUpdateAClass(class_id, _data) as any
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

  return <context.Provider value={{
    ___testing: false,
    data, fetching, refreshing, error, loading,
    update_mode, switchUpdateMode,
    updateClassInfo,
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useClassDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useClassDetailContext wad used outside of ClassDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useClassDetailContext };
