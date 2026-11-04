import { Button, Checkbox, Col, Flex, Form, Row, Select, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useStudentCreateContext } from "../../../../../contexts/school-only/students/StudentNewContext";
import { StudentContactRelationshipEnum } from "../../../../../models/enums";
import GFormItemInput from "../../../../atoms/g-form-item-input";
import { DeleteOutlined, PlusOutlined } from "../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../atoms/title-segment-row";
import GDatePicker from "../../../../atoms/g-date-picker";

const { Title, Text } = Typography

const StudentNewStep2 = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StudentNewStep2

function Content() {
  const { student, form_step2 } = useStudentCreateContext()
  const { setBlock } = useRouterBlockerContext()

  const [count, setCount] = useState(1)
  const [relationship1, setRelationship1] = useState<number | undefined>(undefined)
  const [relationship2, setRelationship2] = useState<number | undefined>(undefined)
  const [relationship3, setRelationship3] = useState<number | undefined>(undefined)

  useEffect(() => {
    if (student?.studentContacts?.fullName3) {
      setCount(3)
    } else if (student?.studentContacts?.fullName2) {
      setCount(2)
    } else setCount(1)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function deleteContact(_index: number) {
    if (count == 1) return
    if (_index == 1) {
      form_step2?.setFieldValue('relationship1', form_step2.getFieldValue('relationship2'))
      form_step2?.setFieldValue('fullName1', form_step2.getFieldValue('fullName2'))
      form_step2?.setFieldValue('is_main_contact1', form_step2.getFieldValue('is_main_contact2'))
      form_step2?.setFieldValue('email1', form_step2.getFieldValue('email2'))
      form_step2?.setFieldValue('phone1', form_step2.getFieldValue('phone2'))
      form_step2?.setFieldValue('relationshipTitle1', form_step2.getFieldValue('relationshipTitle2'))
      form_step2?.setFieldValue('dateOfBirth1', form_step2.getFieldValue('dateOfBirth2'))
      form_step2?.setFieldValue('citizenId1', form_step2.getFieldValue('citizenId2'))
      form_step2?.setFieldValue('occupation1', form_step2.getFieldValue('occupation2'))
    }
    if (_index < 3 && count == 3) {
      form_step2?.setFieldValue('relationship2', form_step2.getFieldValue('relationship3'))
      form_step2?.setFieldValue('fullName2', form_step2.getFieldValue('fullName3'))
      form_step2?.setFieldValue('is_main_contact2', form_step2.getFieldValue('is_main_contact3'))
      form_step2?.setFieldValue('email2', form_step2.getFieldValue('email3'))
      form_step2?.setFieldValue('phone2', form_step2.getFieldValue('phone3'))
      form_step2?.setFieldValue('relationshipTitle2', form_step2.getFieldValue('relationshipTitle3'))
      form_step2?.setFieldValue('dateOfBirth2', form_step2.getFieldValue('dateOfBirth3'))
      form_step2?.setFieldValue('citizenId2', form_step2.getFieldValue('citizenId3'))
      form_step2?.setFieldValue('occupation2', form_step2.getFieldValue('occupation3'))
    }
    if (count == 2) {
      form_step2?.setFieldValue('relationship2', undefined)
      form_step2?.setFieldValue('fullName2', undefined)
      form_step2?.setFieldValue('is_main_contact2', undefined)
      form_step2?.setFieldValue('email2', undefined)
      form_step2?.setFieldValue('phone2', undefined)
      form_step2?.setFieldValue('relationshipTitle2', undefined)
      form_step2?.setFieldValue('dateOfBirth2', undefined)
      form_step2?.setFieldValue('citizenId2', undefined)
      form_step2?.setFieldValue('occupation2', undefined)
    }
    if (count == 3) {
      form_step2?.setFieldValue('relationship3', undefined)
      form_step2?.setFieldValue('fullName3', undefined)
      form_step2?.setFieldValue('is_main_contact3', undefined)
      form_step2?.setFieldValue('email3', undefined)
      form_step2?.setFieldValue('phone3', undefined)
      form_step2?.setFieldValue('relationshipTitle3', undefined)
      form_step2?.setFieldValue('dateOfBirth3', undefined)
      form_step2?.setFieldValue('citizenId3', undefined)
      form_step2?.setFieldValue('occupation3', undefined)
    }
    setCount(count - 1)
  }
  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0' }}>Thông tin Liên hệ</Title></Row>
    <Form layout="vertical" form={form_step2}
      initialValues={student?.studentContacts}
      onValuesChange={(_value) => setBlock(true)}>
      {/* Người Giám hộ 1 */}
      <TitleSegmentRow title='Người Giám hộ 1'>
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
          {count > 1 ?
            <Col>
              <Button color="danger" variant="text"
                icon={<DeleteOutlined />}
                onClick={() => deleteContact(1)}
              >Xoá</Button>
            </Col> : null
          }
        </Row>
        <Row gutter={24} style={{ marginTop: 12 }}>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <GFormItemInput label="Họ tên" name="fullName1" rules={[{ required: true, whitespace: true }]}
              placeholder="Nguyễn Văn A" />
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <GFormItemInput label="Mã định danh cá nhân / Số CCCD" name="citizenId1" rules={[{ whitespace: true }]}
              placeholder="082194029767" />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Năm sinh" name="dateOfBirth1">
              <GDatePicker format="YYYY" placeholder="2025" picker="year" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <GFormItemInput label="Nghề nghiệp" name="occupation1" rules={[{ whitespace: true }]}
              placeholder="Nhập nghề nghiệp" />
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <GFormItemInput label="Số điện thoại" name="phone1" rules={[{ required: true, whitespace: true }]}
              placeholder="932000123" input_props={{ addonBefore: '+84' }} />
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <GFormItemInput label="Email" name="email1"
              placeholder="info@gedu.vn" />
          </Col>
        </Row>

        <Row gutter={16}>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Mối quan hệ với Học sinh" name="relationship1" rules={[{ required: true, message: 'Chưa chọn Mối quan hệ' }]}>
              <Select placeholder="Chọn" onChange={(e) => { setRelationship1(e) }}>
                <Select.Option value={StudentContactRelationshipEnum.Cha.enum}>{StudentContactRelationshipEnum.Cha.title}</Select.Option>
                <Select.Option value={StudentContactRelationshipEnum.Me.enum}>{StudentContactRelationshipEnum.Me.title}</Select.Option>
                <Select.Option value={StudentContactRelationshipEnum.Khac.enum}>{StudentContactRelationshipEnum.Khac.title}</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }} style={{ alignContent: 'center' }}>
            <Form.Item name="is_main_contact1" valuePropName="checked" noStyle>
              <Checkbox
                onChange={(e) => {
                  if (e.target.checked) {
                    form_step2?.setFieldValue('is_main_contact2', false)
                    form_step2?.setFieldValue('is_main_contact3', false)
                  }
                }}
              >Là người liên hệ chính</Checkbox>
            </Form.Item>
          </Col>
          {relationship1 === 9 ? <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <GFormItemInput label="Mối quan hệ" name="relationshipTitle1" rules={[{ required: true, whitespace: true }]}
              placeholder="Ông bà, cô dì, chú bác, v.v" />
          </Col> : null}
        </Row>
      </TitleSegmentRow>
      {/* Người Giám hộ 2 */}
      {count > 1 ?
        <TitleSegmentRow title='Người Giám hộ 2' style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col>
              <Upload
                name="avatar2"
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
                onClick={() => deleteContact(2)}
              >Xoá</Button>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Họ tên" name="fullName2" rules={[{ required: true, whitespace: true }]}
                placeholder="Nguyễn Văn A" />
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Mã định danh cá nhân / Số CCCD" name="citizenId2" rules={[{ whitespace: true }]}
                placeholder="082194029767" />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Năm sinh" name="dateOfBirth2">
                <GDatePicker format="YYYY" picker="year" placeholder="2025"  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Nghề nghiệp" name="occupation2" rules={[{ whitespace: true }]}
                placeholder="Nhập nghề nghiệp" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Số điện thoại" name="phone2" rules={[{ required: true, whitespace: true }]}
                placeholder="932000123" input_props={{ addonBefore: '+84' }} />
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Email" name="email2"
                placeholder="info@gedu.vn" />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Mối quan hệ với Học sinh" name="relationship2" rules={[{ required: true, message: 'Chưa chọn Mối quan hệ' }]}>
                <Select placeholder="Chọn" onChange={(e) => { setRelationship2(e) }}>
                  <Select.Option value={StudentContactRelationshipEnum.Cha.enum}>{StudentContactRelationshipEnum.Cha.title}</Select.Option>
                  <Select.Option value={StudentContactRelationshipEnum.Me.enum}>{StudentContactRelationshipEnum.Me.title}</Select.Option>
                  <Select.Option value={StudentContactRelationshipEnum.Khac.enum}>{StudentContactRelationshipEnum.Khac.title}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }} style={{ alignContent: 'center' }}>
              <Form.Item name="is_main_contact2" valuePropName="checked" noStyle>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      form_step2?.setFieldValue('is_main_contact1', false)
                      form_step2?.setFieldValue('is_main_contact3', false)
                    }
                  }}
                >Là người liên hệ chính</Checkbox>
              </Form.Item>
            </Col>
            {relationship2 === 9 ? <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Mối quan hệ" name="relationshipTitle2"
                rules={[{ required: true, whitespace: true }]}
                placeholder="Ông bà, cô dì, chú bác, v.v" />
            </Col> : null}
          </Row>
        </TitleSegmentRow> : null
      }{/* Người Giám hộ 3 */}
      {count > 2 ?
        <TitleSegmentRow title='Người Giám hộ 3' style={{ marginTop: 16 }}>
          <Row gutter={[16, 16]}>
            <Col>
              <Upload
                name="avatar3"
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
                onClick={() => deleteContact(3)}
              >Xoá</Button>
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Họ tên" name="fullName3" rules={[{ required: true, whitespace: true }]}
                placeholder="Nguyễn Văn A" />
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Mã định danh cá nhân / Số CCCD" name="citizenId3" rules={[{ whitespace: true }]}
                placeholder="082194029767" />
            </Col>
          </Row>
          <Row gutter={16} style={{ marginTop: 12 }}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Năm sinh" name="dateOfBirth3">
                <GDatePicker format="YYYY" picker="year" placeholder="2025"  style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Nghề nghiệp" name="occupation3" rules={[{ whitespace: true }]}
                placeholder="Nhập nghề nghiệp" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Số điện thoại" name="phone3" rules={[{ required: true, whitespace: true }]}
                placeholder="932000123" input_props={{ addonBefore: '+84' }} />
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Email" name="email3"
                placeholder="info@gedu.vn" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Mối quan hệ với Học sinh" name="relationship3" rules={[{ required: true, message: 'Chưa chọn Mối quan hệ' }]}>
                <Select placeholder="Chọn" onChange={(e) => { setRelationship3(e) }}>
                  <Select.Option value={StudentContactRelationshipEnum.Cha.enum}>{StudentContactRelationshipEnum.Cha.title}</Select.Option>
                  <Select.Option value={StudentContactRelationshipEnum.Me.enum}>{StudentContactRelationshipEnum.Me.title}</Select.Option>
                  <Select.Option value={StudentContactRelationshipEnum.Khac.enum}>{StudentContactRelationshipEnum.Khac.title}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }} style={{ alignContent: 'center' }}>
              <Form.Item name="is_main_contact3" valuePropName="checked" noStyle>
                <Checkbox
                  onChange={(e) => {
                    if (e.target.checked) {
                      form_step2?.setFieldValue('is_main_contact1', false)
                      form_step2?.setFieldValue('is_main_contact2', false)
                    }
                  }}
                >Là người liên hệ chính</Checkbox>
              </Form.Item>
            </Col>
            {relationship3 === 9 ? <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Mối quan hệ" name="relationshipTitle3" rules={[{ required: true, whitespace: true }]}
                placeholder="Ông bà, cô dì, chú bác, v.v" />
            </Col> : null}
          </Row>
        </TitleSegmentRow> : null
      }
      {/* BUTTON Them giam ho */}
      {count < 3 ?
        <TitleSegmentRow title='' style={{ marginTop: 16 }}>
          <Button icon={<PlusOutlined />} onClick={() => setCount(count + 1)}>Thêm người giám hộ</Button>
        </TitleSegmentRow> : null
      }
    </Form>
  </Col>
}