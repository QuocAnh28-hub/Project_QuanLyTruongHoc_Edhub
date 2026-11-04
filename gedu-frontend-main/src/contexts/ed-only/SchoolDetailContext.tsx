import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ForbiddenState from "../../components/molecules/forbidden-state";
import { callCreateASchoolCampus, callUpdateASchool, callUpdateASchoolOperations, useSchoolDetail } from "../../hooks/ed-only/schools-hook";
import { School, SchoolCampus, SchoolOperations } from "../../models/ed-only/school-model";
import { nav_links } from "../../utils/routes";
import { useLayoutContext } from "../EDLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as School | null,
  fetching: true,
  error: null,
  mutate: () => { },
  update_mode: false,
  switchUpdateMode: (_mode: boolean) => { },
  loading: false,
  updateSchool: (_value: School): any => { },
  createSchoolCampus: (_value: any): any => { },
});
interface Props {
  children: ReactNode
}
export default function SchoolDetailProvider({ children }: Props) {
  const navigate = useNavigate()
  const { callMessage } = useLayoutContext()
  const { id } = useParams();
  const school_id = useMemo(() => {
    if (!id) return 0
    return Number(id)
  }, [id])
  const [update_mode, setUpdateMode] = useState<boolean>(false)
  const { data, fetching, error, mutate } = useSchoolDetail(school_id)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.schools.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 404) {
      navigate(nav_links.schools.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  function switchUpdateMode(_mode: boolean) {
    setUpdateMode(_mode)
  }

  async function updateSchool(form_value: School): Promise<boolean> {
    if (!form_value || !form_value.id) return false
    setLoading(true)
    const { data, error } = await callUpdateASchool(school_id, form_value) as any
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


  async function createSchoolCampus(form_value: any): Promise<boolean> {
    if (!form_value) return false
    setLoading(true)

    // Biến đổi form_value thành object đúng ở đây
    const school_campus = {
      code: form_value.code,
      name: form_value.name,
      address: form_value.address,
      wardId: form_value.wardId || null,
      provinceId: form_value.proprinceId || null,
      hotline: form_value.hotline,
      totalArea: form_value.totalArea || null,
      distance: form_value.distance || null,
      meansOfTransportation: form_value.meansOfTransportation,
    } as SchoolCampus
    console.log(school_campus)
    const { data, error } = await callCreateASchoolCampus(school_id, school_campus) as any
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
    data, fetching, error, mutate,
    update_mode, switchUpdateMode, loading,
    updateSchool,
    createSchoolCampus
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useSchoolDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolDetailContext wad used outside of SchoolDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolDetailContext };
