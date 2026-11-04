import { ReactNode, createContext, useContext, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callActiveSubject, useSubjects } from "../../../hooks/school-only/subjects-hook";
import { SubjectRow } from "../../../models/subject-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as SubjectRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  query: undefined as string | undefined,
  fetching: true,
  mutate: () => { },
  activeSubject: (_subject_id: number, _can_apply: boolean) => { }
});
interface Props {
  children: ReactNode
}
export default function SubjectsProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
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
  const { data, total, fetching, error, mutate } = useSubjects(page, size, query)

  async function activeSubject(subject_id: number, can_apply: boolean) {
    const { data, error } = await callActiveSubject(subject_id, can_apply) as any
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

  return <context.Provider value={{
    ___testing: false,
    data, page, size,
    query, total,
    fetching, mutate,
    activeSubject
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useSubjectsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSubjectsContext wad used outside of SubjectsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSubjectsContext };
