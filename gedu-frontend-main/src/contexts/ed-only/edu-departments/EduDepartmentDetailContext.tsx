import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useEDStaffs } from "../../../hooks/ed-only/ed-staffs-hook";
import { useEduDepartmentDetail } from "../../../hooks/ed-only/edu-departments-hook";
import { EDStaffRow } from "../../../models/ed-only/ed-staff-model";
import { EduDepartmentDetail } from "../../../models/ed-only/edu-department-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../EDLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as EduDepartmentDetail | null,
  fetching: true,
  error: null,
  members: null as EDStaffRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  members_fetching: true,
  members_error: null,
});
interface Props {
  children: ReactNode
}
export default function EduDepartmentDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const { id } = useParams();
  const department_id = useMemo(() => {
    if (!id) return
    return Number(id)
  }, [id])
  const { data, fetching, error } = useEduDepartmentDetail(department_id)
  const { page, size } = useMemo(() => {
    let page = searchParams.get('page') as any
    let size = searchParams.get('size') as any
    if (!page || isNaN(+page) || Number(page) < 1) page = 1
    else page = Number(page)
    if (!size || isNaN(+size) || Number(size) < 1) size = PAGINATE_DEFAULT_SIZE
    else size = Number(size)
    if (size > PAGINATE_MAX_SIZE) size = PAGINATE_MAX_SIZE
    return { page, size }
  }, [searchParams])
  const { data: members, total, fetching: members_fetching, error: members_error } =
    useEDStaffs(page, size, undefined, department_id, undefined, department_id ? true : false)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.edu_departments.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 3001) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.edu_departments.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  return <context.Provider value={{
    ___testing: false,
    data, fetching, error,
    members, page, size, total, members_fetching, members_error
  }}>
    {children}
  </context.Provider>
}
const useEduDepartmentDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useEduDepartmentDetailContext wad used outside of EduDepartmentDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useEduDepartmentDetailContext };
