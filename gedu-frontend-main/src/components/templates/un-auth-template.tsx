import { Flex, Layout } from "antd";
import { Outlet } from "react-router-dom";
import { PAGE_MAX_WIDTH } from "../../utils/constants";

export default function UnAuthTemplate() {
  return <Layout style={{ minHeight: "100vh", width: '100%', justifySelf: 'center', backgroundColor: '#FAFBFD' }}>
    <Flex style={{ minHeight: "100vh", width: PAGE_MAX_WIDTH, maxWidth: '100%', margin: 'auto' }}>
      <Outlet />
    </Flex>
  </Layout>
}