import { ReactNode, createContext, useContext } from "react";
import { useCountEduDepartments, useEduDepartments } from "../../../hooks/ed-only/edu-departments-hook";
import { EduDepartmentRow, EduDepartmentRowCount } from "../../../models/ed-only/edu-department-model";

const context = createContext({
  ___testing: true,
  data: null as EduDepartmentRow[] | null,
  counted_data: null as EduDepartmentRowCount[] | null,
  fetching: true,
  counting: true,
});
interface Props {
  children: ReactNode
}
export default function EduDepartmentsProvider({ children }: Props) {
  const { data, fetching } = useEduDepartments()
  const { data: counted_data, fetching: counting } = useCountEduDepartments()

  return <context.Provider value={{
    ___testing: false,
    data, fetching,
    counted_data,
    counting
  }}>
    {children}
  </context.Provider>
}
const useEduDepartmentsContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useEduDepartmentsContext wad used outside of EduDepartmentsProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useEduDepartmentsContext };
