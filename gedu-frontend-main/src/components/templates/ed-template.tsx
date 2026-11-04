import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import EDLayoutProvider, { useLayoutContext } from '../../contexts/EDLayoutContext';
import { PAGE_HEADER_ZINDEX, PAGE_MAX_WIDTH } from '../../utils/constants';
import Breadcrumbs from '../atoms/breadcrumb';
import EDTemplateHeader from '../organisms/ed-only/ed-template-header';
import EDTemplateSider from '../organisms/ed-only/ed-template-sider';
import './ed-styles.css';

const { Content } = Layout;
export default function EDTemplate() {
  return <EDLayoutProvider>
    <Layout style={{ minHeight: '100vh', maxWidth: PAGE_MAX_WIDTH, margin: 'auto' }}>
      <EDTemplateHeader />
      <Layout style={{ marginTop: 64, height: 'calc(100vh - 64px)' }}>
        <EDTemplateSider />
        <LayoutContent />
      </Layout>
    </Layout>
  </EDLayoutProvider>
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