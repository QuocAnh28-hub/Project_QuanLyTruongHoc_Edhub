import { createContext, ReactNode, useContext, useMemo, useState } from "react";
import ForbiddenState from "../../../components/molecules/forbidden-state";
import { callImportStaffs } from "../../../hooks/school-only/staffs-hook";
import { useAppContext } from "../../AppContext";

const context = createContext({
  ___testing: true,
  importStaffs: (_value: any) => { },
  loading: false,
  success: undefined as boolean | undefined,
});

export default function StaffImportProvider({ children }: { children: ReactNode }) {
  const { authority } = useAppContext()
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean | undefined>(undefined);

  async function importStaffs(value: any) {
    setLoading(true)
    const res = await callImportStaffs(value)
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
    importStaffs,
    loading, success,
  }), [loading, success]);

  return (
    <context.Provider value={contextValue}>
      {!authority?.can_touch_staff && <ForbiddenState />}
      {authority?.can_touch_staff && children}
    </context.Provider>
  );
}
const useStaffImportContext = () => {
  const _context = useContext(context);
  if (_context.___testing)
    console.log('Testing mode is on, useStaffImportContext wad used outside of StaffImportProvider');
  return _context;
}

// eslint-disable-next-line react-refresh/only-export-components
export { useStaffImportContext };
