import { Flex } from "antd"
import { useSchoolDetailContext } from "../../../../../contexts/ed-only/SchoolDetailContext"
import SchoolDetailOperationUpdate from "./operation/school-detail-operation-update"
import SchoolDetailOperationView from "./operation/school-detail-operation-view"
import SchoolDetailOperationProvider from "../../../../../contexts/ed-only/school-detail/SchoolDetailOperationContext"

export default function SchoolDetailOperation() {
  const { update_mode } = useSchoolDetailContext()
  return <Flex vertical gap={16}>
    <SchoolDetailOperationProvider>
      {update_mode ? <SchoolDetailOperationUpdate /> : <SchoolDetailOperationView />}
    </SchoolDetailOperationProvider>
  </Flex>
}
