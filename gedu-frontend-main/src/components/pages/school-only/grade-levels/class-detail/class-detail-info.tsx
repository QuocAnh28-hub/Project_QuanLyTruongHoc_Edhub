import { Flex } from "antd"
import { useClassDetailContext } from "../../../../../contexts/school-only/classes/ClassDetailContext"
import ClassDetailInfoUpdate from "./info/class-detail-info-update"
import ClassDetailInfoView from "./info/class-detail-info-view"

export default function ClassDetailInfo() {
  const { update_mode } = useClassDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <ClassDetailInfoUpdate /> : <ClassDetailInfoView />}
  </Flex>
}