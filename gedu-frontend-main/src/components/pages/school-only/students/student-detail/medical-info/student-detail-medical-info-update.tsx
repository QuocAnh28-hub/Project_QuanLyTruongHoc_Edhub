import { Button, Col, Flex, Form, Input, Row, Typography } from "antd";
import { Fragment, useEffect, useMemo, useState } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import { useStudentDetailContext } from "../../../../../../contexts/school-only/students/StudentDetailContext";
import { useLayoutContext } from "../../../../../../contexts/SchoolLayoutContext";
import AskYesNo from "../../../../../atoms/ask-yes-no";
import { CheckOutlined, CloseOutlined } from "../../../../../atoms/svg/outlined-icons";
import ForbiddenState from "../../../../../molecules/forbidden-state";

const { Title, Text } = Typography
const { TextArea } = Input

const StudentDetailMedicalInfoUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StudentDetailMedicalInfoUpdate

function Content() {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const [form] = Form.useForm()
  const { setBlock } = useRouterBlockerContext()
  const { data, switchUpdateMode, updateStudentMedicalInfo, loading } = useStudentDetailContext()
  const [has_food_allergy, setHasFoodAllergy] = useState(false)
  const [has_drug_allergy, setHasDrugAllergy] = useState(false)
  const [has_chronic_illness, setHasChronicIllness] = useState(false)
  const data_fields = useMemo(() => {
    const food_allergies = data?.studentMedicalInfo?.find(i => i.group == 2 && i.type == 2)?.info || null
    const drug_allergies = data?.studentMedicalInfo?.find(i => i.group == 2 && i.type == 3)?.info || null
    const chronic_illnesses = data?.studentMedicalInfo?.find(i => i.group == 3 && i.type == 4)?.info || null
    const special_cases = data?.studentMedicalInfo?.find(i => i.group == 1 && i.type == 1)?.info || null
    if (food_allergies)
      setHasFoodAllergy(true)
    if (drug_allergies)
      setHasDrugAllergy(true)
    if (chronic_illnesses)
      setHasChronicIllness(true)
    return { food_allergies, drug_allergies, chronic_illnesses, special_cases }
  }, [data?.studentMedicalInfo])
  useEffect(() => {
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  async function handleSave() {
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const form_data = form.getFieldsValue()
      const info = [] as any
      info.push({ group: 1, type: 1, info: form_data.special_cases })
      info.push({ group: 2, type: 2, info: form_data.food_allergies })
      info.push({ group: 2, type: 3, info: form_data.drug_allergies })
      info.push({ group: 3, type: 4, info: form_data.chronic_illnesses })
      const result = await updateStudentMedicalInfo(info)
      if (!result) return
      switchUpdateMode(false)
    })
  }

  if (!authority?.can_touch_student) return <ForbiddenState onBack={() => switchUpdateMode(false)} />
  if (!data) return null
  return <Fragment>
    <Flex justify='end' gap={12}>
      <Button loading={loading} icon={<CloseOutlined />} onClick={() => switchUpdateMode(false)}>Huỷ bỏ</Button>
      <Button loading={loading} type="primary" icon={<CheckOutlined />} onClick={handleSave}>Lưu thay đổi</Button>
    </Flex>
    <Col flex='auto' style={{ marginLeft: 24 }}>
      <Row><Title level={4} style={{ margin: '16px 0' }}>Thông tin Sức khoẻ</Title></Row>
      <Form layout="vertical" form={form}
        onValuesChange={(_value) => setBlock(true)}
        initialValues={data_fields}>
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
                    if (!_v) form?.setFieldValue('food_allergies', null)
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
                    if (!_v) form?.setFieldValue('drug_allergies', null)
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
                    if (!_v) form?.setFieldValue('chronic_illnesses', null)
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
  </Fragment>
}