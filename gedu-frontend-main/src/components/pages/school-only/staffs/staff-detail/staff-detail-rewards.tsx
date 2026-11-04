import { Flex } from "antd"
import StaffDetailRewardsView from "./rewards/staff-detail-rewards-view"

export default function StaffDetailRewards() {
  return <Flex vertical gap={16}>
    <StaffDetailRewardsView />
  </Flex>
}