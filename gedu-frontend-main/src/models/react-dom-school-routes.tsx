import { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import CurriculumDetail from "../components/pages/school-only/curriculums/curriculum-detail";
import Curriculums from "../components/pages/school-only/curriculums/curriculums";
import CurriculumsSubjects from "../components/pages/school-only/curriculums/curriculums-subjects";
import SubjectDetail from "../components/pages/school-only/curriculums/subject-detail";
import Subjects from "../components/pages/school-only/curriculums/subjects";
import ClassDetail from "../components/pages/school-only/grade-levels/class-detail";
import ClassDetailAttendance from "../components/pages/school-only/grade-levels/class-detail/class-detail-attendance";
import ClassDetailInfo from "../components/pages/school-only/grade-levels/class-detail/class-detail-info";
import ClassDetailScoreboard from "../components/pages/school-only/grade-levels/class-detail/class-detail-scoreboard";
import ClassDetailStudents from "../components/pages/school-only/grade-levels/class-detail/class-detail-students";
import ClassDetailTeachingAssignments from "../components/pages/school-only/grade-levels/class-detail/class-detail-teaching-assignments";
import ClassDetailTimetable from "../components/pages/school-only/grade-levels/class-detail/class-detail-timetable";
import ClassNew from "../components/pages/school-only/grade-levels/class-new";
import ClassesNew from "../components/pages/school-only/grade-levels/classes-new";
import GradeLevelDetail from "../components/pages/school-only/grade-levels/grade-level-detail";
import GradeLevels from "../components/pages/school-only/grade-levels/grade-levels";
import SchoolDepartmentDetail from "../components/pages/school-only/org-structures/school-department-detail";
import SchoolDepartments from "../components/pages/school-only/org-structures/school-departments";
import SchoolPositionDetail from "../components/pages/school-only/org-structures/school-position-detail";
import SchoolPositions from "../components/pages/school-only/org-structures/school-positions";
import SchoolOrgStructures from "../components/pages/school-only/org-structures/school_org_structures";
import SchoolDashboard from "../components/pages/school-only/school-dashboard";
import SchoolYearDetail from "../components/pages/school-only/school-years/school-year-detail";
import SchoolYearNew from "../components/pages/school-only/school-years/school-year-new";
import SchoolYears from "../components/pages/school-only/school-years/school-years";
import SchoolStaffDetail from "../components/pages/school-only/staffs/staff-detail";
import StaffDetailContract from "../components/pages/school-only/staffs/staff-detail/staff-detail-contract";
import StaffDetailFolders from "../components/pages/school-only/staffs/staff-detail/staff-detail-folders";
import StaffDetailInfo from "../components/pages/school-only/staffs/staff-detail/staff-detail-info";
import StaffDetailMajor from "../components/pages/school-only/staffs/staff-detail/staff-detail-major";
import StaffDetailRewards from "../components/pages/school-only/staffs/staff-detail/staff-detail-rewards";
import SchoolStaffNew from "../components/pages/school-only/staffs/staff-new";
import SchoolStaffs from "../components/pages/school-only/staffs/staffs";
import StaffsImport from "../components/pages/school-only/staffs/staffs-import";
import StudentDetail from "../components/pages/school-only/students/student-detail";
import StudentDetailInfo from "../components/pages/school-only/students/student-detail/student-detail-info";
import StudentDetailMedicalInfo from "../components/pages/school-only/students/student-detail/student-detail-medical-info";
import StudentDetailSpecialPolicies from "../components/pages/school-only/students/student-detail/student-detail-special-policies";
import StudentNew from "../components/pages/school-only/students/student-new";
import Students from "../components/pages/school-only/students/students";
import StudentsImport from "../components/pages/school-only/students/students-import";
import UnderConstructionPage from "../components/pages/un-auth/under-construction-page";
import { nav_links } from "../utils/routes";

interface Props {
  path: string,
  element: ReactNode,
  children?: Props[]
}
export const reactDomSchoolRoutes: Props[] = [
  { path: nav_links.home.route, element: <Navigate to={nav_links.school_dashboard.route} replace /> },
  { path: nav_links.school_dashboard.route, element: <SchoolDashboard /> },
  { path: nav_links.staffs.route, element: <SchoolStaffs /> },
  { path: nav_links.staff_import.route, element: <StaffsImport /> },
  { path: nav_links.staff_new.route, element: <SchoolStaffNew /> },
  {
    path: nav_links.staff_detail.route, element: <SchoolStaffDetail />, children: [
      { path: nav_links.staff_detail.route, element: <StaffDetailInfo /> },
      { path: nav_links.staff_detail_major.route, element: <StaffDetailMajor /> },
      { path: nav_links.staff_detail_contract.route, element: <StaffDetailContract /> },
      { path: nav_links.staff_detail_rewards.route, element: <StaffDetailRewards /> },
      { path: nav_links.staff_detail_folders.route, element: <StaffDetailFolders /> },
    ]
  },
  { path: nav_links.students.route, element: <Students /> },
  { path: nav_links.student_import.route, element: <StudentsImport /> },
  { path: nav_links.student_new.route, element: <StudentNew /> },
  {
    path: nav_links.student_detail.route, element: <StudentDetail />, children: [
      { path: nav_links.student_detail.route, element: <StudentDetailInfo /> },
      { path: nav_links.student_detail_special_policies.route, element: <StudentDetailSpecialPolicies /> },
      { path: nav_links.student_detail_medical_info.route, element: <StudentDetailMedicalInfo /> },
    ]
  },
  { path: nav_links.school_years.route, element: <SchoolYears /> },
  { path: nav_links.school_year_new.route, element: <SchoolYearNew /> },
  { path: nav_links.school_year_detail.route, element: <SchoolYearDetail /> },

  {
    path: nav_links.grade_levels.route, element: <GradeLevels />, children: [
      { path: nav_links.grade_levels.route, element: <GradeLevelDetail /> },
      { path: nav_links.grade_level_detail.route, element: <GradeLevelDetail /> },
    ]
  },
  { path: nav_links.class_new.route, element: <ClassNew /> },
  {
    path: nav_links.class_detail.route, element: <ClassDetail />, children: [
      { path: nav_links.class_detail.route, element: <ClassDetailInfo /> },
      { path: nav_links.class_detail_attendance.route, element: <ClassDetailAttendance /> },
      { path: nav_links.class_detail_students.route, element: <ClassDetailStudents /> },
      { path: nav_links.class_detail_teaching_assignments.route, element: <ClassDetailTeachingAssignments /> },
      { path: nav_links.class_detail_timetable.route, element: <ClassDetailTimetable /> },
      { path: nav_links.class_detail_scoreboard.route, element: <ClassDetailScoreboard /> },
    ]
  },
  { path: nav_links.classes_new.route, element: <ClassesNew /> },

  {
    path: nav_links.curriculums.route, element: <CurriculumsSubjects />, children: [
      { path: nav_links.curriculums.route, element: <Curriculums /> },
      { path: nav_links.subjects.route, element: <Subjects /> },
      { path: nav_links.subject_detail.route, element: <SubjectDetail /> },
      { path: nav_links.curriculum_detail.route, element: <CurriculumDetail /> },
    ]
  },

  {
    path: nav_links.school_org_structures.route, element: <SchoolOrgStructures />, children: [
      { path: nav_links.school_org_structures.route, element: <Navigate to={nav_links.school_departments.route} replace /> },
      { path: nav_links.school_departments.route, element: <SchoolDepartments /> },
      { path: nav_links.school_department_detail.route, element: <SchoolDepartmentDetail /> },
      { path: nav_links.school_positions.route, element: <SchoolPositions /> },
      { path: nav_links.school_position_detail.route, element: <SchoolPositionDetail /> },
    ]
  },
  { path: nav_links.under_construction.route, element: <UnderConstructionPage /> },
]