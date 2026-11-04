import { ReactNode, createContext, useContext, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callStartSchoolYear, useSchoolYears } from "../../../hooks/school-only/school-years-hook";
import { SchoolYearRow } from "../../../models/school-year-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as SchoolYearRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  fetching: true,
  startSchoolYear: (_data: any): any => { },
  loading: false,
});
interface Props {
  children: ReactNode
}
export default function SchoolYearsProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const [searchParams] = useSearchParams();
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
  const { data, total, fetching, error, mutate } = useSchoolYears(page, size)
  const [loading, setLoading] = useState<boolean>(false)

  async function startSchoolYear(_school_year_id: number) {
    if (!_school_year_id) return
    setLoading(true)
    const { data, error } = await callStartSchoolYear(_school_year_id) as any
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      window.location.reload();
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật', 'error')
      }
    }
    setLoading(false)
    return data
  }


  return <context.Provider value={{
    ___testing: false,
    data, page, size, total, fetching,
    startSchoolYear, loading
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useSchoolYearsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolYearsContext wad used outside of SchoolYearsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolYearsContext };
