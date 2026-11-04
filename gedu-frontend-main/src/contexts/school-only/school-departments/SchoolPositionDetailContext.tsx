import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { POS_DEFAULT_SELECTED_TAB, POS_TAB_TYPEs } from "../../../components/pages/school-only/org-structures/school-positions/model";
import { useSchoolPositionAuthorities, useSchoolPositionDetail } from "../../../hooks/school-only/school-positions-hook";
import { useStaffs } from "../../../hooks/school-only/staffs-hook";
import { SchoolPositionDetail } from "../../../models/school-position-model";
import { StaffAuthority } from "../../../models/staff-authority-model";
import { StaffRow } from "../../../models/staff-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as SchoolPositionDetail | null,
  fetching: true,
  error: null,
  members: null as StaffRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  members_fetching: true,
  members_error: null,
  selected_tab: POS_DEFAULT_SELECTED_TAB,
  setSelectedTab: (_tab_key: string) => { },
  authorities: null as StaffAuthority[] | null,
  authorities_fetching: true,
  authorities_error: null,
});

interface Props {
  children: ReactNode
}
export default function SchoolPositionDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id } = useParams();
  const position_id = useMemo(() => {
    if (!id) return
    return Number(id)
  }, [id])
  const { data, fetching, error } = useSchoolPositionDetail(position_id)
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

  const [selected_tab, setSelectedTab] = useState<string>(POS_DEFAULT_SELECTED_TAB)
  const { data: members, total, fetching: members_fetching, error: members_error } =
    useStaffs(
      page, size, undefined, undefined, position_id,
      position_id && selected_tab == POS_TAB_TYPEs.members ? true : false
    )
  const { data: authorities, fetching: authorities_fetching, error: authorities_error } =
    useSchoolPositionAuthorities(position_id && selected_tab == POS_TAB_TYPEs.permission ? position_id : undefined)

  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.school_positions.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 2709) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.school_positions.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  return <context.Provider value={{
    ___testing: false,
    data, fetching, error,
    members, page, size, total, members_fetching, members_error,
    selected_tab, setSelectedTab,
    authorities, authorities_fetching, authorities_error
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useSchoolPositionDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolPositionDetailContext wad used outside of SchoolPositionDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolPositionDetailContext };
