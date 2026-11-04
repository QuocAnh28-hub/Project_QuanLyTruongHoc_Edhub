import { Button, Col, Flex, Form, Input, Row, Select, Switch } from "antd"
import { Fragment, useEffect, useState } from "react"
import { useAppContext } from "../../../../../../contexts/AppContext"
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext"
import { useStaffDetailMajorContext } from "../../../../../../contexts/school-only/staffs/detail/StaffDetailMajorContext"
import { useStaffDetailContext } from "../../../../../../contexts/school-only/staffs/StaffDetailContext"
import { useLayoutContext } from "../../../../../../contexts/SchoolLayoutContext"
import { useMetaSchoolDepartments, useMetaSchoolPositions } from "../../../../../../hooks/school-only/shared-data-hook"
import GText from "../../../../../atoms/g-text"
import { CheckOutlined, CloseOutlined } from "../../../../../atoms/svg/outlined-icons"
import ForbiddenState from "../../../../../molecules/forbidden-state"
import TitleSegmentRow from "../../../../../atoms/title-segment-row"

const StaffDetailMajorUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StaffDetailMajorUpdate

function Content() {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const [form] = Form.useForm()
  const { setBlock } = useRouterBlockerContext()

  const [dept_id, setDeptId] = useState<number | null>(null)
  const { data: dept, fetching: dept_load } = useMetaSchoolDepartments()
  const { data: pos, fetching: pos_load } = useMetaSchoolPositions(dept_id)
  const { data: posCon = [], fetching: posCon_load } = useMetaSchoolPositions(null)
  const { switchUpdateMode } = useStaffDetailContext()
  const { data, updateStaffMajor, loading } = useStaffDetailMajorContext()
  const pos_id_selected = Form.useWatch<number | null>('positionId', form)
  const [hasConcurrent, setHasConcurrent] = useState<boolean>(data?.schoolStaffPositions.length ? true : false)

  useEffect(() => {
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (data) setDeptId(data.department?.id)
  }, [data])

  async function handleSave() {
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const form_data = form.getFieldsValue()
      const res = await updateStaffMajor(form_data)
      if (!res) return
      switchUpdateMode(false)
    })
  }

  if (!authority?.can_touch_staff) return <ForbiddenState onBack={() => switchUpdateMode(false)} />
  return <Fragment>
    <Flex justify='end' gap={12}>
      <Button loading={loading} icon={<CloseOutlined />} onClick={() => switchUpdateMode(false)}>Huỷ bỏ</Button>
      <Button loading={loading} type="primary" icon={<CheckOutlined />} onClick={handleSave}>Lưu thay đổi</Button>
    </Flex>
    <Col flex='auto' style={{ marginLeft: 24 }}>
      <Form
        layout="vertical" form={form}
        onValuesChange={(_value) => setBlock(true)}
        initialValues={{
          departmentId: data?.department?.id,
          positionId: data?.position?.id,
          schoolStaffPositions: data?.schoolStaffPositions?.map(item => item.id) || []
        }}>
        <TitleSegmentRow title="Phân công giảng dạy">
           <Row gutter={[16, 16]}>

            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Tổ/Phòng ban" name='departmentId' rules={[{ required: true, message: 'Chưa chọn Tổ/Phòng ban' }]}>
                <Select allowClear showSearch options={dept} loading={dept_load}
                  fieldNames={{ value: 'id', label: 'name' }} placeholder='Chọn'
                  onChange={(_value) => {
                    setDeptId(_value)
                    form?.setFieldValue('positionId', null)
                  }} />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Chức danh" name='positionId' rules={[{ required: true, message: 'Chưa chọn chức danh' }]}>
                <Select allowClear showSearch options={pos} loading={pos_load}
                  fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn' onChange={(_value) => { form?.setFieldValue('schoolStaffPositions', null); }} />
              </Form.Item>
            </Col>
          </Row>
          <Row style={{ marginBottom: 16 }}>
            <Flex gap={8}>
              <Switch
                checkedChildren={<CheckOutlined />}
                unCheckedChildren={<CloseOutlined />}
                value={hasConcurrent}
                disabled={!pos_id_selected}
                onChange={() => { setHasConcurrent(!hasConcurrent); form?.setFieldValue('schoolStaffPositions', []) }}
              />
              <GText>Có kiêm nhiệm 1 hoặc nhiều vị trí</GText>
            </Flex>
          </Row>
          {hasConcurrent && <Row style={{ marginTop: 12 }}>
            <Col span={24}>
              <Form.Item label="Vị trí kiêm nhiệm" required name="schoolStaffPositions">
                <Select mode="multiple" placeholder="Chọn" allowClear options={posCon.filter((item: any) => item.id !== pos_id_selected)} loading={posCon_load} fieldNames={{ value: 'id', label: 'title' }} />
              </Form.Item>
            </Col>
          </Row>}
        </TitleSegmentRow>

        <TitleSegmentRow title="Trình độ & Năng lực" >
          <Row gutter={[16, 16]}>

            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item labelAlign="left" label="Trình độ học vấn cao nhất" name="highestAcademicQualification">
                <Input placeholder="Nhập trình độ học vấn cao nhất" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item labelAlign="left" label="Trình độ chuyên môn" name="professionalQualification">
                <Input placeholder="Nhập trình độ chuyên môn" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item labelAlign="left" label="Chuyên ngành đào tạo" name="fieldOfStudy">
                <Input placeholder="Nhập chuyên ngành đào tạo" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item labelAlign="left" label="Trình độ ngoại ngữ" name="foreignLanguageSkill">
                <Input placeholder="Nhập trình độ ngoại ngữ" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item labelAlign="left" label="Trình độ tin học" name="it_skill">
                <Input placeholder="Nhập trình độ tin học" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item labelAlign="left" label="Trình độ lý luận chính trị" name="politicalTheoryQualification">
                <Input placeholder="Nhập trình độ lý luận chính trị" />
              </Form.Item>
            </Col>

          </Row>
          <Row gutter={[16, 16]}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item labelAlign="left" label="Trình độ quản lý giáo dục" name="educationalManagementQualification">
                <Input placeholder="Nhập trình độ quản lý giáo dục" />
              </Form.Item>
            </Col>
          </Row>
        </TitleSegmentRow>
      </Form>
    </Col>
  </Fragment >
}