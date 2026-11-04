import { Button, Card, Col, Divider, Flex, Form, Input, InputNumber, Modal, Radio, Row, Select } from "antd";
import { Fragment, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../contexts/RouterBlockerContext";
import ClassesNewProvider, { useClassesNewContext } from "../../../../contexts/school-only/classes/ClassesNewContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { useForeignLanguages, useMetaCurriculums, useMetaSchoolYears } from "../../../../hooks/school-only/shared-data-hook";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import { ArrowRightOutlined, UploadOutlined } from "../../../atoms/svg/outlined-icons";
import { svg_advertisement_board, svg_lead_pencils, svg_podium } from "../../../atoms/svg/svg-icons";
import TitleSegmentRow from "../../../atoms/title-segment-row";
import EmptyState from "../../../molecules/empty-state";
import ClassesNewList from "./classes-new/classes-new-list";


export default function ClassesNew() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.grade_levels.route, title: nav_links.grade_levels.title },
    ], nav_links.student_new.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <ClassesNewProvider>
    <RouterBlockerProvider>
      <Content />
    </RouterBlockerProvider>
  </ClassesNewProvider>
}
type RuleTypes = 'by_letter' | 'by_number' | 'by_name'
function Content() {
  const { account } = useAppContext()
  const { callMessage, grade_levels } = useLayoutContext()
  const { grade, callSetGrade, school_year, form, initData } = useClassesNewContext()
  const { setBlock } = useRouterBlockerContext()
  const { data: years, fetching: yrs_load } = useMetaSchoolYears()
  const { data: languages, fetching: lang_load } = useForeignLanguages()
  const { data: curriculums, fetching: curr_load } = useMetaCurriculums(grade?.enum)
  const [rule, setRule] = useState<RuleTypes>('by_letter')
  const [rule_value, setRuleValue] = useState<string>('alphabet_inc')
  const [open, setOpen] = useState(false)
  const sort = useMemo(() => {
    return grade?.short
  }, [grade])
  useEffect(() => {
    if (grade == null)
      setOpen(true)
  }, [grade])

  function handleInitData() {
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __value = form.getFieldsValue()
      __value.rule = rule
      __value.rule_value = rule_value
      __value.grade = grade
      __value.curriculumName = curriculums.find((c: any) => c.id == __value.curriculumId)?.name
      __value.firstForeignLanguageName = languages?.find((c: any) => c.id == __value.firstForeignLanguageId)?.name
      __value.secondForeignLanguageName = languages?.find((c: any) => c.id == __value.secondForeignLanguageId)?.name
      __value.school_code = account?.additional.school_code
      initData(__value)
    })
  }
  if (!grade) return <Fragment>
    <Modal
      open={open}
      maskClosable={false}
      title='Chọn khối lớp'
      cancelText="Đóng"
      onCancel={() => setOpen(false)}
      footer={(_, { CancelBtn }) => (
        <CancelBtn />
      )}
    >
      <Flex vertical style={{ marginTop: 24, marginBottom: 24 }}>
        {grade_levels?.map((grade: any, idx: number) => {
          return <Fragment key={grade.enum}>
            <Flex gap={12} justify="space-between">
              <GText>{grade.title}</GText>
              <Button icon={<ArrowRightOutlined />}
                onClick={() => {
                  callSetGrade(grade)
                }}
              />
            </Flex>
            {idx < grade_levels.length - 1 ? <Divider style={{ marginTop: 12, marginBottom: 12 }} /> : null}
          </Fragment>
        })}
      </Flex>
    </Modal>
    <EmptyPanel />
  </Fragment>
  return <Fragment>
    <ContentCover>
      <Flex style={{ paddingBottom: 20 }} justify="space-between">
        <GTitle level={3}>Tạo lớp học cho {grade?.title}</GTitle>
      </Flex>
      <Form layout="vertical" form={form}
        initialValues={{
          schoolYearId: school_year,
          class_count: 5,
          max_class_size: 45
        }}
        onValuesChange={(_value) => setBlock(true)}>
        <Card>
          <Flex vertical gap={32}>
            <TitleSegmentRow title='Thiết lập Tạo hàng loạt'>
              <Row gutter={[12, 12]}>
                <Col xs={24} xl={8}>
                  <Form.Item label="Năm học" name="schoolYearId" rules={[{ required: true, message: 'Chưa chọn Năm học' }]}>
                    <Select showSearch options={years} loading={yrs_load}
                      fieldNames={{ value: 'id', label: 'title' }}
                      optionFilterProp='title'
                      placeholder='Chọn' />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={8}>
                  <Form.Item label="Số lượng lớp cần tạo" name="class_count" rules={[{ required: true, message: 'Chưa điền số lượng lớp' }]}>
                    <InputNumber
                      min={1}
                      placeholder='Số lượng lớp'
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={8}>
                  <Form.Item label="Sĩ số lớp tối đa" name="max_class_size">
                    <InputNumber
                      min={1}
                      placeholder="Sĩ số lớp"
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col span={24}>
                  <GText style={{ marginBottom: 8 }}>Quy tắc đặt tên lớp</GText>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col xs={24} xl={8}>
                  <GCard style={{ height: '100%', cursor: 'pointer' }}
                    onClick={() => {
                      setRuleValue('alphabet_inc')
                      setRule('by_letter')
                    }}
                  >
                    <Flex vertical gap={12} flex={1}>
                      <Flex justify="space-between" align="start">
                        <Flex flex='auto'>{svg_advertisement_board}</Flex>
                        <Flex><Radio checked={rule == 'by_letter'} /></Flex>
                      </Flex>
                      <Flex vertical gap={4}>
                        <GText strong>Theo chữ cái</GText>
                        <GText>Ví dụ: {sort}A, {sort}B, {sort}C,...</GText>
                      </Flex>
                    </Flex>
                  </GCard>
                </Col>
                <Col xs={24} xl={8}>
                  <GCard style={{ height: '100%', cursor: 'pointer' }}
                    onClick={() => {
                      setRuleValue('.')
                      setRule('by_number')
                    }}>
                    <Flex vertical gap={12} flex={1}>
                      <Flex justify="space-between" align="start">
                        <Flex flex='auto'>{svg_podium}</Flex>
                        <Flex><Radio checked={rule == 'by_number'} /></Flex>
                      </Flex>
                      <Flex vertical gap={4}>
                        <GText strong>Theo số thứ tự</GText>
                        <GText>Theo số thứ tự (Ví dụ: {sort}.1, {sort}.2, {sort}/3...)</GText>
                      </Flex>
                    </Flex>
                  </GCard>
                </Col>
                <Col xs={24} xl={8}>
                  <GCard style={{ height: '100%', cursor: 'pointer' }}
                    onClick={() => {
                      setRuleValue('')
                      setRule('by_name')
                    }}>
                    <Flex vertical gap={12} flex={1}>
                      <Flex justify="space-between" align="start">
                        <Flex flex='auto'>{svg_lead_pencils}</Flex>
                        <Flex><Radio checked={rule == 'by_name'} /></Flex>
                      </Flex>
                      <Flex vertical gap={4}>
                        <GText strong>Theo danh sách tên gọi riêng / Tự đặt tên thủ công</GText>
                        <GText>Nhập danh sách các tên lớp, mỗi tên cách nhau bởi dấu phẩy.</GText>
                      </Flex>
                    </Flex>
                  </GCard>
                </Col>
              </Row>
              <Row>
                <Col span={24} style={{ paddingTop: 16 }}>
                  <GCard type="secondary">
                    {rule == 'by_letter' &&
                      <Flex vertical gap={12}>
                        <Radio
                          checked={rule_value == 'alphabet_inc'}
                          onClick={() => setRuleValue('alphabet_inc')}
                        >Tăng dần (A, B, C...) - Ví dụ: {sort}A, {sort}B, {sort}C...</Radio>
                        <Radio
                          checked={rule_value != 'alphabet_inc'}
                          onClick={() => setRuleValue('')}
                        >Theo một ký tự (A1, A2, A3...) - Ví dụ: {sort}A1, {sort}A2, {sort}A3...</Radio>
                        <Input disabled={rule_value == 'alphabet_inc'}
                          value={rule_value == 'alphabet_inc' ? '' : rule_value}
                          onChange={e => setRuleValue(e.target.value)}
                        />
                      </Flex>
                    }
                    {rule == 'by_number' &&
                      <Flex vertical gap={12}>
                        <Radio
                          checked={rule_value == '.'}
                          onClick={() => setRuleValue('.')}
                        >Dấu chấm (.) - Ví dụ: {sort}.1, {sort}.2, {sort}.3...</Radio>
                        <Radio
                          checked={rule_value == '/'}
                          onClick={() => setRuleValue('/')}
                        >Dấu gạch chéo (/) - Ví dụ: {sort}/1, {sort}/2, {sort}/3...</Radio>
                      </Flex>
                    }
                    {rule == 'by_name' &&
                      <Flex vertical gap={12} style={{ width: '100%' }}>
                        <Input.TextArea
                          value={rule_value}
                          onChange={e => setRuleValue(e.target.value)}
                        />
                      </Flex>
                    }
                  </GCard>
                </Col>
              </Row>
            </TitleSegmentRow>
            <TitleSegmentRow title='Chương trình & Giảng dạy'>
              <Row>
                <Col xs={24} xl={16}>
                  <Form.Item label="Chương trình học" name="curriculumId">
                    <Select showSearch options={curriculums} loading={curr_load}
                      fieldNames={{ value: 'id', label: 'name' }}
                      optionFilterProp='name'
                      placeholder='Chọn' />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={[12, 12]}>
                <Col xs={24} xl={8}>
                  <Form.Item label="Ngoại ngữ 1" name="firstForeignLanguageId">
                    <Select showSearch options={languages} loading={lang_load}
                      fieldNames={{ value: 'id', label: 'name' }}
                      optionFilterProp='name'
                      placeholder='Chọn' />
                  </Form.Item>
                </Col>
                <Col xs={24} xl={8}>
                  <Form.Item label="Ngoại ngữ 2" name="secondForeignLanguageId">
                    <Select showSearch options={languages} loading={lang_load}
                      fieldNames={{ value: 'id', label: 'name' }}
                      optionFilterProp='name'
                      placeholder='Chọn' />
                  </Form.Item>
                </Col>
              </Row>
            </TitleSegmentRow>
            {/* <TitleSegmentRow title='Đặc điểm của lớp'>

          </TitleSegmentRow> */}
            <Flex align="center" justify="end" gap={12}>
              <GText type="secondary" italic>(Xem trước kết quả ở giao diện bên dưới)</GText>
              <Button type="primary" onClick={handleInitData}>Tạo bảng xem trước</Button>
            </Flex>
          </Flex>
        </Card>
      </Form>
      <ClassesNewList />
    </ContentCover>
  </Fragment>
}

function EmptyPanel() {
  return <ContentCover size="stretch">
    <Card style={{ paddingTop: 60, paddingBottom: 60 }}>
      <EmptyState icon="school-bag" title='Chưa chọn khối' desc='Hãy bắt đầu bằng cách chọn khối ở danh sách Khối lớp' />
      <Flex gap={12} justify="center" style={{ marginTop: 24 }}>
        <Link to={nav_links.grade_levels.route}><Button icon={<UploadOutlined />}>Về danh sách Khối lớp</Button></Link>
      </Flex>
    </Card>
  </ContentCover>
}