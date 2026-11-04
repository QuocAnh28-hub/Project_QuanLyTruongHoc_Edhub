import { Typography } from "antd";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import StaffDetailProvider, { useStaffDetailContext } from "../../../../contexts/school-only/staffs/StaffDetailContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { ToFullNameByLocale } from "../../../../utils/locale-helpers";
import { nav_links, paths } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import ContentSplitCard from "../../../atoms/content-split-card";
import LoadingState from "../../../molecules/loading-state";
import StaffCard from "./staff-detail/staff-card";

const { Title } = Typography

export default function SchoolStaffDetail() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.staffs.route, title: nav_links.staffs.title },
      { title: 'Chi tiết' },
    ], nav_links.staff_detail.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StaffDetailProvider>
    <Content />
  </StaffDetailProvider>
}
function Content() {
  const navigate = useNavigate()
  const { data, fetching } = useStaffDetailContext()
  if (fetching)
    return <LoadingContent />
  if (!data) return
  return <ContentCover>
    <div style={{ paddingBottom: 20 }}>
      <Title level={3} style={{ margin: 0 }}>
        #{data.code || data.id + ' - ' + ToFullNameByLocale(data.firstName, data.lastName)}
      </Title>
    </div>
    <ContentSplitCard side={<StaffCard />}
      activeTabKey={location.pathname}
      onTabChange={(_key) => navigate(_key)}
      tabItems={[
        { label: 'Thông tin cá nhân', key: paths.staff_detail.replace(':id', data.id + '') },
        { label: 'Chuyên môn & Giảng dạy', key: paths.staff_detail_major.replace(':id', data.id + '') },
        { label: 'Hợp đồng & Chế độ', key: paths.staff_detail_contract.replace(':id', data.id + '') },
        { label: 'Khen thưởng & Kỷ luật', key: paths.staff_detail_rewards.replace(':id', data.id + '') },
        { label: 'Hồ sơ Văn bản', key: paths.staff_detail_folders.replace(':id', data.id + '') },
      ]}>
      <Outlet />
    </ContentSplitCard>
  </ContentCover>
}
function LoadingContent() {
  return <LoadingState />
}
