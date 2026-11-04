import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { useCurriculums } from "../../../hooks/school-only/curriculums-hook";
import { CurriculumRow } from "../../../models/curriculum-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";

const context = createContext({
  ___testing: true,
  data: null as CurriculumRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  fetching: true
});
interface Props {
  children: ReactNode
}
export default function CurriculumsProvider({ children }: Props) {
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
  const { data, total, fetching, error } = useCurriculums(page, size, query)

  return <context.Provider value={{
    ___testing: false,
    data, page, size, query, total, fetching
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useCurriculumsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useCurriculumsContext wad used outside of CurriculumsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useCurriculumsContext };
