import { Flex } from "antd"
import StaffDetailContractProvider from "../../../../../contexts/school-only/staffs/detail/StaffDetailContractContext"
import { useStaffDetailContext } from "../../../../../contexts/school-only/staffs/StaffDetailContext"
import StaffDetailContractUpdate from "./contract/staff-detail-contract-update"
import StaffDetailContractView from "./contract/staff-detail-contract-view"

export default function StaffDetailContract() {
  const { update_mode } = useStaffDetailContext()
  return <Flex vertical gap={16}>
    <StaffDetailContractProvider>
      {update_mode ? <StaffDetailContractUpdate /> : <StaffDetailContractView />}
    </StaffDetailContractProvider>
  </Flex>
}