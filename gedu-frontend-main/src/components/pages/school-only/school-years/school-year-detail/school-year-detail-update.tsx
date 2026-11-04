import { Button, Col, Flex, Form, Row, Select } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useMemo } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useSchoolYearDetailContext } from "../../../../../contexts/school-only/school-years/SchoolYearDetailContext";
import { useLayoutContext } from "../../../../../contexts/SchoolLayoutContext";
import { SchoolYearCreateForm } from "../../../../../models/school-year-model";
import GCard from "../../../../atoms/g-card";
import GDateRangePicker from "../../../../atoms/g-date-range-picker";
import GFormItemInput from "../../../../atoms/g-form-item-input";
import { CheckOutlined, CloseOutlined, DeleteOutlined, PlusOutlined } from "../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../atoms/title-segment-row";
import ForbiddenState from "../../../../molecules/forbidden-state";

const MAX_INPUT_WIDTH = 759
export default function SchoolYearDetailUpdate() {
  return <RouterBlockerProvider><Content /></RouterBlockerProvider>
}

function Content() {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const { school_year, switchUpdateMode, updateSchoolYear, loading } = useSchoolYearDetailContext()
  const [form] = Form.useForm()
  const { block, setBlock } = useRouterBlockerContext()

  const { year } = useMemo(() => {
    let year = undefined as SchoolYearCreateForm | undefined
    if (school_year) {
      const semesters = [] as any
      const examinations = [] as any
      school_year.semesters?.map(sem => {
        const sem_key = crypto.randomUUID()
        semesters.push({
          ...sem, key: sem_key, examinations: undefined,
          semester_date_range: sem.fromDate && sem.toDate ? [dayjs(sem.fromDate), dayjs(sem.toDate)] : null
        })
        sem.examinations?.map(exam => {
          examinations.push({
            ...exam,
            examination_date_range: exam.fromDate && exam.toDate ? [dayjs(exam.fromDate), dayjs(exam.toDate)] : null,
            semester_id: sem.id, semester_title: sem.title, semester_key: sem_key
          })
        })
      })
      year = {
        ...school_year,
        school_year_date_range: [dayjs(school_year.fromDate), dayjs(school_year.toDate)],
        semesters,
        examinations
      }
    }
    return { year }
  }, [school_year])
  console.log(year)
  const semesters = Form.useWatch<any[]>('semesters', form)
  const semester_list = useMemo(() => {
    return semesters?.filter(s => s.title ? true : false)
  }, [semesters])
  useEffect(() => {
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function onRemoveSemester(semester_key: string) {
    const exams = form?.getFieldValue('examinations');

    exams?.map((_exam: any, _idx: number) => {
      if (semester_key == _exam.semester_key)
        exams[_idx] = { ...exams[_idx], semester_key: undefined };
    })
    form?.setFieldValue('examinations', exams);
  }
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
      const __school_year = form.getFieldsValue()
      __school_year.id = school_year?.id
      const res = await updateSchoolYear(__school_year)
      if (!res) return
      switchUpdateMode(false)
    })
  }

  if (!authority?.can_touch_schoolyear) return <ForbiddenState onBack={() => switchUpdateMode(false)} />
  if (!year) return null
  return <Fragment>
    <Flex justify='end' gap={12}>
      <Button loading={loading} icon={<CloseOutlined />} onClick={() => switchUpdateMode(false)}>Huỷ bỏ</Button>
      <Button loading={loading} type="primary" icon={<CheckOutlined />} onClick={() => handleSave()}>Lưu thay đổi</Button>
    </Flex>
    <Form layout='vertical' form={form}
      initialValues={year}
      onValuesChange={(_value) => setBlock(true)}>
      <Flex vertical gap={24}>
        {/* Thong tin chung */}
        <TitleSegmentRow title='Thông tin chung'>
          <Row gutter={16} style={{ maxWidth: MAX_INPUT_WIDTH }}>
            <Col xs={24}>
              <GFormItemInput required label='Năm học' name='title'
                rules={[{ required: true, whitespace: true }]}
                placeholder='Ví dụ: 2024-2025' />
            </Col>
            <Col xs={24}>
              <Form.Item label='Khung thời gian Năm học' name='school_year_date_range'
                rules={[{ required: true }]}>
                <GDateRangePicker style={{ width: '100%' }} placeholder={['01/08/2025', '31/05/2026']} />
              </Form.Item>
            </Col>
          </Row>
        </TitleSegmentRow>
        {/* Các Học kỳ trong Năm học */}
        <Form.List name='semesters'>
          {(fields, { add, remove }) => {
            return <TitleSegmentRow title='Các Học kỳ trong Năm học'>
              <Flex vertical gap={12} style={{ maxWidth: MAX_INPUT_WIDTH }}>
                {fields.map((field) => {
                  return <GCard key={field.key} type='secondary' vertical>
                    <Flex justify="end">
                      <Button danger type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => {
                          onRemoveSemester(form?.getFieldValue(['semesters', field.name, 'key']))
                          remove(field.name)
                        }}
                      >Xoá</Button>
                    </Flex>
                    <Row gutter={16} style={{ maxWidth: MAX_INPUT_WIDTH }}>
                      <Col xs={24}>
                        <GFormItemInput required label='Tên học kỳ' name={[field.name, 'title']}
                          rules={[{ required: true, whitespace: true }]}
                          placeholder='Ví dụ: Học kỳ I' />
                      </Col>
                      <Col xs={24}>
                        <Form.Item label='Thời gian Diễn ra'
                          name={[field.name, 'semester_date_range']}
                        >
                          <GDateRangePicker style={{ width: '100%' }} placeholder={['01/08/2025', '31/05/2026']} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </GCard>
                })}
                <Flex>
                  <Button type="link"
                    icon={<PlusOutlined />}
                    onClick={() => add({ key: crypto.randomUUID() })}
                  >Thêm học kỳ</Button>
                </Flex>
              </Flex>
            </TitleSegmentRow>
          }}
        </Form.List>
        {/* Các Kỳ thi trong Năm học */}
        <Form.List name='examinations'>
          {(fields, { add, remove }) => {
            return <TitleSegmentRow title='Các Kỳ thi trong Năm học'>
              <Flex vertical gap={12} style={{ maxWidth: MAX_INPUT_WIDTH }}>
                {fields.map((field) => {
                  return <GCard key={field.key} type='secondary' vertical>
                    <Flex justify="end">
                      <Button danger type="text"
                        icon={<DeleteOutlined />}
                        onClick={() => remove(field.name)}
                      >Xoá</Button>
                    </Flex>
                    <Row gutter={16}>
                      <Col xs={24} lg={12}>
                        <GFormItemInput required label='Tên kỳ thi' name={[field.name, 'title']}
                          rules={[{ required: true, whitespace: true }]}
                          placeholder='Ví dụ: Cuối Học kỳ I' />
                      </Col>
                      <Col xs={24} lg={12}>
                        <Form.Item label="Thuộc học kỳ" name={[field.name, 'semester_key']}
                          rules={[{ required: true }]}>
                          <Select allowClear showSearch options={semester_list}
                            fieldNames={{ value: 'key', label: 'title' }} placeholder='Chọn' />
                        </Form.Item>
                      </Col>
                      <Col xs={24}>
                        <Form.Item label='Thời gian Diễn ra'
                          name={[field.name, 'examination_date_range']}
                        >
                          <GDateRangePicker style={{ width: '100%' }} placeholder={['01/08/2025', '31/05/2026']} />
                        </Form.Item>
                      </Col>
                    </Row>
                  </GCard>
                })}
                <Flex>
                  <Button type="link"
                    icon={<PlusOutlined />}
                    onClick={() => add({ key: crypto.randomUUID() })}
                  >Thêm kỳ thi</Button>
                </Flex>
              </Flex>
            </TitleSegmentRow>
          }}
        </Form.List>
      </Flex>
    </Form>
  </Fragment>
}