import { Button, Checkbox, Col, Flex, Form, Row, Select, Upload } from "antd"
import dayjs from "dayjs"
import { useState } from "react"
import { useAppContext } from "../../../../../../contexts/AppContext"
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext"
import { useStudentStudentContactContext } from "../../../../../../contexts/school-only/students/contacts/StudentStudentContactContext"
import { useLayoutContext } from "../../../../../../contexts/SchoolLayoutContext"
import { StudentContactRelationshipEnum } from "../../../../../../models/enums"
import { StudentContact } from "../../../../../../models/student-model"
import { SplitNameByLocale, ToFullNameByLocale } from "../../../../../../utils/locale-helpers"
import GCard from "../../../../../atoms/g-card"
import GDatePicker from "../../../../../atoms/g-date-picker"
import GFormItemInput from "../../../../../atoms/g-form-item-input"
import GText from "../../../../../atoms/g-text"
import { CheckOutlined, CloseOutlined, PlusOutlined } from "../../../../../atoms/svg/outlined-icons"
import ForbiddenState from "../../../../../molecules/forbidden-state"


const StudentContactCardUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StudentContactCardUpdate

function Content() {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const [form] = Form.useForm()
  const { setBlock } = useRouterBlockerContext()
  const { contact, loading,
    is_main_contact, can_grant_access,
    setEditMode, updateStudentContact
  } = useStudentStudentContactContext()
  const [relationship, setRelationship] = useState<number | undefined>(contact?.relationship)

  function handleUpdate() {
    if (!contact) return
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const _form_data = form.getFieldsValue()

      let relationshipTitle = ''
      const { firstName, lastName } = SplitNameByLocale(_form_data.fullName)
      switch (_form_data.relationship) {
        case StudentContactRelationshipEnum.Cha.enum:
          relationshipTitle = StudentContactRelationshipEnum.Cha.title
          break
        case StudentContactRelationshipEnum.Me.enum:
          relationshipTitle = StudentContactRelationshipEnum.Me.title
          break
        case StudentContactRelationshipEnum.Khac.enum:
          relationshipTitle = _form_data.relationshipTitle
          break
        default:
          break
      }

      if (_form_data.dateOfBirth) {
        const year = new Date(_form_data.dateOfBirth).getFullYear();
        _form_data.dateOfBirth = new Date(Date.UTC(year, 0, 1, 0, 30, 0));
      }

      const __contact = {
        id: contact.id,
        email: _form_data.email,
        firstName: firstName,
        lastName: lastName,
        isMainContact: _form_data.is_main_contact,
        grantAccess: _form_data.can_grant_access,
        phone: _form_data.phone,
        relationship: _form_data.relationship,
        relationshipTitle: relationshipTitle,
        citizenId: _form_data.citizenId,
        dateOfBirth: _form_data.dateOfBirth,
        occupation: _form_data.occupation,
      } as StudentContact
      const res = await updateStudentContact(contact.id, __contact)
      if (!res) return
      setEditMode(false)
    })
  }
  if (!authority?.can_touch_student) return <ForbiddenState onBack={() => setEditMode(false)} />
  if (!contact) return null
  return <Form layout="vertical" form={form}
    initialValues={{
      ...contact,
      is_main_contact, can_grant_access,
      dateOfBirth: contact.dateOfBirth ? dayjs(contact.dateOfBirth) : null,
      fullName: ToFullNameByLocale(contact.firstName, contact.lastName)
    }}
    onValuesChange={(_value) => setBlock(true)}>
    <GCard key={contact.id} type="secondary">
      <Flex vertical gap={16} flex='auto'>
        <Flex flex='auto' justify="space-between" gap={12} wrap='wrap-reverse'>
          <Flex gap={12} align="center">
            <Flex>
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
            </Flex>
            <Flex flex='auto'>
              <Flex gap={8} vertical>
                <GText>Ảnh đại diện</GText>
                <ul style={{ margin: 0, paddingLeft: 24 }}>
                  <li>Kích cỡ: 128 x 128 pixel </li>
                  <li>Dung lượng tối đa: 1MB </li>
                  <li>Định dạng: JPEG, PNG</li>
                </ul>
              </Flex>
            </Flex>
          </Flex>
          <Flex gap={8} flex='auto' justify="end">
            <Button size="small" icon={<CloseOutlined />}
              loading={loading}
              onClick={() => setEditMode(false)}
            >Huỷ bỏ</Button>
            <Button size="small" type="primary" icon={<CheckOutlined />}
              loading={loading}
              onClick={() => handleUpdate()}
            >Lưu</Button>
          </Flex>
        </Flex>
        <Flex vertical flex='auto'>

          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Họ tên" name="fullName" rules={[{ required: true, whitespace: true }]}
                placeholder="Nguyễn Văn A" />
            </Col>

            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Mã định danh cá nhân / Số CCCD" name="citizenId" rules={[{ whitespace: true }]}
                placeholder="123456789" />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Năm sinh" name="dateOfBirth">
                <GDatePicker format="YYYY" picker="year" style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Nghề nghiệp" name="occupation"
                placeholder="Kỹ sư, Giáo viên, Bác sĩ, v.v" />
            </Col>
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Số điện thoại" name="phone" rules={[{ required: true, whitespace: true }]}
                placeholder="932000123" input_props={{ addonBefore: '+84', disabled: !contact.status || contact.status == 1 ? false : true }}
              />
            </Col>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <GFormItemInput label="Email" name="email"
                placeholder="info@gedu.vn" />
            </Col>
          </Row>

          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Mối quan hệ với Học sinh" name="relationship" rules={[{ required: true, message: 'Chưa chọn Mối quan hệ' }]}>
                <Select placeholder="Chọn" onChange={(e) => { setRelationship(e) }}>
                  <Select.Option value={StudentContactRelationshipEnum.Cha.enum}>{StudentContactRelationshipEnum.Cha.title}</Select.Option>
                  <Select.Option value={StudentContactRelationshipEnum.Me.enum}>{StudentContactRelationshipEnum.Me.title}</Select.Option>
                  <Select.Option value={StudentContactRelationshipEnum.Khac.enum}>{StudentContactRelationshipEnum.Khac.title}</Select.Option>
                </Select>
              </Form.Item>
            </Col>
            {relationship === 9 ?
              <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                <GFormItemInput label="Mối quan hệ" name="relationshipTitle" rules={[{ required: true, whitespace: true }]}
                  placeholder="Ông bà, cô dì, chú bác, v.v" />
              </Col>
              : null
            }
          </Row>
          <Row gutter={16} style={{ marginTop: 12 }}>
            <Form.Item name="can_grant_access" valuePropName="checked" noStyle>
              <Checkbox>Kích hoạt tài khoản ứng dụng Gedu cho SĐT này</Checkbox>
            </Form.Item>
          </Row>
          <Row gutter={16}>

            <Form.Item name="is_main_contact" valuePropName="checked" noStyle>
              <Checkbox>Là người liên hệ chính</Checkbox>
            </Form.Item>
          </Row>
        </Flex>
      </Flex>
    </GCard>
  </Form>
}