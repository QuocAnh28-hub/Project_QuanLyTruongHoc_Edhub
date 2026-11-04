import { Button, Flex, Row, Space } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useStudentDetailContext } from "../../../../../../contexts/school-only/students/StudentDetailContext";
import { studentAdmissionType, studentGradeStatus } from "../../../../../../models/student-model";
import { ToFormatedDate } from "../../../../../../utils/locale-helpers";
import GText from "../../../../../atoms/g-text";
import NoDataText from "../../../../../atoms/no-data-text";
import StudentStatusTag from "../../../../../atoms/student-status";
import { FormOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

export default function StudentDetailSpecialPoliciesView() {
  const { authority } = useAppContext()
  const { data, switchUpdateMode } = useStudentDetailContext()
  if (!data) return null
  return <Fragment>
    {authority?.can_touch_student &&
      <Row justify='end'>
        <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
      </Row>
    }
    <Flex vertical gap={32}>
      {/* Thông tin Nhập học */}
      <TitleSegmentRow title='Thông tin Nhập học'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Ngày nhập học'>
            <GText>{ToFormatedDate(data.admissionDate)}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Năm học nhập học'>
            <GText>{data.admissionSchoolYearTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Hình thức nhập học'>
            <GText>{studentAdmissionType.find(t => t.value == data.admissionType)?.text}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      {/* Thông tin Lớp học */}
      <TitleSegmentRow title='Thông tin Lớp học'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Trạng thái'>
            <GText><StudentStatusTag status={data.status} /></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Khối'>
            <GText>{data.gradeLevel ? studentGradeStatus.find(s => s.value == data.gradeLevel)?.text : ''}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Lớp'>
            <GText>{data.class?.name}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Chương trình học'>
            <GText></GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      {/* Chế độ & Chính sách */}
      <TitleSegmentRow title='Chế độ & Chính sách'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Diện ưu tiên'>
            {data.priorityPolicyTitle ?
              <GText>{data.priorityPolicyTitle}</GText> :
              <NoDataText>Không</NoDataText>
            }
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Diện khuyết tật'>
            {data.specialNeedsPolicyTitle ?
              <GText>{data.specialNeedsPolicyTitle}</GText> :
              <NoDataText>Không</NoDataText>
            }
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
    </Flex>
  </Fragment>
}