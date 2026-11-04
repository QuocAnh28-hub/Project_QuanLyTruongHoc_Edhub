import { Alert, Button, Card, Checkbox, Col, Form, Input, Row, Typography } from "antd";
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAppContext } from "../../../contexts/AppContext";
import { callPublicPost, fetching_apis } from "../../../utils/api-helpers";
import { STARTED_SCHOOL_ORG_ID } from "../../../utils/constants";
import { nav_links } from "../../../utils/routes";
export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState<boolean>(false)
  const [alert, setAlert] = useState<string>('')
  const { afterLogin } = useAppContext();
  const navigate = useNavigate();
  const onFinish = async (data: { email: string; password: string; remember: boolean }) => {
    setLoading(true)
    setAlert('')
    try {
      const response = await callPublicPost(fetching_apis.login, {
        "email": data.email?.trim(),
        "password": data.password
      })
      if (response?.response) {
        const orgId = response?.response.user?.orgId
        if (!orgId || (orgId != 1 && orgId < STARTED_SCHOOL_ORG_ID)) {
          setAlert('Email hoặc mật khẩu không đúng. Vui lòng thử lại')
        } else {
          afterLogin(response.response, data.remember)
          const _from = searchParams.get('from')
          navigate(_from ? _from : nav_links.home.route, { replace: true });
        }
      } else {
        setAlert('Email hoặc mật khẩu không đúng. Vui lòng thử lại')
      }
      setLoading(false)
    } catch (_err) {
      setAlert('Email hoặc mật khẩu không đúng. Vui lòng thử lại')
      setLoading(false)
    }
  };

  return <Row style={{ margin: "auto", padding: 24, width: '100%', height: '100vh' }} justify="space-evenly" align='middle' wrap={false}>
    {/* Draw an oval */}
    <div style={{ backgroundColor: '#1677FF', position: 'fixed', borderRadius: '50%', top: '50%', width: '120%', height: '100%', }} />

    <Col style={{ position: 'relative' }}><img src="./education-book.svg" style={{ maxWidth: '100%' }} /></Col>
    <Col>
      <Card styles={{ body: { padding: 0 } }} style={{ width: 576, maxWidth: '100%', padding: '102px 60px', textAlign: "center" }}>
        <Typography.Title level={1} style={{ marginTop: 0 }}>Đăng nhập</Typography.Title>
        <Form
          size="large"
          layout="vertical"
          initialValues={{
            remember: false,
          }}
          onFinish={onFinish}
        >
          <Form.Item
            label="Email" name="email"
            rules={[
              {
                required: true,
                whitespace: true,
                message: 'Chưa nhập email',
              },
            ]}
          >
            <Input placeholder="Nhập Email làm việc" />
          </Form.Item>
          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              {
                required: true,
                message: 'Mật khẩu không được để trống',
              },
            ]}
          >
            <Input.Password
              placeholder="Nhập mật khẩu"
              autoComplete="current-password"
            />
          </Form.Item>
          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox style={{ float: 'left' }}>Ghi nhớ tôi</Checkbox>
            </Form.Item>
            <a style={{ float: 'right' }} href={nav_links.forgot_password.route}>
              Quên mật khẩu?
            </a>
          </Form.Item>
          {alert && <Alert message={alert} type="error" style={{ marginBottom: 16 }} />}
          <Form.Item>
            <Button type="primary" htmlType="submit" block loading={loading}>
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </Col>
  </Row>
}