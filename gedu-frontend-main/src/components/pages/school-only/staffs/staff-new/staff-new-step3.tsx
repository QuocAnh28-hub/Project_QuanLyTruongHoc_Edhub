import { Alert, Col, Flex, Input, Row, Typography } from "antd";
import { useStaffCreateContext } from "../../../../../contexts/school-only/staffs/StaffNewContext";
import TitleSegmentRow from "../../../../atoms/title-segment-row";
const { Title, Text } = Typography
export default function StaffNewStep3() {
  const { staff } = useStaffCreateContext()
  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0 32px' }}>Tài khoản Hệ thống & Phân quyền</Title></Row>
    {/* Tài khoản Gedu */}
    <Flex vertical gap={32}>
      <TitleSegmentRow title='Tài khoản Gedu'>
        <Row gutter={16}>
          <Col span={24}>
            <Input readOnly style={{ maxWidth: 603 }} value={staff.email} />
          </Col>
        </Row>
      </TitleSegmentRow>

      {/* Quản trị Viên trường */}
      <TitleSegmentRow title='Quản trị Viên trường'>
        <Row gutter={16} style={{ width: '100%' }}>
          <Col>
            <Text>Giáo viên/ Cán bộ có quyền trên các nhóm tính năng sau:</Text>
            <ul style={{ margin: 0, paddingLeft: 24 }}>
              {staff.schoolStaffPositions?.map((pos, index) => <li key={index}>{pos.title}</li>)}
            </ul>
          </Col>
        </Row>
        <Row gutter={16} style={{ width: '100%', marginTop: 16 }}>
          <Col>
            <Alert
              style={{ maxWidth: 603 }}
              message={<span>Bạn có thể tuỳ chỉnh Phân quyền của Giáo viên /Cán bộ này tại Cài đặt Hệ thống hoặc Hồ sơ Chi tiết.</span>}
              type="info" />
          </Col>
        </Row>
      </TitleSegmentRow>
    </Flex>
  </Col>
}