import { Flex } from "antd"
import SchoolDetailAdminView from "./admin/school-detail-admin-view"

export default function SchoolDetailAdmin() {
  return <Flex vertical gap={16}>
    <SchoolDetailAdminView />
  </Flex>
}
