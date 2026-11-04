import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callUpdateASchoolYear, useSchoolYearDetail } from "../../../hooks/school-only/school-years-hook";
import { SchoolYearCreateForm, SchoolYearDetail, SchoolYearRequest } from "../../../models/school-year-model";
import { nav_links } from "../../../utils/routes";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  school_year: null as SchoolYearDetail | null,
  fetching: true,
  loading: false,
  error: null,
  update_mode: false,
  switchUpdateMode: (_mode: boolean) => { },
  updateSchoolYear: (_data: any): any => { },
});
interface Props {
  children: ReactNode
}
export default function SchoolYearDetailProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const { id } = useParams();
  const school_year_id = useMemo(() => {
    if (!id) return null
    return Number(id) || null
  }, [id])
  const { data: school_year, fetching, error, mutate } = useSchoolYearDetail(school_year_id)
  const [update_mode, setUpdateMode] = useState<boolean>(false)
  useEffect(() => {
    if (!id || isNaN(+id)) {
      navigate(nav_links.school_years.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (error?.code == 2709) {
      callMessage('Không có thông tin', 'error')
      navigate(nav_links.school_years.route)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error])
  function switchUpdateMode(_mode: boolean) {
    setUpdateMode(_mode)
  }

  async function updateSchoolYear(_data: SchoolYearCreateForm) {
    if (!_data) return
    setLoading(true)

    const _semesters = _data.semesters?.map(s => {
      // exams in this semester
      const _exams = _data.examinations?.filter(e => e.semester_key == s.key)?.map(e => {
        return {
          id: e.id,
          title: e.title,
          semester_id: s.id,
          fromDate: e.examination_date_range?.[0] || null,
          toDate: e.examination_date_range?.[1] || null,
        }
      })
      return {
        id: s.id,
        title: s.title,
        fromDate: s.semester_date_range?.[0] || null,
        toDate: s.semester_date_range?.[1] || null,
        examinations: _exams
      }
    }) || [] as any[]

    const _deleted_semesters = [] as any[]
    const _deleted_exams = [] as any[]
    school_year?.semesters?.map(s => {
      if (!_data.semesters?.find(_d_s => _d_s.id == s.id)) {
        _deleted_semesters.push({
          id: s.id,
          isDeleted: true
        })
      }
      s.examinations?.map(e => {
        if (!_data.examinations?.find(_d_e => _d_e.id == e.id))
          _deleted_exams.push({
            id: e.id,
            isDeleted: true
          })
      })
    })
    if (_deleted_semesters?.length) _semesters.push(..._deleted_semesters)

    const _request = {
      id: _data.id,
      title: _data.title,
      fromDate: _data.school_year_date_range?.[0] || null,
      toDate: _data.school_year_date_range?.[1] || null,
      semesters: _semesters,
      examinations: _deleted_exams
    } as SchoolYearRequest

    const { data, error } = await callUpdateASchoolYear(school_year_id, _request) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      mutate()
      result = true
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi xảy ra trong quá trình cập nhật', 'error')
      }
    }
    setLoading(false)
    return result
  }

  return <context.Provider value={{
    ___testing: false,
    school_year, fetching, error, loading,
    update_mode, switchUpdateMode,
    updateSchoolYear,
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {school_year && children}
  </context.Provider>
}
const useSchoolYearDetailContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolYearDetailContext wad used outside of SchoolYearDetailProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolYearDetailContext };
