import { Button, Col, Flex, Form, Row, Select } from "antd";
import { useMemo } from "react";
import { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useSchoolYearCreateContext } from "../../../../../contexts/school-only/school-years/SchoolYearNewContext";
import GCard from "../../../../atoms/g-card";
import GDateRangePicker from "../../../../atoms/g-date-range-picker";
import GFormItemInput from "../../../../atoms/g-form-item-input";
import { DeleteOutlined, PlusOutlined } from "../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../atoms/title-segment-row";

const MAX_INPUT_WIDTH = 759
export default function SchoolYearNewStep1() {
  const { setBlock } = useRouterBlockerContext()
  const { school_year, form } = useSchoolYearCreateContext()
  const semesters = Form.useWatch<any[]>('semesters', form)
  const semester_list = useMemo(() => {
    return semesters?.filter(s => s.title ? true : false)
  }, [semesters])
  function onRemoveSemester(semester_key: string) {
    const exams = form?.getFieldValue('examinations');
    exams?.map((_exam: any, _idx: number) => {
      if (semester_key == _exam.semester_key)
        exams[_idx] = { ...exams[_idx], semester_key: undefined };
    })
    form?.setFieldValue('examinations', exams);
  }
  return <Form layout='vertical' form={form}
    initialValues={school_year}
    onValuesChange={(_value) => { setBlock(true) }}>
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
        {(fields, { add, remove }, { errors }) => {
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
        {(fields, { add, remove }, { errors }) => {
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
}