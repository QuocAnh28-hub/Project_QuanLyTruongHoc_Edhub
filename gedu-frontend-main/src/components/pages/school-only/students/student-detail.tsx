import { Typography } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StudentDetailProvider, { useStudentDetailContext } from "../../../../contexts/school-only/students/StudentDetailContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { ToFullNameByLocale } from "../../../../utils/locale-helpers";
import { nav_links, paths } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import ContentSplitCard from "../../../atoms/content-split-card";
import LoadingState from "../../../molecules/loading-state";
import StudentCard from "./student-detail/student-card";

const { Title } = Typography
export default function StudentDetail() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.students.route, title: nav_links.students.title },
      { title: 'Chi tiết' },
    ], nav_links.student_detail.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StudentDetailProvider>
    <Content />
  </StudentDetailProvider>
}
function Content() {
  const navigate = useNavigate()
  const { data, fetching } = useStudentDetailContext()
  if (fetching)
    return <LoadingContent />
  if (!data) return
  return <ContentCover>
    <div style={{ paddingBottom: 20 }}>
      <Title level={3} style={{ margin: 0 }}>
        #{data.code + ' - ' + ToFullNameByLocale(data.firstName, data.lastName)}
      </Title>
    </div>
    <ContentSplitCard side={<StudentCard />}
      activeTabKey={location.pathname}
      onTabChange={(_key) => navigate(_key)}
      tabItems={[
        { label: "Thông tin cá nhân", key: paths.student_detail.replace(':id', data.id + '') },
        { label: "Học vụ & Chính sách", key: paths.student_detail_special_policies.replace(':id', data.id + '') },
        { label: "Thông tin Sức khoẻ", key: paths.student_detail_medical_info.replace(':id', data.id + '') }
      ]}>
      <Outlet />
    </ContentSplitCard>
  </ContentCover>
}
function LoadingContent() {
  return <LoadingState />
}
