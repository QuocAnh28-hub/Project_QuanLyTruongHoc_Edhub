import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callUpdateACurriculumSubject, useSubjectCurriculums, useSubjectDetail } from "../../../hooks/school-only/subjects-hook";
import { SubjectCurriculumRow, SubjectDetail } from "../../../models/subject-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as SubjectDetail | null,
  fetching: true,
  error: null,
  curriculums: null as SubjectCurriculumRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  curriculums_fetching: true,
  curriculums_error: null,
  curriculums_mutate: () => { },
  updateCurriculumSubject: (_curr_id: number, _subj_id: number, _grade: number, _value: any): any => { },
});
interface Props {
  children: ReactNode
}
export default function SubjectDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id } = useParams();
  const subject_id = useMemo(() => {
    if (!id) return
    return Number(id)
  }, [id])
  const { data, fetching, error } = useSubjectDetail(subject_id)
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
  const { data: curriculums, total, fetching: curriculums_fetching, error: curriculums_error, mutate: curriculums_mutate } =
    useSubjectCurriculums(subject_id, page, size)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.subjects.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 2709) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.subjects.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  async function updateCurriculumSubject(_curr_id: number, _subj_id: number, _grade: number, _value: any) {
    const { data, error } = await callUpdateACurriculumSubject(_curr_id, _subj_id, _grade, _value) as any
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
    data, fetching, error,
    curriculums, page, size, total,
    curriculums_fetching,
    curriculums_error,
    curriculums_mutate,
    updateCurriculumSubject
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useSubjectDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSubjectDetailContext wad used outside of SubjectDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSubjectDetailContext };
