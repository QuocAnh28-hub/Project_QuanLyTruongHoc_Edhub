import { Flex } from "antd"
import StaffDetailFoldersProvider from "../../../../../contexts/school-only/staffs/detail/StaffDetailFoldersContext"
import StaffDetailFoldersView from "./folders/staff-detail-folders-view"

export default function StaffDetailFolders() {
  return <Flex vertical gap={16}>
    <StaffDetailFoldersProvider>
      <StaffDetailFoldersView />
    </StaffDetailFoldersProvider>
  </Flex>
}