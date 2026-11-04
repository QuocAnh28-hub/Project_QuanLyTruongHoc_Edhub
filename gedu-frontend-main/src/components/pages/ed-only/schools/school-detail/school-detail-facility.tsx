import { Flex } from "antd"
import SchoolDetailFacilityProvider from "../../../../../contexts/ed-only/school-detail/SchoolDetailFacilitiesContext"
import { useSchoolDetailContext } from "../../../../../contexts/ed-only/SchoolDetailContext"
import SchoolDetailFacilityUpdate from "./facility/school-detail-facility-update"
import SchoolDetailFacilityView from "./facility/school-detail-facility-view"

export default function SchoolDetailFacility() {
  const { update_mode } = useSchoolDetailContext()
  return <Flex vertical gap={16}>
    <SchoolDetailFacilityProvider>
      {update_mode ? <SchoolDetailFacilityUpdate /> : <SchoolDetailFacilityView />}
    </SchoolDetailFacilityProvider>
  </Flex>
}
