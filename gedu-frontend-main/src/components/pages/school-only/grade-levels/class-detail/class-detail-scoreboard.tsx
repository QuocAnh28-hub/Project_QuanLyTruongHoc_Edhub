import { Flex } from "antd"
import { useClassDetailContext } from "../../../../../contexts/school-only/classes/ClassDetailContext"
import ClassDetailScoreboardUpdate from "./scoreboard/class-detail-scoreboard-update"
import ClassDetailScoreboardView from "./scoreboard/class-detail-scoreboard-view"

export default function ClassDetailScoreboard() {
  const { update_mode } = useClassDetailContext()
  return <Flex vertical gap={16}>
    {update_mode ? <ClassDetailScoreboardUpdate /> : <ClassDetailScoreboardView />}
  </Flex>
}