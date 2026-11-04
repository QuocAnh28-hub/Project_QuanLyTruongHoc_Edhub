import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callImportStudents } from "../../../hooks/school-only/students-hook";
import { useAppContext } from "../../AppContext";

const context = createContext({
  ___testing: true,
  importStudents: (_value: any) => { },
  loading: false,
  success: undefined as boolean | undefined,
});

export default function StudentImportProvider({ children }: { children: ReactNode }) {
  const { authority } = useAppContext()
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);

  async function importStudents(value: any) {
    setLoading(true)
    const res = await callImportStudents(value)
    let result = false
    if (!res?.error) {
      setSuccess(true)
      result = true
    }
    else
      setSuccess(false)

    setLoading(false)
    return result
  }
  const contextValue = useMemo(() => ({
    ___testing: false,
    importStudents,
    loading, success,
  }), [loading, success]);

  return (
    <context.Provider value={contextValue}>
      {!authority?.can_touch_student && <ForbiddenState />}
      {authority?.can_touch_student && children}
    </context.Provider>
  );
}
const useStudentImportContext = () => {
  const _context = useContext(context);
  if (_context.___testing)
    console.log('Testing mode is on, useStudentImportContext wad used outside of StudentImportProvider');
  return _context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useStudentImportContext };
