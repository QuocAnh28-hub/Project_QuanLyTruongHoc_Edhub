import { Button, Flex, Row, Space } from "antd";
import { Fragment, useMemo } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useStudentDetailContext } from "../../../../../../contexts/school-only/students/StudentDetailContext";
import GText from "../../../../../atoms/g-text";
import NoDataText from "../../../../../atoms/no-data-text";
import { FormOutlined, WarningOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

export default function StudentDetailMedicalInfoView() {
  const { authority } = useAppContext()
  const { data, switchUpdateMode } = useStudentDetailContext()
  const { food_allery, drug_allery, chronic_illness, special_cases } = useMemo(() => {
    const food_allery = data?.studentMedicalInfo?.find(i => i.group == 2 && i.type == 2)?.info
    const drug_allery = data?.studentMedicalInfo?.find(i => i.group == 2 && i.type == 3)?.info
    const chronic_illness = data?.studentMedicalInfo?.find(i => i.group == 3 && i.type == 4)?.info
    const special_cases = data?.studentMedicalInfo?.find(i => i.group == 1 && i.type == 1)?.info
    return { food_allery, drug_allery, chronic_illness, special_cases }
  }, [data?.studentMedicalInfo])
  if (!data) return null
  return <Fragment>
    {authority?.can_touch_student &&
      <Row justify='end'>
        <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
      </Row>
    }
    <Flex vertical gap={32}>
      {/* Dị ứng */}
      <TitleSegmentRow title='Dị ứng'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Dị ứng Thực phẩm'>
            {food_allery ? <Flex gap={16} align="center">
              <WarningOutlined size={24} fill='var(--warning)' />
              <GText>{food_allery}</GText>
            </Flex> : <NoDataText />}
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Dị ứng Thuốc'>
            {drug_allery ? <Flex gap={16} align="center">
              <WarningOutlined size={24} fill='var(--warning)' />
              <GText>{drug_allery}</GText>
            </Flex> : <NoDataText />}
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      <TitleSegmentRow title='Bệnh mãn tính/Bệnh nền'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Bệnh mãn tính/bệnh nền'>
            {chronic_illness ? <Flex gap={16} align="center">
              <WarningOutlined size={24} fill='var(--warning)' />
              <GText>{chronic_illness}</GText>
            </Flex> : <NoDataText />}
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      <TitleSegmentRow title='Ghi chú thêm'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Đặc điểm hoặc thói quen đặc biệt cần lưu ý'>
            {special_cases ? <GText>{special_cases}</GText> : <NoDataText />}
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
    </Flex>
  </Fragment>
}