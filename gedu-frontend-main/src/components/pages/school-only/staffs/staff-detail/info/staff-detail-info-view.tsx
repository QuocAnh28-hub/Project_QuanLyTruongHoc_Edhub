import { Button, Divider, Flex, Row, Space } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useStaffDetailContext } from "../../../../../../contexts/school-only/staffs/StaffDetailContext";
import { getGenderEnum } from "../../../../../../models/enums";
import { ToFormatedDate, ToFullAddress, ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import CopyButton from "../../../../../atoms/copy-button";
import GText from "../../../../../atoms/g-text";
import { FormOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

export default function StaffDetailInfoView() {
  const { authority } = useAppContext()
  const { data, switchUpdateMode } = useStaffDetailContext()
  if (!data) return null
  return <Fragment>
    {authority?.can_touch_staff &&
      <Row justify='end'>
        <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
      </Row>
    }
    <Flex vertical gap={32}>
      {/* Thông tin chung */}
      <TitleSegmentRow title='Thông tin chung'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Họ tên'>
            <GText>{ToFullNameByLocale(data.firstName, data.lastName)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày sinh'>
            <GText>{ToFormatedDate(data.dateOfBirth)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Nơi sinh'>
            <GText>{data?.placeOfBirth}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Giới tính'>
            <GText>{getGenderEnum(data?.sex)?.title ?? null}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Số CCCD'>
            <Flex gap={8} align="center">
              <GText>{data.citizenId}</GText>
              {data.citizenId && <CopyButton text={data.citizenId} />}
            </Flex>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày cấp'>
            <GText>{ToFormatedDate(data.dateOfIssue)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Nơi cấp'>
            <GText>{data.placeOfIssue}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Quốc tịch'>
            <GText>{data.nationalityTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Tôn giáo'>
            <GText>{data.religionTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Đối tượng chính sách'>
            <GText>{data.ethnicityTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Tình trạng hôn nhân'>
            <GText>{data.ethnicityTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Số CMND cũ'>
            <GText>{data.ethnicityTitle}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      <Divider />
      {/* Thông tin Liên hệ */}
      <TitleSegmentRow title='Thông tin Cư trú & Liên hệ'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Nơi thường trú'>
            <GText>{ToFullAddress(data.permanentResidenceProvinceTitle, data.permanentResidenceWardTitle, data.permanentResidenceAddress)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Nơi tạm trú'>
            <GText>{ToFullAddress(data.temporaryResidenceProvinceTitle, data.temporaryResidenceWardTitle, data.temporaryResidenceAddress)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Email'>
            <GText>{data.email}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Số điện thoại'>
            <GText>{data.phone}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Số điện thoại Người thân 1'>
            <GText>{data.contactPhone1}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Số điện thoại Người thân 2'>
            <GText>{data.contactPhone2}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      <Divider />
      <TitleSegmentRow title='Thông tin Đoàn thể & khác'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Ngày vào Đoàn'>
            <GText>{ToFormatedDate(data.pioneersUnionsParty?.youngPioneerAdmissionDate)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày vào Đảng'>
            <GText>{ToFormatedDate(data.pioneersUnionsParty?.youthUnionAdmissionDate)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày nhập ngũ'>
            <GText>{ToFormatedDate(data.pioneersUnionsParty?.startMilitaryServiceDate)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày xuất ngũ'>
            <GText>{ToFormatedDate(data.pioneersUnionsParty?.endMilitaryServiceDate)}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
    </Flex>

  </Fragment>
}