import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useClassStudents } from "../../../../hooks/school-only/classes-hook";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../../utils/constants";
import { useClassDetailContext } from "../ClassDetailContext";

const context = createContext({
  ___testing: true,
  students: null as any[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  fetching: false,
  refreshing: false,
  error: null,
});
interface Props {
  children: ReactNode
}
export default function ClassDetailStudentsProvider({ children }: Props) {
  const { data } = useClassDetailContext()
  const [searchParams] = useSearchParams();
  const { page, size, query } = useMemo(() => {
    let page = searchParams.get('page') as any
    let size = searchParams.get('size') as any
    const query = searchParams.get('q') as any
    if (!page || isNaN(+page) || Number(page) < 1) page = 1
    else page = Number(page)
    if (!size || isNaN(+size) || Number(size) < 1) size = PAGINATE_DEFAULT_SIZE
    else size = Number(size)
    if (size > PAGINATE_MAX_SIZE) size = PAGINATE_MAX_SIZE
    return { page, size, query }
  }, [searchParams])
  const {
    data: students, total,
    fetching, refreshing,
    error
  } = useClassStudents(data?.id, page, size, query)

  return <context.Provider value={{
    ___testing: false,
    students, page, size, query, total, fetching,
    refreshing, error
  }}>
    {children}
  </context.Provider>
}
const useClassDetailStudentsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useClassDetailStudentsContext wad used outside of ClassDetailStudentsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useClassDetailStudentsContext };
