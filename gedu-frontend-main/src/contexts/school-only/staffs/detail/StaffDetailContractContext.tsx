import { ReactNode, createContext, useContext, useState } from "react";
import ForbiddenState from "../../../../components/molecules/forbidden-state";
import { callUpdateStaffContract, useStaffDetailContract } from "../../../../hooks/school-only/staffs-hook";
import { StaffContract } from "../../../../models/staff-model";
import { useLayoutContext } from "../../../SchoolLayoutContext";
import { useStaffDetailContext } from "../StaffDetailContext";

const context = createContext({
  ___testing: true,
  data: null as StaffContract | null,
  fetching: true,
  loading: false,
  error: null,
  updateStaffContract: (_value: any): any => { },
});
interface Props {
  children: ReactNode
}
export default function StaffDetailContractProvider({ children }: Props) {
  const { callMessage } = useLayoutContext()
  const { data: staff } = useStaffDetailContext()
  const [loading, setLoading] = useState<boolean>(false)
  const { data, fetching, error, mutate } = useStaffDetailContract(staff?.id)

  async function updateStaffContract(_value: any) {
    setLoading(true)
    const { data, error } = await callUpdateStaffContract(staff?.id, _value) as any
    let result = false
    if (data) {
      callMessage('Cập nhật thông tin thành công', 'success')
      result = true
      mutate()
    } else {
      if (error?.message) {
        callMessage(error.message, 'error')
      } else {
        callMessage('Có lỗi trong quá trình cập nhật', 'error')
      }
    }
    setLoading(false)
    return result
  }
  return <context.Provider value={{
    ___testing: false,
    data, fetching, error, loading,
    updateStaffContract
  }}>
    {error?.status == 403 && <ForbiddenState />}
    {data && children}
  </context.Provider>
}
const useStaffDetailContractContext = () => {
  const _context = useContext(context)
  if (_context.___testing)
    console.log('Testing mode is on, useStaffDetailContractContext wad used outside of StaffDetailContractProvider');
  return _context
};
// eslint-disable-next-line react-refresh/only-export-components
export { useStaffDetailContractContext };
