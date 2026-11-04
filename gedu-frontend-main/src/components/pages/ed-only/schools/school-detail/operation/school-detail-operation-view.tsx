import { Button, Flex, Space } from "antd"
import { Fragment, useMemo } from "react"
import { useSchoolOperationsContext } from "../../../../../../contexts/ed-only/school-detail/SchoolDetailOperationContext"
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext"
import { schoolNationalStandardStatus, schoolRegion, schoolZone } from "../../../../../../models/ed-only/school-model"
import GText from "../../../../../atoms/g-text"
import GTextYesNo from "../../../../../atoms/g-text-yes-no"
import { FormOutlined } from "../../../../../atoms/svg/outlined-icons"
import TitleSegmentRow from "../../../../../atoms/title-segment-row"

export default function SchoolDetailOperationView() {
  const { switchUpdateMode } = useSchoolDetailContext()
  const { data } = useSchoolOperationsContext()

  const { nationalStandardStatus, region, zone } = useMemo(() => {
    const statusRes = schoolNationalStandardStatus.find((item) => item.value === data?.nationalStandardStatus)
    const regionRes = schoolRegion.find((item) => item.value === data?.region)
    const zoneRes = schoolZone.find((item) => item.value === data?.zone)
    return {
      nationalStandardStatus: statusRes,
      region: regionRes,
      zone: zoneRes,
    }

  }, [data])

  return <Fragment>
    <Flex justify='end'>
      <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
    </Flex>
    <Flex vertical gap={32}>
      {/* Đặc điểm Chất lượng */}
      <TitleSegmentRow title='Đặc điểm Chất lượng'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Là trường Đạt chuẩn Quốc gia'>
            <GText>{data?.nationalStandardStatus ? "Đạt" : "Không"}</GText>
          </TitleSegmentRow>
          {data?.nationalStandardStatus ?
            <TitleSegmentRow type="secondary" title='Cấp độ Đạt chuẩn Quốc gia'>
              <GText>{nationalStandardStatus?.text}</GText>
            </TitleSegmentRow> : null}
          <TitleSegmentRow type="secondary" title='Khu vực'>
            <GText>{region?.text}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Vùng'>
            <GText>{zone?.text}</GText>
          </TitleSegmentRow>

        </Space>
      </TitleSegmentRow>

      {/* Đặc điểm Vận hành */}
      <TitleSegmentRow title='Đặc điểm Vận hành'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Có học sinh khuyết tật'>
            <GTextYesNo>{data?.hasStudentsWithDisabilities}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có học kỹ năng sống'>
            <GTextYesNo>{data?.hasLifeSkillsEducation}</GTextYesNo>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có chương trình giáo dục cơ bản'>
            <GTextYesNo>{data?.hasBasicEducationProgram}</GTextYesNo>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
    </Flex>
  </Fragment>
}
