import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import { callImportSchools } from "../../hooks/ed-only/schools-hook";

const context = createContext({
  ___testing: true,
  importSchools: (_value: any) => { },
  loading: false,
  success: undefined as boolean | undefined,
});

export default function SchoolImportProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);

  async function importSchools(value: any) {
    setLoading(true)
    const res = await callImportSchools(value)
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
    importSchools,
    loading, success,
  }), [loading, success]);

  return (
    <context.Provider value={contextValue}>
      {children}
    </context.Provider>
  );
}
const useSchoolImportContext = () => {
  const _context = useContext(context);
  if (_context.___testing)
    console.log('Testing mode is on, useSchoolImportContext wad used outside of SchoolImportProvider');
  return _context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useSchoolImportContext };
