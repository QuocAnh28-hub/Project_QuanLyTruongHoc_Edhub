import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../components/molecules/forbidden-state";
import { useEDStaffs } from "../../hooks/ed-only/ed-staffs-hook";
import { FETCH_ERROR } from "../../models/common";
import { EDStaffRow } from "../../models/ed-only/ed-staff-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../utils/constants";

const context = createContext({
  ___testing: true,
  data: null as EDStaffRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  dept: undefined as number | string | undefined,
  pos: undefined as number | string | undefined,
  fetching: true,
  error: undefined as FETCH_ERROR | undefined
});
interface Props {
  children: ReactNode
}
export default function EDStaffsProvider({ children }: Props) {
  const [searchParams] = useSearchParams();
  const { page, size, query, dept, pos } = useMemo(() => {
    let page = searchParams.get('page') as any
    let size = searchParams.get('size') as any
    const query = searchParams.get('q') as any
    const dept = searchParams.get('dept') as any
    const pos = searchParams.get('pos') as any
    if (!page || isNaN(+page) || Number(page) < 1) page = 1
    else page = Number(page)
    if (!size || isNaN(+size) || Number(size) < 1) size = PAGINATE_DEFAULT_SIZE
    else size = Number(size)
    if (size > PAGINATE_MAX_SIZE) size = PAGINATE_MAX_SIZE
    return { page, size, query, dept, pos }
  }, [searchParams])
  const { data, total, fetching, error } = useEDStaffs(page, size, query, dept, pos)

  return <context.Provider value={{
    ___testing: false,
    data, page, size,
    query, dept, pos,
    total, fetching,
    error
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useEDStaffsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useEDStaffsContext wad used outside of EDStaffsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useEDStaffsContext };
