import { Button, Flex, Row, Space } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useStudentDetailContext } from "../../../../../../contexts/school-only/students/StudentDetailContext";
import { getGenderEnum } from "../../../../../../models/enums";
import { StudentContact } from "../../../../../../models/student-model";
import { ToFormatedDate, ToFullAddress, ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import CopyButton from "../../../../../atoms/copy-button";
import GText from "../../../../../atoms/g-text";
import NoDataText from "../../../../../atoms/no-data-text";
import { FormOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";
import StudentContactCard from "../student-contact-card";
import StudentContactCardNew from "../student-contact-card-new";

export default function StudentDetailInfoView() {
  const { authority } = useAppContext()
  const { data, switchUpdateMode } = useStudentDetailContext()
  if (!data) return null
  return <Fragment>
    {authority?.can_touch_student && <Row justify='end'>
      <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
    </Row>}
    <Flex vertical gap={32}>
      {/* Thông tin chung */}
      <TitleSegmentRow title='Thông tin chung'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Mã học sinh'>
            <Flex gap={16} align="center">
              <GText>{data.code || data.id}</GText>
              <CopyButton text={data.code || data.id + ''} />
            </Flex>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Mã định danh/Số CCCD'>
            <GText>
              {data.citizenId}
              {data.dateOfIssue ? ' cấp ngày ' + ToFormatedDate(data.dateOfIssue) : ''}
              {data.placeOfIssue ? ' tại ' + data.placeOfIssue : ''}
            </GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Họ tên'>
            <GText>{ToFullNameByLocale(data.firstName, data.lastName)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày sinh'>
            <GText>{ToFormatedDate(data.dateOfBirth)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Giới tính'>
            <GText>{getGenderEnum(data.sex)?.title}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Quốc tịch'>
            <GText>{data.nationalityTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Tôn giáo'>
            <GText>{data.religionTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Nơi thường trú'>
            <GText>{ToFullAddress(data.permanentResidenceProvinceTitle, data.permanentResidenceWardTitle, data.permanentResidenceAddress)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Nơi tạm trú'>
            <GText>{ToFullAddress(data.temporaryResidenceProvinceTitle, data.temporaryResidenceWardTitle, data.temporaryResidenceAddress)}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      {/* Thông tin Liên hệ */}
      <TitleSegmentRow title='Thông tin Liên hệ'>
        <Space direction="vertical" style={{ display: 'flex' }} size={16}>
          {!data.studentContacts?.length && <NoDataText>Chưa có thông tin người giám hộ</NoDataText>}
          {data.studentContacts?.map((contact: StudentContact) => {
            return <StudentContactCard
              main_contact_id={data.mainContactId}
              contact={contact}
            />
          })}
          {authority?.can_touch_student && <StudentContactCardNew />}
        </Space>
      </TitleSegmentRow>
    </Flex>

  </Fragment >
}