import { Button, Checkbox, Col, Flex, Form, Input, InputNumber, Radio, Row, Select } from "antd";
import { Fragment, useEffect, useMemo } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import { useClassDetailContext } from "../../../../../../contexts/school-only/classes/ClassDetailContext";
import { useLayoutContext } from "../../../../../../contexts/SchoolLayoutContext";
import { useForeignLanguages, useMetaCurriculums, useMetaHomeroomTeachers } from "../../../../../../hooks/school-only/shared-data-hook";
import { SchoolDailyScheduleEnum, SpecificClassEnum, StudentGradeModel } from "../../../../../../models/enums";
import { GetGradeLevels, SplitNameByLocale, ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import { CheckOutlined, CloseOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";
import ForbiddenState from "../../../../../molecules/forbidden-state";

const ClassDetailInfoUpdate = () => <RouterBlockerProvider>
  <Content />
</RouterBlockerProvider>
export default ClassDetailInfoUpdate

function Content() {
  const { account, authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const { data, switchUpdateMode, updateClassInfo, loading } = useClassDetailContext()
  const [form] = Form.useForm()
  const { block, setBlock } = useRouterBlockerContext()
  const { data: languages, fetching: lang_load } = useForeignLanguages()
  const { data: teachers = [], fetching: teacher_load } = useMetaHomeroomTeachers()
  const { data: curriculums, fetching: curr_load } = useMetaCurriculums(data?.gradeLevel)
  const grade_levels = useMemo(() => {
    let grade_levels = [] as StudentGradeModel[]
    if (account) {
      grade_levels = GetGradeLevels(account?.additional.can_preschool, account?.additional.can_primary_school, account?.additional.can_lower_secondary_school, account?.additional.can_upper_secondary_school)
    }
    return grade_levels
  }, [account])

  useEffect(() => {
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function handleSave() {
    if (!block) {
      switchUpdateMode(false)
      return
    }
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __student = form.getFieldsValue()
      __student.id = data?.id
      const { firstName, lastName } = SplitNameByLocale(__student.fullName)
      __student.firstName = firstName
      __student.lastName = lastName
      if (__student.same_as_permanent) {
        __student.temporaryResidenceProvinceId = __student.permanentResidenceProvinceId
        __student.temporaryResidenceWardId = __student.permanentResidenceWardId
        __student.temporaryResidenceAddress = __student.permanentResidenceAddress
      }
      const res = await updateClassInfo(__student)
      if (!res) return
      switchUpdateMode(false)
    })
  }

  if (!authority?.can_touch_schoolyear) return <ForbiddenState onBack={() => switchUpdateMode(false)} />
  if (!data) return null
  return <Fragment>
    <Flex justify='end' gap={12}>
      <Button loading={loading} icon={<CloseOutlined />} onClick={() => switchUpdateMode(false)}>Huỷ bỏ</Button>
      <Button loading={loading} type="primary" icon={<CheckOutlined />} onClick={() => handleSave()}>Lưu thay đổi</Button>
    </Flex>
    <Form layout="vertical" form={form}
      onValuesChange={(_value) => setBlock(true)}
      initialValues={{
        ...data,
      }}>
      {/* Thông tin chung */}
      <TitleSegmentRow title='Thông tin chung'>
        <Row gutter={[16, 16]} style={{ marginTop: 12 }}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Mã lớp học" name="code" rules={[{ required: true, whitespace: true }]}>
              <Input disabled placeholder="VS-000" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Tên lớp học" name="name">
              <Input placeholder="Nhập tên lớp học" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Khối" name="gradeLevel" >
              <Select showSearch options={grade_levels}
                onChange={(_v) => {
                  form.setFieldValue('classId', null)
                }}
                allowClear
                fieldNames={{ value: 'enum', label: 'title' }}
                optionFilterProp='label'
                placeholder='Chọn' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Chọn giáo viên chủ nhiệm" name="homeroomTeacherId" >
              <Select
                showSearch
                options={teachers.map((teacher: { id: number, user: { firstName: string, lastName: string } }) => ({
                  id: teacher.id,
                  name: ToFullNameByLocale(teacher.user.firstName, teacher.user.lastName)
                }))}
                allowClear
                loading={teacher_load}
                fieldNames={{ value: 'id', label: 'name' }}
                optionFilterProp='name'
                placeholder='Chọn' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Sĩ số thực tế" name="classSize" >
              <InputNumber placeholder="Sĩ số thực tế" disabled style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Sĩ số lớp tối đa" name="maxClassSize" >
              <InputNumber min={1} placeholder="Nhập sĩ số lớp tối đa" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </TitleSegmentRow>

      {/* Thông tin địa chỉ */}
      <TitleSegmentRow title='Chương trình & Giảng dạy'>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Chương trình học" name="curriculumId">
              <Select showSearch options={curriculums} loading={curr_load}
                fieldNames={{ value: 'id', label: 'name' }}
                optionFilterProp='name'
                allowClear
                placeholder='Chọn Chương trình học' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Ngoại ngữ 1" name="firstForeignLanguageId">
              <Select showSearch options={languages} loading={lang_load}
                fieldNames={{ value: 'id', label: 'name' }}
                optionFilterProp='name'
                allowClear
                placeholder='Chọn Ngoại ngữ 1' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <Form.Item label="Ngoại ngữ 2" name="secondForeignLanguageId">
              <Select showSearch options={languages} loading={lang_load}
                fieldNames={{ value: 'id', label: 'name' }}
                optionFilterProp='name'
                allowClear
                placeholder='Chọn Ngoại ngữ 2' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]}>
          <Col span={24} style={{ marginBottom: 24 }}>
            <Form.Item name="dailyScheduleType" >
              <Radio.Group style={{ whiteSpace: 'nowrap' }} >
                <Radio value={SchoolDailyScheduleEnum.OnePerDay.enum}>{SchoolDailyScheduleEnum.OnePerDay.title}</Radio>
                <Radio value={SchoolDailyScheduleEnum.TwicePerDay.enum}>{SchoolDailyScheduleEnum.TwicePerDay.title}</Radio>
              </Radio.Group>
            </Form.Item>
          </Col>
        </Row>
      </TitleSegmentRow>

      <TitleSegmentRow title='Đặc điểm lớp'>
        <Form.Item label="Cấp học" name='levels' rules={[{ required: false, message: 'Chọn ít nhất một cấp học' }]}>
          <Row>
            <Form.Item name="isDayBoarding" valuePropName="checked" noStyle>
              <Checkbox >{SpecificClassEnum.banTru.title}</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="isMultiGrade" valuePropName="checked" noStyle>
              <Checkbox >{SpecificClassEnum.lopGhep.title}</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="hasStudentsWithDisabilities" valuePropName="checked" noStyle>
              <Checkbox >{SpecificClassEnum.coHocSinhKhuyetTat.title}</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="hasParentRepInSchoolBoard" valuePropName="checked" noStyle>
              <Checkbox >{SpecificClassEnum.coChaMeHoiDong.title}</Checkbox>
            </Form.Item>
          </Row>
        </Form.Item>
      </TitleSegmentRow>
    </Form>
  </Fragment>
}