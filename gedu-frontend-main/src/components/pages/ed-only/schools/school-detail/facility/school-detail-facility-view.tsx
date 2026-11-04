import { Button, Flex, Space } from "antd"
import { Fragment } from "react"
import { useSchoolFacilitiesContext } from "../../../../../../contexts/ed-only/school-detail/SchoolDetailFacilitiesContext"
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext"
import GText from "../../../../../atoms/g-text"
import { FormOutlined } from "../../../../../atoms/svg/outlined-icons"
import TitleSegmentRow from "../../../../../atoms/title-segment-row"
import GTextYesNo from "../../../../../atoms/g-text-yes-no"
import { ToFormatedNumber } from "../../../../../../utils/locale-helpers"

export default function SchoolDetailFacilityView() {
  const { data } = useSchoolFacilitiesContext()
  const { switchUpdateMode } = useSchoolDetailContext()

  if (!data) return
  return <Fragment>
    <Flex justify='end'>
      <Button icon={<FormOutlined />} onClick={() => {
        switchUpdateMode(true)
      }}>Cập nhật</Button>
    </Flex>
    <Flex vertical gap={32}>
      {/* Thông tin Cơ sở vật chất */}
      <TitleSegmentRow title='Thông tin Cơ sở vật chất'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Diện tích'>
            <GText>{ToFormatedNumber(data.totalArea)} m<sup>2</sup></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Đủ thiết bị dạy học tối thiểu'>
            <GTextYesNo>{data?.hasMinimumTeachingEquipment}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có sử dụng máy vi tính'>
            <GTextYesNo>{data?.hasComputers}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Được kết nối Internet'>
            <GTextYesNo>{data?.hasInternetAccess}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có điện lưới'>
            <GTextYesNo>{data?.hasPowerGrid}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có nguồn nước sạch'>
            <GTextYesNo>{data?.hasCleanWaterSource}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có công trình vệ sinh'>
            <GTextYesNo>{data?.hasRestrooms}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có chương trình giáo dục vệ sinh đôi tay'>
            <GTextYesNo>{data?.hasCleanHygieneEducationProgram}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có hạ tầng tiếp cận học sinh khuyết tật'>
            <GTextYesNo>{data?.hasAccessibleInfraStudentsWithDisabilities}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có bộ phận công tác tư vấn học đường'>
            <GTextYesNo>{data?.hasStudentServiceUnit}</GTextYesNo>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
    </Flex>
  </Fragment>
}
