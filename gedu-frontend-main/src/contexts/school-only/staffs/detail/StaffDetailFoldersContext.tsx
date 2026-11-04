import { ReactNode, createContext, useContext } from "react";
import ForbiddenState from "../../../../components/molecules/forbidden-state";
import { useStaffDetailFolders } from "../../../../hooks/school-only/staffs-hook";
import { StaffFolder } from "../../../../models/staff-model";
import { useStaffDetailContext } from "../StaffDetailContext";

const context = createContext({
  ___testing: true,
  data: null as StaffFolder | null,
  fetching: true,
  error: null,
});
interface Props {
  children: ReactNode
}
export default function StaffDetailFoldersProvider({ children }: Props) {
  const { data: staff } = useStaffDetailContext()
  const { data, fetching, error } = useStaffDetailFolders(staff?.id)

  return <context.Provider value={{
    ___testing: false,
    data, fetching, error,
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useStaffDetailFoldersContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStaffDetailFoldersContext wad used outside of StaffDetailFoldersProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStaffDetailFoldersContext };
