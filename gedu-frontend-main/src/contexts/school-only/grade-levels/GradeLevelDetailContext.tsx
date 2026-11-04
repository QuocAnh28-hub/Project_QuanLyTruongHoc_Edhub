import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callDeleteAClass, callUpdateAClassSimple, useClasses } from "../../../hooks/school-only/classes-hook";
import { ClassRow } from "../../../models/class-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { useLayoutContext } from "../../SchoolLayoutContext";
import { useGradeLevelsContext } from "./GradeLevelsContext";

const context = createContext({
  ___testing: true,
  data: null as ClassRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  curr: undefined as number | string | undefined,
  fetching: true,
  refreshing: true,
  mutate: () => { },
  updateClass: (_class_id: number, _value: any): any => { },
  deleteClass: (_class_id: number): any => { },
});
interface Props {
  children: ReactNode
}
export default function GradeLevelDetailProvider({ children }: Props) {
  const [searchParams] = useSearchParams();
  const { callMessage } = useLayoutContext()
  const { school_year, grade } = useGradeLevelsContext()
  const { page, size, query, curr } = useMemo(() => {
    let page = searchParams.get('page') as any
    let size = searchParams.get('size') as any
    const query = searchParams.get('q') as any
    const curr = searchParams.get('curr') as any
    if (!page || isNaN(+page) || Number(page) < 1) page = 1
    else page = Number(page)
    if (!size || isNaN(+size) || Number(size) < 1) size = PAGINATE_DEFAULT_SIZE
    else size = Number(size)
    if (size > PAGINATE_MAX_SIZE) size = PAGINATE_MAX_SIZE
    return { page, size, query, curr }
  }, [searchParams])
  const { data, total, fetching, refreshing, error, mutate } = useClasses(school_year || undefined, grade?.enum, page, size, query, curr)

  async function updateClass(class_id: number, _value: any) {
    const { data, error } = await callUpdateAClassSimple(class_id, _value) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi trong quá trình cập nhật', 'error')
      }
    }
    return result
  }
  async function deleteClass(class_id: number) {
    const { data, error } = await callDeleteAClass(class_id) as any
    let result = false
    if (data) {
      callMessage('Đã xoá lớp học', 'success')
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi trong quá trình xoá lớp', 'error')
      }
    }
    return result
  }
  return <context.Provider value={{
    ___testing: false, updateClass, deleteClass,
    data, page, size, query, curr, total,
    fetching, refreshing, mutate
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useGradeLevelDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useGradeLevelDetailContext wad used outside of GradeLevelDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useGradeLevelDetailContext };
