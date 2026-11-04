import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { useStaffs } from "../../../hooks/school-only/staffs-hook";
import { StaffRow } from "../../../models/staff-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";

const context = createContext({
  ___testing: true,
  data: null as StaffRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  dept: undefined as number | string | undefined,
  pos: undefined as number | string | undefined,
  fetching: true,
  mutate: () => { }
});
interface Props {
  children: ReactNode
}
export default function StaffsProvider({ children }: Props) {
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
  const { data, total, fetching, error, mutate } = useStaffs(page, size, query, dept, pos)

  return <context.Provider value={{
    ___testing: false,
    data, page, size, query, dept, pos, total, fetching, mutate
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useStaffsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStaffsContext wad used outside of StaffsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStaffsContext };
