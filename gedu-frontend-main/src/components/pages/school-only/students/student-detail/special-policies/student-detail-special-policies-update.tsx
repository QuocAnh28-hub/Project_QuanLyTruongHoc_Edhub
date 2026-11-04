import { Button, Col, Flex, Form, Radio, Row, Select, Typography } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import { useStudentDetailContext } from "../../../../../../contexts/school-only/students/StudentDetailContext";
import { useLayoutContext } from "../../../../../../contexts/SchoolLayoutContext";
import { useSchoolYears } from "../../../../../../hooks/school-only/school-years-hook";
import { useMetaClasses } from "../../../../../../hooks/school-only/shared-data-hook";
import { useStudentPriorityPolicies, useStudentSpecialNeedsPolicies } from "../../../../../../hooks/shared-data-hook";
import { StudentAdmissionTypeEnum } from "../../../../../../models/enums";
import AskYesNo from "../../../../../atoms/ask-yes-no";
import GDatePicker from "../../../../../atoms/g-date-picker";
import { CheckOutlined, CloseOutlined } from "../../../../../atoms/svg/outlined-icons";
import ForbiddenState from "../../../../../molecules/forbidden-state";

const { Title } = Typography

const StudentDetailSpecialPoliciesUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StudentDetailSpecialPoliciesUpdate

function Content() {
  const { account, authority } = useAppContext()
  const { callMessage, grade_levels } = useLayoutContext()
  const { setBlock } = useRouterBlockerContext()

  const { data, switchUpdateMode, updateStudentAcademicAndPolicies, loading } = useStudentDetailContext()
  const [form] = Form.useForm()
  const [grade, setGrade] = useState<number | null>(null)
  const { data: years, fetching: yrs_load } = useSchoolYears()
  const { data: priorities, fetching: prt_load } = useStudentPriorityPolicies()
  const { data: special_needs, fetching: spn_load } = useStudentSpecialNeedsPolicies()
  const { data: classes, fetching: clss_load } = useMetaClasses(grade ? account?.additional.school_year_id : undefined, grade)

  const [priority, setPriority] = useState<boolean>(false)
  const [special_need, setSpecialNeed] = useState<boolean>(false)
  useEffect(() => {
    setGrade(data?.gradeLevel || null)
    setPriority(data?.priorityPolicyId ? true : false)
    setSpecialNeed(data?.specialNeedsPolicyId ? true : false)
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
      form_data.priorityPolicyId = form_data.priorityPolicyId ?? null
      form_data.specialNeedsPolicyId = form_data.specialNeedsPolicyId ?? null
      const result = await updateStudentAcademicAndPolicies(form_data)
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
    <Form layout="vertical" form={form}
      onValuesChange={(_value) => setBlock(true)}
      initialValues={{ ...data, admissionDate: data.admissionDate ? dayjs(data.admissionDate) : null }}>
      {/* Thông tin Nhập học */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} xxl={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Thông tin Nhập học</Title>
        </Col>
        <Col xs={{ flex: '100%' }} xxl={{ flex: 'auto' }}>
          <Row gutter={16}>
            <Col xs={{ span: 24 }}>
              <Form.Item label="Ngày nhập học" name="admissionDate" rules={[{ required: true, message: 'Chưa điền Ngày nhập học' }]}>
                <GDatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }}>
              <Form.Item label="Năm nhập học" name="admissionSchoolYearId" rules={[{ required: true, message: 'Chưa chọn Năm học' }]}>
                <Select showSearch options={years} loading={yrs_load}
                  fieldNames={{ value: 'id', label: 'title' }}
                  optionFilterProp='title'
                  placeholder='Chọn' />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }}>
              <Form.Item label="Hình thức nhập học" name="admissionType" rules={[{ required: true, message: 'Chưa chọn Hình thức nhập học' }]}>
                <Radio.Group>
                  <Radio.Button value={StudentAdmissionTypeEnum.DungTuyen.enum}>{StudentAdmissionTypeEnum.DungTuyen.title}</Radio.Button>
                  <Radio.Button value={StudentAdmissionTypeEnum.TraiTuyen.enum}>{StudentAdmissionTypeEnum.TraiTuyen.title}</Radio.Button>
                  <Radio.Button value={StudentAdmissionTypeEnum.ChuyenTruong.enum}>{StudentAdmissionTypeEnum.ChuyenTruong.title}</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Thông tin Lớp học */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} xxl={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Thông tin Lớp học</Title>
        </Col>
        <Col xs={{ flex: '100%' }} xxl={{ flex: 'auto' }}>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Khối" name="gradeLevel" rules={[{ required: true, message: 'Chưa chọn Khối' }]}>
                <Select showSearch options={grade_levels}
                  onChange={(_v) => {
                    setGrade(_v)
                    form.setFieldValue('classId', null)
                  }}
                  fieldNames={{ value: 'enum', label: 'title' }}
                  optionFilterProp='title'
                  placeholder='Chọn' />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Lớp" name="classId">
                <Select showSearch options={classes} loading={clss_load}
                  fieldNames={{ value: 'id', label: 'name' }}
                  optionFilterProp='name'
                  placeholder='Chọn' />
              </Form.Item>
            </Col>
          </Row>
        </Col>
      </Row>
      {/* Chế độ & Chính sách */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ span: 24 }} xxl={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Chế độ & Chính sách</Title>
        </Col>
        <Col xs={{ span: 24 }} xxl={{ flex: 'auto' }}>
          <Row gutter={16}>
            <Col span={24} style={{ marginBottom: 12 }}>
              <AskYesNo value={priority}
                text="Học sinh có thuộc diện ưu tiên không?"
                onChange={(_v: boolean) => {
                  if (!_v) form?.setFieldValue('priorityPolicyId', null)
                  setPriority(_v)
                }} />
            </Col>
            {priority ?
              <Col xs={{ span: 24 }}>
                <Form.Item label='Diện ưu tiên'
                  name="priorityPolicyId" rules={[{ required: true, message: 'Chưa chọn Diện ưu tiên' }]}>
                  <Select showSearch options={priorities} loading={prt_load}
                    fieldNames={{ value: 'id', label: 'title' }}
                    optionFilterProp='title'
                    placeholder='Chọn' />
                </Form.Item>
              </Col> : null}
            <Col span={24} style={{ marginBottom: 12 }}>
              <AskYesNo value={special_need}
                text="Học sinh có thuộc diện khuyết tật không?"
                onChange={(_v: boolean) => {
                  if (!_v) form?.setFieldValue('specialNeedsPolicyId', null)
                  setSpecialNeed(_v)
                }} />
            </Col>
            {special_need ?
              <Col xs={{ span: 24 }}>
                <Form.Item label="Diện khuyết tật" name="specialNeedsPolicyId" rules={[{ required: true, message: 'Chưa chọn Diện khuyết tật' }]}>
                  <Select showSearch options={special_needs} loading={spn_load}
                    fieldNames={{ value: 'id', label: 'title' }}
                    optionFilterProp='title'
                    placeholder='Chọn' />
                </Form.Item>
              </Col> : null}
          </Row>
        </Col>
      </Row>
    </Form>
  </Fragment>
}