import { ReactNode, createContext, useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMetaSchoolYears } from "../../../hooks/school-only/shared-data-hook";
import { StudentGradeModel } from "../../../models/enums";
import { nav_links } from "../../../utils/routes";
import { useAppContext } from "../../AppContext";
import { useLayoutContext } from "../../SchoolLayoutContext";

const context = createContext({
  ___testing: true,
  ready: false,
  school_years: [] as any,
  school_year: undefined as number | null | undefined,
  setSchoolYear: (_value: number | null | undefined) => { },
  grade: undefined as StudentGradeModel | undefined,
  grade_levels: [] as StudentGradeModel[]
});
interface Props {
  children: ReactNode
}
export default function GradeLevelsProvider({ children }: Props) {
  const { account } = useAppContext()
  const { grade_levels } = useLayoutContext()
  const navigate = useNavigate()
  const { id: grade_code } = useParams();
  const [ready, setReady] = useState(false)
  const { data: school_years, fetching: yrs_load } = useMetaSchoolYears();
  const [school_year, setSchoolYear] = useState<number | null | undefined>(account?.additional.school_year_id)

  const grade = useMemo(() => {
    if (!grade_levels?.length) return undefined
    return grade_levels.find(g => g.code == grade_code)
  }, [grade_code, grade_levels])

  useEffect(() => {
    if (!grade_levels?.length) return
    if (grade_code && !grade_levels.find(g => g.code == grade_code)) {
      navigate(nav_links.grade_levels.route)
    }
  }, [])

  useEffect(() => {
    if (school_years && school_year === undefined)
      setSchoolYear(school_years[0]?.id || null)
  }, [school_years])

  useEffect(() => {
    if (!yrs_load && school_year !== undefined)
      setReady(true)
  }, [school_year, yrs_load, grade])
  return <context.Provider value={{
    ___testing: false, ready,
    grade, grade_levels,
    school_years, school_year, setSchoolYear
  }}>
    {children}
  </context.Provider>
}
const useGradeLevelsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useGradeLevelsContext wad used outside of GradeLevelsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useGradeLevelsContext };
