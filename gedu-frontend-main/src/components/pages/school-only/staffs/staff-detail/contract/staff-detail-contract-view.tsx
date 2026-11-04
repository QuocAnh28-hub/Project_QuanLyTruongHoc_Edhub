import { Button, Flex, Row, Space } from "antd";
import { Fragment } from "react/jsx-runtime";
import { useStaffDetailContext } from "../../../../../../contexts/school-only/staffs/StaffDetailContext";
import GText from "../../../../../atoms/g-text";
import SchoolStaffStatusTag from "../../../../../atoms/school-staff-status";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";
import { FormOutlined } from "../../../../../atoms/svg/outlined-icons";

export default function StaffDetailMajorView() {
  const { data, switchUpdateMode } = useStaffDetailContext()
  if (!data) return null
  return <Fragment>
    <Row justify='end'>
      <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
    </Row>
    <Flex vertical gap={32}>
      {/* Thông tin Công tác tại trường */}
      <TitleSegmentRow title='Thông tin Công tác tại trường'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Trạng thái công tác'>
            <SchoolStaffStatusTag status={data.status} />
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Chức danh'>
            <GText>{data.positionTitle}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Kiêm nhiệm'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Loại cán bộ'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày tuyển dụng (viên chức)'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Cơ quan tuyển dụng'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Nghề nghiệp khi được tuyển dụng'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày bắt đầu làm việc tại trường'>
            <GText></GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Thông tin Hợp đồng */}
      <TitleSegmentRow title='Thông tin Hợp đồng'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Loại hợp đồng'>
            <GText>{ }</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày ký'>
            <GText>{data.professionalQualification}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày hết hạn'>
            <GText>{data.foreignLanguageQualification}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Thông tin Lương & Phụ cấp */}
      <TitleSegmentRow title='Thông tin Lương & Phụ cấp'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Mã ngạch'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Bậc lương'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Hệ số lương'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Phần trăm vượt khung'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Phụ cấp ưu đãi nghề'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Phụ cấp thu hút nghề'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Phụ cấp thâm niên'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Hệ số phụ cấp chức vụ lãnh đạo'>
            <GText></GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Thông tin Bảo hiểm & Tài chính */}
      <TitleSegmentRow title='Thông tin Bảo hiểm & Tài chính'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Số sổ BHXH'>
            <GText>{data.socialInsuranceCode}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Mã số thuế cá nhân'>
            <GText>{data.pitCode}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Thông tin tài khoản ngân hàng'>
            <GText>
              {data.bankAccountNumber && data.bankAccountHolderName && data.bankBranch
                ? `${data.bankAccountNumber} - ${data.bankAccountHolderName || ''} - ${data.bankBranch || ''}`
                : null}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Ngày nhận lương'>
            <GText></GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
    </Flex>
  </Fragment>
}