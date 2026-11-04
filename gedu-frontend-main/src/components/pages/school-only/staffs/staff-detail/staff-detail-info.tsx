import { Flex } from "antd"
import { useStaffDetailContext } from "../../../../../contexts/school-only/staffs/StaffDetailContext"
import StaffDetailInfoUpdate from "./info/staff-detail-info-update"
import StaffDetailInfoView from "./info/staff-detail-info-view"

export default function StaffDetailInfo() {
  const { update_mode } = useStaffDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <StaffDetailInfoUpdate /> : <StaffDetailInfoView />}
  </Flex>
}