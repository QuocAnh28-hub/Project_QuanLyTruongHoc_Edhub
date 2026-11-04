import { Flex } from "antd"
import StaffDetailMajorProvider from "../../../../../contexts/school-only/staffs/detail/StaffDetailMajorContext"
import { useStaffDetailContext } from "../../../../../contexts/school-only/staffs/StaffDetailContext"
import StaffDetailMajorUpdate from "./major/staff-detail-major-update"
import StaffDetailMajorView from "./major/staff-detail-major-view"

export default function StaffDetailMajor() {
  const { update_mode } = useStaffDetailContext()
  return <Flex vertical gap={16}>
    <StaffDetailMajorProvider>
      {update_mode ? <StaffDetailMajorUpdate /> : <StaffDetailMajorView />}
    </StaffDetailMajorProvider>
  </Flex>
}