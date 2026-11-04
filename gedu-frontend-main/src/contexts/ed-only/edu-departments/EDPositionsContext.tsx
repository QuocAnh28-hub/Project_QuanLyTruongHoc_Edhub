import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useEDPositions } from "../../../hooks/ed-only/ed-positions-hook";
import { EDPositionRow } from "../../../models/ed-only/ed-position-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";

const context = createContext({
  ___testing: true,
  data: null as EDPositionRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  fetching: true
});
interface Props {
  children: ReactNode
}
export default function EDPositionsProvider({ children }: Props) {
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
  const { data, total, fetching } = useEDPositions(page, size, query)

  return <context.Provider value={{
    ___testing: false,
    data, page, size, query, total, fetching
  }}>
    {children}
  </context.Provider>
}
const useEDPositionsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useEDPositionsContext wad used outside of EDPositionsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useEDPositionsContext };
