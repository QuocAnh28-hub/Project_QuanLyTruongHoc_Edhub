import { Col, Form, Input, Row, Typography } from "antd";
import { useEffect, useState } from "react";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useStudentCreateContext } from "../../../../../contexts/school-only/students/StudentNewContext";
import AskYesNo from "../../../../atoms/ask-yes-no";
const { Title, Text } = Typography
const { TextArea } = Input

const StudentNewStep4 = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StudentNewStep4

function Content() {
  const { form_step4 } = useStudentCreateContext()
  const { setBlock } = useRouterBlockerContext()

  const [has_food_allergy, setHasFoodAllergy] = useState(false)
  const [has_drug_allergy, setHasDrugAllergy] = useState(false)
  const [has_chronic_illness, setHasChronicIllness] = useState(false)

  useEffect(() => {
    if (form_step4?.getFieldValue('food_allergies'))
      setHasFoodAllergy(true)
    if (form_step4?.getFieldValue('drug_allergies'))
      setHasDrugAllergy(true)
    if (form_step4?.getFieldValue('chronic_illnesses'))
      setHasChronicIllness(true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0' }}>Thông tin Sức khoẻ</Title></Row>
    <Form layout="vertical" form={form_step4}
      onValuesChange={(_value) => setBlock(true)}
    >
      {/* Dị ứng */}
      <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
        <Col xs={{ span: 24 }} xxl={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Dị ứng</Title>
        </Col>
        <Col xs={{ span: 24 }} xxl={{ flex: 'auto' }}>
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ marginBottom: 16 }}><Text strong>Dị ứng Thực phẩm</Text></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ marginBottom: 12 }}>
              <AskYesNo value={has_food_allergy}
                text="Học sinh có bị dị ứng với loại thực phẩm nào không?"
                onChange={(_v: boolean) => {
                  if (!_v) form_step4?.setFieldValue('food_allergies', undefined)
                  setHasFoodAllergy(_v)
                }} />
            </Col>
            {has_food_allergy ?
              <Col xs={{ span: 24 }}>
                <Form.Item name="food_allergies" rules={[{ required: true, whitespace: true }]}>
                  <TextArea rows={2} placeholder="Mô tả chi tiết" />
                </Form.Item>
              </Col> : null}
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ marginBottom: 16 }}><Text strong>Dị ứng Thuốc</Text></Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col span={24} style={{ marginBottom: 12 }}>
              <AskYesNo value={has_drug_allergy}
                text="Học sinh có bị dị ứng với loại thuốc nào không?"
                onChange={(_v: boolean) => {
                  if (!_v) form_step4?.setFieldValue('drug_allergies', undefined)
                  setHasDrugAllergy(_v)
                }} />
            </Col>
            {has_drug_allergy ?
              <Col xs={{ span: 24 }}>
                <Form.Item name="drug_allergies" rules={[{ required: true, whitespace: true }]}>
                  <TextArea rows={2} placeholder="Mô tả chi tiết" />
                </Form.Item>
              </Col> : null}
          </Row>
        </Col>
      </Row>

      {/* Bệnh mãn tính/Bệnh nền */}
      <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
        <Col xs={{ span: 24 }} xxl={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Bệnh mãn tính/Bệnh nền</Title>
        </Col>
        <Col xs={{ span: 24 }} xxl={{ flex: 'auto' }}>
          <Row gutter={16}>
            <Col span={24} style={{ marginBottom: 12 }}>
              <AskYesNo value={has_chronic_illness}
                text="Học sinh có bị mắc bệnh mãn tính/bệnh nền nào không?"
                onChange={(_v: boolean) => {
                  if (!_v) form_step4?.setFieldValue('chronic_illnesses', undefined)
                  setHasChronicIllness(_v)
                }} />
            </Col>
            {has_chronic_illness ?
              <Col xs={{ span: 24 }}>
                <Form.Item name="chronic_illnesses" rules={[{ required: true, whitespace: true }]}>
                  <TextArea rows={2} placeholder="Mô tả chi tiết" />
                </Form.Item>
              </Col> : null}
          </Row>
        </Col>
      </Row>

      {/* Ghi chú thêm */}
      <Row gutter={[16, 16]} style={{ padding: '16px 0' }}>
        <Col xs={{ span: 24 }} xxl={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Ghi chú thêm (Đặc điểm hoặc thói quen đặc biệt cần lưu ý)</Title>
        </Col>
        <Col xs={{ span: 24 }} xxl={{ flex: 'auto' }}>
          <Row gutter={16}>
            <Col xs={{ span: 24 }}>
              <Form.Item name="special_cases">
                <TextArea rows={2} placeholder="Ghi chú từ phụ huynh" />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  </Col>
}