import { Card } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import SchoolDetailProvider, { useSchoolDetailContext } from "../../../../contexts/ed-only/SchoolDetailContext";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links, paths } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GTitle from "../../../atoms/g-title";
import LoadingState from "../../../molecules/loading-state";

export default function SchoolDetail() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { path: nav_links.schools.route, title: nav_links.schools.title },
      { title: nav_links.school_detail.title },
    ], nav_links.school_detail.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <SchoolDetailProvider>
    <Content />
  </SchoolDetailProvider>
}
function Content() {
  const navigate = useNavigate()
  const { data, fetching } = useSchoolDetailContext()
  if (fetching)
    return <LoadingContent />
  if (!data) return null
  return <ContentCover>
    <div style={{ paddingBottom: 20 }}>
      <GTitle level={3}>
        {data?.name}
      </GTitle>
    </div>
    <Card style={{ flex: 1 }}
      tabProps={{ size: 'middle' }}
      activeTabKey={location.pathname}
      onTabChange={(_key) => navigate(_key)}
      tabList={[
        { label: 'Thông tin trường', key: paths.school_detail.replace(':id', data.id + '') },
        { label: 'Quản trị viên Trường', key: paths.school_detail_admin.replace(':id', data.id + '') },
        { label: 'Đặc điểm Chất lượng & Vận hành', key: paths.school_detail_operation.replace(':id', data.id + '') },
        { label: 'Cơ sở vật chất', key: paths.school_detail_facility.replace(':id', data.id + '') },
      ]}
    >
      <Outlet />
    </Card>
  </ContentCover>
}
function LoadingContent() {
  return <LoadingState />
}