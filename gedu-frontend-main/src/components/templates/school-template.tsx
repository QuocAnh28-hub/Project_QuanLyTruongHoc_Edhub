import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import SchoolLayoutProvider, { useLayoutContext } from '../../contexts/SchoolLayoutContext';
import { PAGE_HEADER_ZINDEX, PAGE_MAX_WIDTH } from '../../utils/constants';
import Breadcrumbs from '../atoms/breadcrumb';
import SchoolTemplateHeader from '../organisms/school-only/school-template-header';
import SchoolTemplateSider from '../organisms/school-only/school-template-sider';

const { Content } = Layout;
export default function SchoolTemplate() {
  return <SchoolLayoutProvider>
    <Layout style={{ minHeight: '100vh', maxWidth: PAGE_MAX_WIDTH, margin: 'auto' }}>
      <SchoolTemplateHeader />
      <Layout style={{ marginTop: 64, height: 'calc(100vh - 64px)' }}>
        <SchoolTemplateSider />
        <LayoutContent />
      </Layout>
    </Layout>
  </SchoolLayoutProvider>
}
function LayoutContent() {
  const { breadcrumb } = useLayoutContext()
  return <Content style={{ display: 'flex', flexDirection: 'column', padding: '0 24px 24px', overflow: 'auto' }}>
    {breadcrumb?.length ?
      <div style={{
        paddingTop: 16, paddingBottom: 16,
        position: 'sticky', top: 0, zIndex: PAGE_HEADER_ZINDEX,
        backgroundColor: 'var(--background-color)'
      }}>
        <Breadcrumbs
          items={breadcrumb}
        />
      </div>
      : null}
    <Outlet />
  </Content>
}