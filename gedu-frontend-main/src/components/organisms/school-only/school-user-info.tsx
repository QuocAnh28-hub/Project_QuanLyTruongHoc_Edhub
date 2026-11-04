import { Avatar, Col, Flex, Form, Input, Modal, Row } from "antd"
import { useMemo } from "react"
import { useAppContext } from "../../../contexts/AppContext"
import { useLayoutContext } from "../../../contexts/SchoolLayoutContext"
import { ToAvatarLetters, ToFullNameByLocale } from "../../../utils/locale-helpers"
import GText from "../../atoms/g-text"
import GTitle from "../../atoms/g-title"

interface Props {
  close: () => void
}
export default function SchoolUserInfo({ close }: Props) {
  const { account, changePassword } = useAppContext()
  const { callMessage } = useLayoutContext()
  const full_name = useMemo(() => {
    return ToFullNameByLocale(account?.first_name, account?.last_name)
  }, [account])
  const [form] = Form.useForm();

  function handleOk() {
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (!is_err) {
        const req = form.getFieldsValue()
        if (req.new_password != req.confirm_password) {
          callMessage('Mật khẩu mới và Mật khẩu nhập lại không khớp', 'error')
          return
        }
        const { data, error } = await changePassword(req.current_password, req.new_password)
        if (data) {
          callMessage('Cập nhật mật khẩu thành công', 'success')
          close()
        } else {
          if (error?.message) {
            callMessage(error.message, 'error')
          } else {
            callMessage('Có lỗi trong quá trình cập nhật', 'error')
          }
        }
      }
    })
  }

  return <Modal centered
    open={true}
    maskClosable={false}
    title='Tài khoản'
    cancelText="Huỷ bỏ"
    okText='Lưu thay đổi'
    onOk={handleOk}
    //confirmLoading={loading}
    onCancel={() => {
      //if (loading) return
      close()
    }}
    footer={(_, { CancelBtn, OkBtn }) => (
      <>
        <CancelBtn />
        <OkBtn />
      </>
    )}
  >
    <Flex vertical gap={32} style={{ paddingTop: 16, paddingBottom: 16 }}>
      <Flex vertical gap={24}>
        <GTitle level={5}>Thông tin chung</GTitle>
        <Flex vertical gap={16}>
          <Avatar size={64}>{ToAvatarLetters(account?.first_name, account?.last_name)}</Avatar>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Họ tên</Col>
            <Col xs={24} lg={{ flex: 'auto' }}><GText>{full_name}</GText></Col>
          </Row>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Phòng ban</Col>
            <Col xs={24} lg={{ flex: 'auto' }}><GText>{account?.department_name}</GText></Col>
          </Row>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Chức danh</Col>
            <Col xs={24} lg={{ flex: 'auto' }}><GText>{account?.position_title}</GText></Col>
          </Row>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Email</Col>
            <Col xs={24} lg={{ flex: 'auto' }}><GText>{account?.user_name}</GText></Col>
          </Row>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Số điện thoại</Col>
            <Col xs={24} lg={{ flex: 'auto' }}><GText>{account?.phone}</GText></Col>
          </Row>
        </Flex>
      </Flex>
    </Flex>
    <Flex vertical gap={24}>
      <Flex vertical gap={4}>
        <GTitle level={5}>Đổi mật khẩu</GTitle>
        <GText>Mật khẩu phải chứa tối thiểu 12 ký tự, 1 ký tự viết thường và 1 ký tự đặc biệt.</GText>
      </Flex>
      <Form form={form}>
        <Flex vertical gap={0}>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Mật khẩu hiện tại</Col>
            <Col xs={24} lg={{ flex: 'auto' }}>
              <Form.Item label="" name='current_password' rules={[{ required: true, message: 'Chưa nhập thông tin' }]}>
                <Input.Password placeholder="Nhập mật khẩu hiện tại" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Mật khẩu mới</Col>
            <Col xs={24} lg={{ flex: 'auto' }}>
              <Form.Item label="" name='new_password' rules={[{ required: true }]}>
                <Input.Password placeholder="Nhập mật khẩu mới" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[24, 4]}>
            <Col xs={24} lg={{ flex: '179px' }}>Nhập lại mật khẩu mới</Col>
            <Col xs={24} lg={{ flex: 'auto' }}>
              <Form.Item label="" name='confirm_password' rules={[{ required: true }]}>
                <Input.Password placeholder="Nhập lại mật khẩu mới" />
              </Form.Item>
            </Col>
          </Row>
        </Flex>
      </Form>
    </Flex>
  </Modal>
}