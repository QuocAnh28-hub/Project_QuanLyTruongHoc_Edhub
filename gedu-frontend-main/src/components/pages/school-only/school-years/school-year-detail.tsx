import { Card, Typography } from "antd";
import { useEffect } from "react";
import SchoolYearDetailProvider, { useSchoolYearDetailContext } from "../../../../contexts/school-only/school-years/SchoolYearDetailContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import LoadingState from "../../../molecules/loading-state";
import UnderConstructionPage from "../../un-auth/under-construction-page";
import SchoolYearDetailUpdate from "./school-year-detail/school-year-detail-update";
import SchoolYearDetailView from "./school-year-detail/school-year-detail-view";

const { Title } = Typography
export default function SchoolYearDetail() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.school_dashboard.route, title: nav_links.school_dashboard.title },
      { path: nav_links.school_years.route, title: nav_links.school_years.title },
      { title: 'Chi tiết' },
    ], nav_links.school_year_detail.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <SchoolYearDetailProvider>
    <Content />
  </SchoolYearDetailProvider>
}
function Content() {
  const { school_year, fetching, update_mode } = useSchoolYearDetailContext()
  if (fetching)
    return <LoadingContent />
  //if (!data) return null 
  if (!school_year) return <UnderConstructionPage />
  return <ContentCover>
    <div style={{ paddingBottom: 20 }}>
      <Title level={3} style={{ margin: 0 }}>
        {school_year.title}
      </Title>
    </div>
    <Card style={{ flex: 1 }}>
      {update_mode ? <SchoolYearDetailUpdate /> : <SchoolYearDetailView />}
    </Card>
  </ContentCover>
}
function LoadingContent() {
  return <LoadingState />
}