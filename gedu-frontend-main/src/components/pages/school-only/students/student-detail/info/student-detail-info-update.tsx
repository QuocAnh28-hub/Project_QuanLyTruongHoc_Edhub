import { Button, Checkbox, Col, Flex, Form, Input, Row, Select, Typography } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import { useStudentDetailContext } from "../../../../../../contexts/school-only/students/StudentDetailContext";
import { useLayoutContext } from "../../../../../../contexts/SchoolLayoutContext";
import { useNations, useProvincesCities, useReligions, useWardsCommunes } from "../../../../../../hooks/shared-data-hook";
import { SplitNameByLocale, ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import GDatePicker from "../../../../../atoms/g-date-picker";
import { CheckOutlined, CloseOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";
import ForbiddenState from "../../../../../molecules/forbidden-state";

const { Text } = Typography

const StudentDetailInfoUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StudentDetailInfoUpdate

function Content() {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const { data, switchUpdateMode, updateStudentInfo, loading } = useStudentDetailContext()
  const [form] = Form.useForm()
  const { block, setBlock } = useRouterBlockerContext()

  const [provinceId, setProvinceId] = useState<number | null>(null)
  const { data: nations, fetching: nation_load } = useNations()
  const { data: religions, fetching: religion_load } = useReligions()
  const { data: provinces, fetching: prv_load } = useProvincesCities()
  const { data: wards, fetching: wrd_load } = useWardsCommunes(provinceId)

  const [tempProvinceId, setTempProvinceId] = useState<number | null>(null)
  const { data: temp_wards, fetching: temp_wrd_load } = useWardsCommunes(tempProvinceId)

  const [same_as_permanent, setSameAsPermanent] = useState(false)
  useEffect(() => {
    setProvinceId(data?.permanentResidenceProvinceId || null)
    setTempProvinceId(data?.permanentResidenceProvinceId || null)
    setSameAsPermanent(data?.same_as_permanent || false)
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
      const res = await updateStudentInfo(__student)
      if (!res) return
      switchUpdateMode(false)
    })
  }
  if (!authority?.can_touch_student) return <ForbiddenState onBack={() => switchUpdateMode(false)} />
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
        fullName: ToFullNameByLocale(data.firstName, data.lastName),
        dateOfIssue: data.dateOfIssue ? dayjs(data.dateOfIssue) : null,
        dateOfExpiry: data.dateOfExpiry ? dayjs(data.dateOfExpiry) : null,
        placeOfIssue: data.placeOfIssue,
        dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
      }}>
      {/* Thông tin chung */}
      <TitleSegmentRow title='Thông tin chung'>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col xs={{ flex: 24 }} xl={{ flex: '0 0 193px' }}>
            <Form.Item label="Mã học sinh" name="code" rules={[{ required: true, whitespace: true }]}>
              <Input disabled placeholder="VS-000" />
            </Form.Item>
          </Col>
          <Col xs={{ flex: 24 }} xl={{ flex: 'auto' }}>
            <Form.Item label="Họ tên" name="fullName" rules={[{ required: true, whitespace: true }]}>
              <Input placeholder="Nguyễn Văn A" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Mã định danh cá nhân / Số CCCD" name="citizenId">
              <Input placeholder="Nhập mã định danh 12 số trên Giấy khai sinh hoặc số trên thẻ Căn cước công dân." />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Ngày cấp" name="dateOfIssue">
              <GDatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Ngày hết hạn" name="dateOfExpiry">
              <GDatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Nơi cấp" name="placeOfIssue">
              <Input placeholder="Đồng Nai" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Chưa điền Ngày sinh' }]}>
              <GDatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Giới tính" name="sex" rules={[{ required: true, message: 'Chưa chọn giới tính' }]}>
              <Select allowClear placeholder='Chọn'>
                <Select.Option value={1}>Nam</Select.Option>
                <Select.Option value={2}>Nữ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Quốc tịch" name="nationalityId">
              <Select showSearch options={nations} loading={nation_load}
                fieldNames={{ value: 'id', label: 'title' }}
                optionFilterProp='title'
                placeholder='Chọn' />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Tôn giáo" name="religionId">
              <Select showSearch options={religions} loading={religion_load}
                fieldNames={{ value: 'id', label: 'title' }}
                optionFilterProp='title'
                placeholder='Chọn' />
            </Form.Item>
          </Col>
        </Row>
      </TitleSegmentRow>

      {/* Thông tin địa chỉ */}
      <TitleSegmentRow title='Thông tin địa chỉ'>
        <Row gutter={16}>
          <Col span={24} style={{ marginBottom: 12 }}><Text strong>Nơi thường trú</Text></Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Tỉnh/Thành phố" name="permanentResidenceProvinceId">
              <Select showSearch options={provinces} loading={prv_load}
                fieldNames={{ value: 'id', label: 'title' }}
                optionFilterProp='title'
                placeholder='Chọn'
                onChange={(_value => {
                  setProvinceId(_value)
                  form?.setFieldValue('permanentResidenceWardId', null)
                })} />
            </Form.Item>
          </Col>

          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Phường/Xã" name="permanentResidenceWardId">
              <Select showSearch options={wards} loading={wrd_load}
                fieldNames={{ value: 'id', label: 'title' }}
                optionFilterProp='title'
                placeholder='Chọn' />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Số nhà & Tên đường" name="permanentResidenceAddress">
              <Input placeholder="25 Nguyễn Du" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}><Text strong>Nơi tạm trú</Text></Col>
          <Col span={24} style={{ marginTop: 16, marginBottom: 24 }}>
            <Form.Item name="same_as_permanent" valuePropName="checked" noStyle>
              <Checkbox checked={same_as_permanent}
                onChange={() => {
                  setSameAsPermanent(!same_as_permanent)
                }}>Giống Nơi thường trú</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {same_as_permanent ? null : <Fragment>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Tỉnh/Thành phố" name="temporaryResidenceProvinceId">
                <Select showSearch options={provinces} loading={prv_load}
                  fieldNames={{ value: 'id', label: 'title' }}
                  optionFilterProp='title'
                  placeholder='Chọn'
                  onChange={(_value => {
                    setTempProvinceId(_value)
                    form?.setFieldValue('temporaryResidenceWardId', null)
                  })} />
              </Form.Item>
            </Col>

            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Phường/Xã" name="temporaryResidenceWardId">
                <Select showSearch options={temp_wards} loading={temp_wrd_load}
                  fieldNames={{ value: 'id', label: 'title' }}
                  optionFilterProp='title'
                  placeholder='Chọn' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Số nhà & Tên đường" name="temporaryResidenceAddress">
                <Input placeholder="25 Nguyễn Du" />
              </Form.Item>
            </Col>
          </Row>
        </Fragment>
        }
      </TitleSegmentRow>

      {/* Thông tin liên hệ */}
      {/* <Form.List name="studentContacts" initialValue={data.studentContacts}>
        {(fields, { add, remove }) => (
          <TitleSegmentRow title='Thông tin Liên hệ'>
            {fields.map((field) => {
              const contact = data.studentContacts?.[field.key]
              return <Fragment key={field.key}>
                <Row gutter={[16, 16]}>
                  <Col>
                    <Upload
                      name="avatar1"
                      listType="picture-circle"
                      className="avatar-uploader"
                      showUploadList={false}
                    >
                      <button style={{ border: 0, background: 'none' }} type="button">
                        <PlusOutlined />
                        <div style={{ marginTop: 8 }}>Tải lên</div>
                      </button>
                    </Upload>
                  </Col>
                  <Col flex='auto'>
                    <Flex gap={8} vertical>
                      <Text>Ảnh đại diện</Text>
                      <ul style={{ margin: 0, paddingLeft: 24 }}>
                        <li>Kích cỡ: 128 x 128 pixel </li>
                        <li>Dung lượng tối đa: 1MB </li>
                        <li>Định dạng: JPEG, PNG</li>
                      </ul>
                    </Flex>
                  </Col>
                  <Col>
                    <Button color="danger" variant="text"
                      icon={<DeleteOutlined />}
                    >Xoá</Button>
                  </Col>
                </Row>
                <Row gutter={16} style={{ marginTop: 12 }}>
                  <Col xs={{ span: 24 }}>
                    <GFormItemInput label="Họ tên" name={[field.name, "fullName"]} rules={[{ required: true, whitespace: true }]}
                      placeholder="Nguyễn Văn A" />
                  </Col>
                  <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                    <GFormItemInput label="Số điện thoại" name={[field.name, "phone"]} rules={[{ required: true, whitespace: true }]}
                      placeholder="932000123" input_props={{ addonBefore: '+84' }} />
                  </Col>
                  <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                    <GFormItemInput label="Email" name={[field.name, "email"]}
                      placeholder="info@gedu.vn" />
                  </Col>
                </Row>
                <Row gutter={16}>
                  <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                    <Form.Item label="Mối quan hệ với Học sinh" name={[field.name, "relationship"]} rules={[{ required: true, message: 'Chưa chọn Mối quan hệ' }]}>
                      <Select placeholder="Chọn">
                        <Select.Option value={StudentContactRelationshipEnum.Cha.enum}>{StudentContactRelationshipEnum.Cha.title}</Select.Option>
                        <Select.Option value={StudentContactRelationshipEnum.Me.enum}>{StudentContactRelationshipEnum.Me.title}</Select.Option>
                        <Select.Option value={StudentContactRelationshipEnum.Khac.enum}>{StudentContactRelationshipEnum.Khac.title}</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={{ span: 24 }} xl={{ span: 12 }} style={{ alignContent: 'center' }}>
                    <Form.Item name={[field.name, "isMainContact"]} valuePropName="checked" noStyle>
                      <Checkbox
                        onChange={(e) => {
                          if (e.target.checked) {
                            form?.setFieldValue('isMainContact', false)
                          }
                        }}
                      >Là người liên hệ chính</Checkbox>
                    </Form.Item>
                  </Col>
                  {contact.relationship === 9 ? <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                    <GFormItemInput label="Mối quan hệ" name="relationshipTitle1" rules={[{ required: true, whitespace: true }]}
                      placeholder="Ông bà, cô dì, chú bác, v.v" />
                  </Col> : null}
                </Row>
              </Fragment>
            })}
          </TitleSegmentRow>
        )}
      </Form.List> */}
    </Form>
  </Fragment>
}