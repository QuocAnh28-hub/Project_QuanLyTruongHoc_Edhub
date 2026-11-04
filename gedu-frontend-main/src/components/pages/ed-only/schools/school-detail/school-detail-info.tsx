import { Flex } from "antd"
import { useSchoolDetailContext } from "../../../../../contexts/ed-only/SchoolDetailContext"
import SchoolDetailInfoUpdate from "./info/school-detail-info-update"
import SchoolDetailInfoView from "./info/school-detail-info-view"

export default function SchoolDetailInfo() {
  const { update_mode } = useSchoolDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <SchoolDetailInfoUpdate /> : <SchoolDetailInfoView />}
  </Flex>
}
