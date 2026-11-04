import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import EdAcademicTranscripts from "../components/pages/ed-only/academic-transcripts/ed-academic-transcripts";
import EdCurriculums from "../components/pages/ed-only/curriculums/ed-curriculums";
import EDDashboard from "../components/pages/ed-only/ed-dashboard";
import EdReports from "../components/pages/ed-only/ed-reports/ed-reports";
import EdEMISReports from "../components/pages/ed-only/emis-reports/ed-emis-reports";
import EdLearningMaterials from "../components/pages/ed-only/learning-materials/ed-learning-materials";
import EDPositionDetail from "../components/pages/ed-only/org-structures/ed-position-detail";
import EDPositions from "../components/pages/ed-only/org-structures/ed-positions";
import EDOrgStructures from "../components/pages/ed-only/org-structures/ed_org_structures";
import EduDepartmentDetail from "../components/pages/ed-only/org-structures/edu-department-detail";
import EduDepartments from "../components/pages/ed-only/org-structures/edu-departments";
import ReportMaps from "../components/pages/ed-only/report-maps/ed-report-maps";
import EdResources from "../components/pages/ed-only/resources/ed-resources";
import EdSchoolStaffs from "../components/pages/ed-only/school-staffs/ed-school-staffs";
import SchoolDetail from "../components/pages/ed-only/schools/school-detail";
import SchoolDetailAdmin from "../components/pages/ed-only/schools/school-detail/school-detail-admin";
import SchoolDetailFacility from "../components/pages/ed-only/schools/school-detail/school-detail-facility";
import SchoolDetailInfo from "../components/pages/ed-only/schools/school-detail/school-detail-info";
import SchoolDetailOperation from "../components/pages/ed-only/schools/school-detail/school-detail-operation";
import SchoolImport from "../components/pages/ed-only/schools/school-import";
import SchoolNew from "../components/pages/ed-only/schools/school-new";
import SchoolsPage from "../components/pages/ed-only/schools/schools";
import EdStaffs from "../components/pages/ed-only/staffs/ed-staffs";
import EdSynchronizeData from "../components/pages/ed-only/synchronize-data/ed-synchronize-data";
import UnderConstructionPage from "../components/pages/un-auth/under-construction-page";
import { nav_links } from "../utils/routes";

interface Props {
  path: string,
  element: ReactNode,
  children?: Props[]
}
export const reactDomEDRoutes: Props[] = [
  { path: nav_links.home.route, element: <Navigate to={nav_links.ed_dashboard.route} replace /> },
  { path: nav_links.ed_dashboard.route, element: <EDDashboard /> },
  { path: nav_links.ed_reports.route, element: <EdReports /> },
  { path: nav_links.ed_emis_reports.route, element: <EdEMISReports /> },
  { path: nav_links.report_maps.route, element: <ReportMaps /> },
  { path: nav_links.ed_curriculums.route, element: <EdCurriculums /> },
  { path: nav_links.ed_academic_transcripts.route, element: <EdAcademicTranscripts /> },
  { path: nav_links.ed_learning_materials.route, element: <EdLearningMaterials /> },
  { path: nav_links.ed_school_staffs.route, element: <EdSchoolStaffs /> },
  { path: nav_links.ed_staffs.route, element: <EdStaffs /> },
  { path: nav_links.ed_resources.route, element: <EdResources /> },
  {
    path: nav_links.ed_org_structures.route, element: <EDOrgStructures />, children: [
      { path: nav_links.ed_org_structures.route, element: <Navigate to={nav_links.edu_departments.route} replace /> },
      { path: nav_links.edu_departments.route, element: <EduDepartments /> },
      { path: nav_links.edu_department_detail.route, element: <EduDepartmentDetail /> },
      { path: nav_links.ed_positions.route, element: <EDPositions /> },
      { path: nav_links.ed_position_detail.route, element: <EDPositionDetail /> },
    ]
  },
  { path: nav_links.ed_synchronize_data.route, element: <EdSynchronizeData /> },

  { path: nav_links.schools.route, element: <SchoolsPage /> },
  { path: nav_links.school_new.route, element: <SchoolNew /> },
  { path: nav_links.school_import.route, element: <SchoolImport /> },
  {
    path: nav_links.school_detail.route, element: <SchoolDetail />, children: [
      { path: nav_links.school_detail.route, element: <SchoolDetailInfo /> },
      { path: nav_links.school_detail_admin.route, element: <SchoolDetailAdmin /> },
      { path: nav_links.school_detail_operation.route, element: <SchoolDetailOperation /> },
      { path: nav_links.school_detail_facility.route, element: <SchoolDetailFacility /> },
    ]
  },
  { path: nav_links.school_admin_new.route, element: <SchoolNew /> },

  { path: nav_links.under_construction.route, element: <UnderConstructionPage /> },
]