import { ReactNode, createContext, useContext, useEffect, useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { useCurriculumDetail, useCurriculumSubjects } from "../../../hooks/school-only/curriculums-hook";
import { CurriculumDetail, CurriculumSubjectRow } from "../../../models/curriculum-model";
import { PAGINATE_DEFAULT_SIZE, PAGINATE_MAX_SIZE } from "../../../utils/constants";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  data: null as CurriculumDetail | null,
  fetching: true,
  error: null,
  subjects: null as CurriculumSubjectRow[] | null,
  total: 0,
  page: 1,
  size: PAGINATE_DEFAULT_SIZE,
  subjects_fetching: true,
  subjects_error: null,
  subjects_mutate: () => { },
});
interface Props {
  children: ReactNode
}
export default function CurriculumDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { id } = useParams();
  const curriculum_id = useMemo(() => {
    if (!id) return
    return Number(id)
  }, [id])
  const { data, fetching, error } = useCurriculumDetail(curriculum_id)
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
  const { data: subjects, total, fetching: subjects_fetching, error: subjects_error, mutate: subjects_mutate } =
    useCurriculumSubjects(curriculum_id, page, size)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.curriculums.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 2709) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.curriculums.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])

  return <context.Provider value={{
    ___testing: false,
    data, fetching, error,
    subjects, page, size, total,
    subjects_fetching, subjects_error, subjects_mutate
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useCurriculumDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useCurriculumDetailContext wad used outside of CurriculumDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useCurriculumDetailContext };
