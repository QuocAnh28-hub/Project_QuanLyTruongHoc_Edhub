import { FormOutlined } from "@ant-design/icons"
import { Button, Flex, Space } from "antd"
import { useMemo, useState } from "react"
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext"
import { SchoolCampus } from "../../../../../../models/ed-only/school-model"
import { SchoolDailyScheduleEnum, SchoolTypeEnum } from "../../../../../../models/enums"
import { ToFormatedDate, ToFormatedNumber, ToFullAddress, ToFullNameByLocale } from "../../../../../../utils/locale-helpers"
import GText from "../../../../../atoms/g-text"
import { PlusOutlined } from "../../../../../atoms/svg/outlined-icons"
import TitleSegmentRow from "../../../../../atoms/title-segment-row"
import SchoolDetailCampusCreate from "./school-detail-campus-create"

export default function SchoolDetailInfoView() {
  const { data, switchUpdateMode } = useSchoolDetailContext()
  const { type_string, level_string, daily_schedule_string } = useMemo(() => {
    let type_string = '', level_string = '', daily_schedule_string = ''
    switch (data?.type) {
      case SchoolTypeEnum.CongLap.enum:
        type_string = SchoolTypeEnum.CongLap.title
        break;
      case SchoolTypeEnum.DanLap.enum:
        type_string = SchoolTypeEnum.DanLap.title
        break;
      case SchoolTypeEnum.TuThuc.enum:
        type_string = SchoolTypeEnum.TuThuc.title
        break;
      default:
        break;
    }
    if (data?.canPreschool) level_string += 'Mầm non,'
    if (data?.canPrimarySchool) level_string += 'Tiểu học,'
    if (data?.canLowerSecondarySchool) level_string += 'THCS,'
    if (data?.canUpperSecondarySchool) level_string += 'THPT,'
    if (level_string.length > -1) level_string = level_string.substring(0, level_string.length - 1);

    switch (Number(data?.dailyScheduleType)) {
      case SchoolDailyScheduleEnum.OnePerDay.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.OnePerDay.title
        break;
      case SchoolDailyScheduleEnum.TwicePerDay.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.TwicePerDay.title
        break;
      case SchoolDailyScheduleEnum.DayBoarding.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.DayBoarding.title
        break;
      case SchoolDailyScheduleEnum.Boarding.enum:
        daily_schedule_string = SchoolDailyScheduleEnum.Boarding.title
        break;
      default:
        break;
    }
    return { type_string, level_string, daily_schedule_string }
  }, [data])
  const [open, setOpen] = useState<boolean>(false)

  if (!data) return
  return <Flex vertical gap={16}>
    <Flex justify='end'>
      <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
    </Flex>
    <Flex vertical gap={32}>
      {/* Thông tin trường & Phân loại */}
      <TitleSegmentRow title='Thông tin trường & Phân loại'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Mã trường'>
            <GText>{data.code}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Tên trường'>
            <GText>{data.name}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Cấp học'>
            <GText>{level_string}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Loại hình'>
            <GText>{type_string}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có yếu tố Quốc tế'>
            <GText>{data.isInternationalSchool ? 'Có' : 'Không'}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Hình thức tổ chức học'>
            <GText>{daily_schedule_string}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày tháng năm thành lập'>
            <GText>{ToFormatedDate(data.dateFounded)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Hạng trường'>
            <GText>{data.ranking}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Dự án'>
            <GText>{data.project}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Vị trí & Liên hệ */}
      <TitleSegmentRow title='Vị trí & Liên hệ'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Phường/Xã'>
            <GText>{data.wardTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Địa chỉ'>
            <GText>{data.address || undefined}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Số điện thoại trường'>
            <GText>{data.hotline}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Email trường'>
            <GText>{data.email}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Fax'>
            <GText>{data.fax}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Website'>
            <GText>{data.website || null}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Vị trí trên bản đồ'>
            <GText></GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Thông tin Quản lý & Lãnh đạo */}
      <TitleSegmentRow title='Thông tin Quản lý & Lãnh đạo'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Tên hiệu trưởng'>
            <GText>{ToFullNameByLocale(data.principalFirstName, data.principalLastName)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Số điện thoại hiệu trưởng'>
            <GText>{data.principalPhone}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Email hiệu trưởng'>
            <GText>{data.principalEmail}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Có chi bộ Đảng'>
            <GText>{data.principalIsPartyMember ? 'Có' : 'Không'}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Điểm trường */}
      <TitleSegmentRow title='Điểm trường'>
        <Flex justify="space-between">
          {!data.schoolCampuses?.length && <GText empty_message="Không có điểm trường"></GText>}
          {data.schoolCampuses?.length ?
            <Flex vertical gap={32}>
              {data.schoolCampuses.map((campus: SchoolCampus, idx: number) => {
                return <Flex vertical gap={16} key={campus.id}>
                  <GText strong>Điểm trường {idx + 1}</GText>
                  <TitleSegmentRow type="secondary" title='Mã điểm trường'>
                    <GText>{campus.code}</GText>
                  </TitleSegmentRow>
                  <TitleSegmentRow type="secondary" title='Tên điểm trường'>
                    <GText>{campus.name}</GText>
                  </TitleSegmentRow>
                  <TitleSegmentRow type="secondary" title='Địa chỉ'>
                    <GText>{ToFullAddress(campus.provinceTitle, campus.wardTitle, campus.address)}</GText>
                  </TitleSegmentRow>
                  <TitleSegmentRow type="secondary" title='Số điện thoại'>
                    <GText>{campus.hotline}</GText>
                  </TitleSegmentRow>
                  <TitleSegmentRow type="secondary" title='Khoảng cách điểm trường chính'>
                    <GText>{ToFormatedNumber(campus.distance)} m</GText>
                  </TitleSegmentRow>
                  <TitleSegmentRow type="secondary" title='Phương tiện có thể đi lại'>
                    <GText>{campus.meansOfTransportation}</GText>
                  </TitleSegmentRow>
                  <TitleSegmentRow type="secondary" title='Diện tích'>
                    <GText>{ToFormatedNumber(campus.totalArea)} m<sup>2</sup></GText>
                  </TitleSegmentRow>
                </Flex>
              })}
            </Flex> : null
          }

          <Button icon={<PlusOutlined />} onClick={() => { setOpen(true) }}>Thêm điểm trường</Button>
          {open && <SchoolDetailCampusCreate close={() => { setOpen(false) }} />}
        </Flex>
      </TitleSegmentRow>

    </Flex>
  </Flex>
}