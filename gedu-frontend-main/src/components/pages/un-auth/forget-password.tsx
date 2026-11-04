import { LoadingOutlined } from "@ant-design/icons";
import { Alert, Button, Card, Col, Flex, Form, Input, Row, Typography } from "antd";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { callPublicPost, fetching_apis } from "../../../utils/api-helpers";
import debounce from "../../../utils/debounce";
import { nav_links } from "../../../utils/routes";
import { CheckCircleFilled } from "../../atoms/svg/filled-icons";
import { ArrowLeftOutlined } from "../../atoms/svg/outlined-icons";
export default function ForgotPassword() {
  const [form] = Form.useForm()
  const [alert, setAlert] = useState<string>('')
  const [sent, setSent] = useState(false)
  const [fetching, setFetching] = useState(false)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();
  const onDebounce = debounce(() => { setLoading(false) }, 15000)
  const onFinish = async () => {
    setLoading(true)
    onDebounce()
    setAlert('')
    setFetching(true)
    const email = form.getFieldValue('email')
    try {
      const response = await callPublicPost(fetching_apis.forgot_password, { email })
      if (response?.response) {
        setSent(true)
      } else {
        setAlert('Email hoặc mật khẩu không đúng. Vui lòng thử lại')
      }
    } catch {
      setAlert('Email hoặc mật khẩu không đúng. Vui lòng thử lại')
    }
    setFetching(false)
  };
  return <Row style={{ margin: "auto", padding: 24, width: '100%', height: '100vh' }} justify="space-evenly" align='middle' wrap={false}>
    {/* Draw an oval */}
    <div style={{ backgroundColor: '#1677FF', position: 'fixed', borderRadius: '50%', top: '50%', width: '120%', height: '100%', }} />
    <Col style={{ position: 'relative' }}><img src="./education-book.svg" style={{ maxWidth: '100%' }} /></Col>
    <Col>
      {sent ?
        <Card styles={{ body: { padding: '0 32px' } }}
          style={{
            width: 576, maxWidth: '100%',
            padding: '102px 60px',
            textAlign: "center",
            position: 'relative'
          }}>
          <Button icon={<ArrowLeftOutlined size={32} />}
            style={{
              position: 'absolute', zIndex: 1,
              top: 102, left: 92
            }}
            onClick={() => setSent(false)}
          />
          <Row align='middle'>
            <Col flex='auto' style={{ textAlign: 'center' }}>
              {fetching ?
                <LoadingOutlined style={{ fontSize: '72px' }} /> :
                <CheckCircleFilled size={72} fill='var(--success)' />
              }
            </Col>
          </Row>
          <Row style={{ marginTop: 24 }} justify='center' align='middle'>
            <Typography.Title level={3} style={{ margin: 0 }}>Đã gửi mật khẩu mới!</Typography.Title>
            <Typography.Text style={{ marginTop: 8 }}>
              Vui lòng kiểm tra hộp thư đến (bao gồm cả thư mục Spam/Rác) để nhận mật khẩu. Email có thể mất vài phút để đến nơi.
            </Typography.Text>
          </Row>
          <Row style={{ marginTop: 24 }} justify='center'>
            <Button type="primary" htmlType="submit"
              onClick={() => navigate(nav_links.login.route)}
              loading={fetching}>
              Đăng nhập lại
            </Button>
            <Flex style={{ marginTop: 16 }} align="center">
              <Typography.Text>Chưa nhận được mật khẩu mới?</Typography.Text>
              <Button type="link" loading={loading} onClick={onFinish} iconPosition="end">Gửi lại mật khẩu</Button>
            </Flex>
          </Row>
        </Card>
        :
        <Card styles={{ body: { padding: 0 } }} style={{ width: 576, maxWidth: '100%', padding: '102px 60px', textAlign: "center" }}>
          <Row align='middle'>
            <Col>
              <Button icon={<ArrowLeftOutlined size={32} />} onClick={() => navigate(nav_links.login.route, { replace: true })} />
            </Col>
            <Col flex='auto' style={{ textAlign: 'center' }}><Typography.Title level={1} style={{ margin: 0 }}>Quên mật khẩu</Typography.Title></Col>
          </Row>
          <Row style={{ marginTop: 24 }}>
            <Typography.Text>
              Vui lòng nhập địa chỉ email công việc mà bạn đã đăng ký. Chúng tôi sẽ gửi mật khẩu mới đến hộp thư của bạn.
            </Typography.Text>
          </Row>
          <Form form={form}
            style={{ marginTop: 24 }}
            size="large"
            layout="vertical"
            onFinish={onFinish}
          >
            <Form.Item required
              label="Email" name="email"
              rules={[{ required: true, whitespace: true }]}
            >
              <Input placeholder="Nhập Email làm việc" />
            </Form.Item>
            {alert && <Alert message={alert} type="error" style={{ marginBottom: 16 }} />}
            <Form.Item>
              <Button type="primary" htmlType="submit" block loading={fetching}>
                Gửi mật khẩu mới
              </Button>
            </Form.Item>
          </Form>
        </Card>
      }
    </Col>
  </Row>
}