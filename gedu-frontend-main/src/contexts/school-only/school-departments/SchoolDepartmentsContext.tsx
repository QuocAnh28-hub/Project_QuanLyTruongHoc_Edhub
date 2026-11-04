import { ReactNode, createContext, useContext } from "react";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { useCountSchoolDepartments, useSchoolDepartments } from "../../../hooks/school-only/school-departments-hook";
import { SchoolDepartmentRow, SchoolDepartmentRowCount } from "../../../models/school-department-model";

const context = createContext({
  ___testing: true,
  data: null as SchoolDepartmentRow[] | null,
  counted_data: null as SchoolDepartmentRowCount[] | null,
  fetching: true,
  counting: true,
});
interface Props {
  children: ReactNode
}
export default function SchoolDepartmentsProvider({ children }: Props) {
  const { data, fetching, error } = useSchoolDepartments()
  const { data: counted_data, fetching: counting } = useCountSchoolDepartments()

  return <context.Provider value={{
    ___testing: false,
    data, fetching,
    counted_data,
    counting
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useSchoolDepartmentsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolDepartmentsContext wad used outside of SchoolDepartmentsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolDepartmentsContext };
