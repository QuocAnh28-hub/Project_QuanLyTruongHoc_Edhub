import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../components/molecules/forbidden-state";
import { useSchools } from "../../hooks/ed-only/schools-hook";
import { SchoolRow } from "../../models/ed-only/school-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../utils/constants";

const context = createContext({
  ___testing: true,
  data: null as SchoolRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  type: undefined as number | string | undefined,
  intl: undefined as number | string | undefined,
  status: undefined as number | string | undefined,
  level: undefined as number | string | undefined,
  fetching: true,
  mutate: () => { }
});
interface Props {
  children: ReactNode
}
export default function SchoolsProvider({ children }: Props) {
  const [searchParams] = useSearchParams();
  const { page, size, query, type, intl, status, level } = useMemo(() => {
    let page = searchParams.get('page') as any
    let size = searchParams.get('size') as any
    const query = searchParams.get('q') as any
    const type = searchParams.get('type') as any
    const intl = searchParams.get('intl') as any
    const status = searchParams.get('status') as any
    const level = searchParams.get('level') as any
    if (!page || isNaN(+page) || Number(page) < 1) page = 1
    else page = Number(page)
    if (!size || isNaN(+size) || Number(size) < 1) size = PAGINATE_DEFAULT_SIZE
    else size = Number(size)
    if (size > PAGINATE_MAX_SIZE) size = PAGINATE_MAX_SIZE
    return { page, size, query, type, intl, status, level }
  }, [searchParams])
  const { data, total, fetching, error, mutate } = useSchools(page, size, query, type, intl, status, level)

  return <context.Provider value={{
    ___testing: false,
    data, page, size, query, type, intl, status, level, total, fetching, mutate
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useSchoolsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolsContext wad used outside of SchoolsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolsContext };
