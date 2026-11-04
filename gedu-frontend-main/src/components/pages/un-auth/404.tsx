import { Button, Flex, Result } from 'antd'
import { useNavigate } from 'react-router-dom'
export default function Page404() {
  const navigate = useNavigate()
  return <Flex justify='center'>
    <Result
      status="404"
      title="404"
      subTitle="Trang không tồn tại"
      extra={
        <Button type="primary"
          onClick={() => { navigate('', { replace: true }) }}
        >Về trang chủ</Button>
      }
    />
  </Flex>
}