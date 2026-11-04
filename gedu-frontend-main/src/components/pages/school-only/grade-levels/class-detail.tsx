import { Card, Typography } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ClassDetailProvider, { useClassDetailContext } from "../../../../contexts/school-only/classes/ClassDetailContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links, paths } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import LoadingState from "../../../molecules/loading-state";

const { Title } = Typography
export default function ClassDetail() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.grade_levels.route, title: nav_links.grade_levels.title },
      { title: 'Chi tiết' },
    ], nav_links.class_detail.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <ClassDetailProvider>
    <Content />
  </ClassDetailProvider>
}
function Content() {
  const navigate = useNavigate()
  const { data, fetching } = useClassDetailContext()

  if (fetching)
    return <LoadingState />

  if (!data) return

  return <ContentCover>
    <div style={{ paddingBottom: 20 }}>
      <Title level={3} style={{ margin: 0 }}>
        {data.code}
      </Title>
    </div>
    <Card style={{ flex: 1 }}
      tabProps={{ size: 'middle' }}
      activeTabKey={location.pathname}
      onTabChange={(_key) => navigate(_key)}
      tabList={[
        { label: "Thông tin chung", key: paths.class_detail.replace(':id', data?.id + '') },
        { label: "Chuyên cần & Điểm danh", key: paths.class_detail_attendance.replace(':id', data?.id + '') },
        { label: "Danh sách học sinh", key: paths.class_detail_students.replace(':id', data?.id + '') },
        { label: "Phân công Giảng dạy", key: paths.class_detail_teaching_assignments.replace(':id', data?.id + '') },
        { label: "Thời khoá biểu", key: paths.class_detail_timetable.replace(':id', data?.id + '') },
        { label: "Bảng điểm & Kết quả", key: paths.class_detail_scoreboard.replace(':id', data?.id + '') },
      ]}>
      <Outlet />
    </Card>
  </ContentCover>
}
