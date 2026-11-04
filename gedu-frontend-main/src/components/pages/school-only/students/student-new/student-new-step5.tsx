import { Alert, Card, Col, Radio, Row, Typography } from "antd";
import { useStudentCreateContext } from "../../../../../contexts/school-only/students/StudentNewContext";
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers";
const { Title, Text } = Typography
export default function StudentNewStep5() {
  const { studentContacts, grant_access_id, setGrantAccessId } = useStudentCreateContext()

  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row>
      <Title level={4} style={{ margin: '16px 0' }}>Tài khoản Hệ thống & Phân quyền</Title>
      <Alert description={
        <Text>
          Số điện thoại Người giám hộ sẽ được dùng làm <strong>tài khoản đăng nhập vào Gedu Mobile App</strong> để theo dõi thời khoá biểu, điểm số và các thông tin khác.
        </Text>
      } type='info' showIcon />
    </Row>
    <div>
      {/* Tài khoản hệ thống */}
      {studentContacts?.length ?
        <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
          <Col xs={{ span: 24 }} xl={{ flex: '0 0 210px' }}>
            <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Tài khoản hệ thống</Title>
          </Col>
          <Col xs={{ span: 24 }} xl={{ flex: 'auto' }}>
            <Row gutter={[16, 16]}>
              {studentContacts.map((contact: any) => {
                const _sl = grant_access_id == contact.id ? { borderColor: 'var(--primary)' } : undefined
                return <Col key={contact.id} xs={24} xl={8}>
                  <Card style={{ ..._sl, cursor: 'pointer', height: '100%' }}
                    onClick={() => { setGrantAccessId(contact.id) }}>
                    <Row gutter={8} wrap={false} style={{ alignItems: 'flex-start' }}>
                      <Radio checked={grant_access_id == contact.id} />
                      <Col>
                        <Row>{ToFullNameByLocale(contact.firstName, contact.lastName)}</Row>
                        <Row>{contact.phone}</Row>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              })}
            </Row>
          </Col>
        </Row> : null
      }
      {/* Phân quyền */}
      <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
        <Col xs={{ span: 24 }} xl={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Phân quyền</Title>
        </Col>
        <Col xs={{ span: 24 }} xl={{ flex: 'auto' }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col>
              <Text>Phụ huynh có quyền trên các nhóm tính năng sau:</Text>
              <ul style={{ margin: 0, paddingLeft: 24 }}>
                <li>Thời khoá biểu</li>
                <li>Kì thi & Chứng chỉ</li>
                <li>Y tế Học đường</li>
                <li>Dinh dưỡng</li>
                <li>Thông báo từ Giáo viên & Nhà trường</li>
              </ul>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  </Col>
}