import { Col, Form, Input, Row, Select, Typography } from "antd";
import { useState } from "react";
import { useSchoolCreateContext } from "../../../../../contexts/ed-only/SchoolNewContext";
import { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useMetaSchoolDepartments, useMetaSchoolPositions } from "../../../../../hooks/school-only/shared-data-hook";
import { useAppContext } from "../../../../../contexts/AppContext";
const { Title } = Typography

export default function SchoolNewStep3() {
  const { form_step3 } = useSchoolCreateContext()
  const { setBlock } = useRouterBlockerContext()
  const { account } = useAppContext()
  const [dept_id, setDeptId] = useState(null)
  const { data: dept, fetching: dept_load } = useMetaSchoolDepartments(account?.additional.template_id)
  const { data: pos, fetching: pos_load } = useMetaSchoolPositions(dept_id, account?.additional.template_id)
  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0' }}>Tài khoản Quản trị</Title></Row>
    <Form layout="vertical" form={form_step3}
      onValuesChange={(_value) => setBlock(true)}>
      {/* Quản trị Viên trường */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} lg={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Quản trị Viên trường</Title>
        </Col>
        <Col xs={{ flex: '100%' }} lg={{ flex: 'auto' }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={{ flex: 24 }} md={{ flex: '50%' }}>
              <Form.Item label="Email của Quản trị viên"
                name="email" rules={[{ required: true, whitespace: true }]}>
                <Input placeholder="admin@gedu.vn" />
              </Form.Item>
            </Col>
            <Col xs={{ flex: 24 }} md={{ flex: '50%' }}>
              <Form.Item label="Số điện thoại của Quản trị viên" name="phone">
                <Input placeholder="932000123" addonBefore='+84' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={{ flex: 24 }}>
              <Form.Item label="Họ và tên"
                name="fullName" rules={[{ required: true, whitespace: true }]}>
                <Input placeholder="Trương Thiên Ái" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={{ flex: 24 }} md={{ flex: 12 }}>
              <Form.Item label="Phòng ban" name='departmentId'>
                <Select showSearch options={dept} loading={dept_load}
                  fieldNames={{ value: 'id', label: 'name' }}
                  optionFilterProp='name'
                  onChange={(_value) => {
                    setDeptId(_value)
                    form_step3?.setFieldValue('positionId', undefined)
                  }} />
              </Form.Item>
            </Col>
            <Col xs={{ flex: 24 }} md={{ flex: 12 }}>
              <Form.Item label="Chức vụ tại trường" name='positionId'>
                <Select showSearch options={pos} loading={pos_load}
                  fieldNames={{ value: 'id', label: 'title' }}
                  optionFilterProp='title' />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  </Col>
}