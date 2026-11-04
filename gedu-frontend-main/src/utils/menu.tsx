import { MenuProps } from "antd";
import { AccountTreeOutlined, BookOutlined, DashboardOutlined, DatabaseUploadOutlined, FileOutlined, GradebookOutlined, NotebookOutlined, PieChartOutlined, SchoolOutlined, StairOutlined, StudentOutlined, TeacherOutlined, UserGroupOutlined } from '../components/atoms/svg/outlined-icons';
import { STARTED_SCHOOL_ORG_ID } from "./constants";
import { nav_links } from "./routes";
import { CheckRoles } from "./utils";
type MenuItem = Required<MenuProps>['items'][number];

export default function GetMenuItems(orgId = 0, roles: string[] = []) {
  if (!orgId || !roles?.length) return []
  let _menu_items = [] as any[]
  const _final_items = [] as MenuItem[]
  if (orgId == 1)
    _menu_items = ed_menu_items
  if (orgId >= STARTED_SCHOOL_ORG_ID)
    _menu_items = school_menu_items

  _menu_items.map(item => {
    const _group = { ...item } as any
    _group.children = []
    if (CheckRoles(roles, item.roles)) {
      item.children?.map((child: any) => {
        if (CheckRoles(roles, child.roles))
          _group.children.push(child)
      })
    }
    if (_group.type != 'group' || _group.children?.length) _final_items.push(_group)
  })
  return _final_items
}
const ed_menu_items: any[] = [
  {
    key: 'MANAGEMENTS',
    label: 'QUẢN LÝ TOÀN NGÀNH',
    type: 'group',
    children: [
      { key: nav_links.ed_dashboard.route, label: nav_links.ed_dashboard.title, icon: <DashboardOutlined />, roles: nav_links.ed_dashboard.roles },
      { key: nav_links.ed_reports.route, label: nav_links.ed_reports.title, icon: <PieChartOutlined />, roles: nav_links.ed_reports.roles },
      { key: nav_links.ed_emis_reports.route, label: nav_links.ed_emis_reports.title, icon: <PieChartOutlined />, roles: nav_links.ed_emis_reports.roles },
      { key: nav_links.schools.route, label: nav_links.schools.title, icon: <SchoolOutlined />, roles: nav_links.schools.roles },
      { key: nav_links.ed_curriculums.route, label: nav_links.ed_curriculums.title, icon: <BookOutlined />, roles: nav_links.ed_curriculums.roles },
      { key: nav_links.ed_academic_transcripts.route, label: nav_links.ed_academic_transcripts.title, icon: <GradebookOutlined />, roles: nav_links.ed_academic_transcripts.roles },
      { key: nav_links.ed_learning_materials.route, label: nav_links.ed_learning_materials.title, icon: <NotebookOutlined />, roles: nav_links.ed_learning_materials.roles },
      { key: nav_links.ed_school_staffs.route, label: nav_links.ed_school_staffs.title, icon: <TeacherOutlined />, roles: nav_links.ed_school_staffs.roles },
    ],
  }, {
    key: 'ED_ORGANIZATION',
    label: 'QUẢN LÝ NỘI BỘ SỞ',
    type: 'group',
    children: [
      { key: nav_links.ed_staffs.route, label: nav_links.ed_staffs.title, icon: <UserGroupOutlined />, roles: nav_links.ed_staffs.roles },
      { key: nav_links.ed_resources.route, label: nav_links.ed_resources.title, icon: <FileOutlined />, roles: nav_links.ed_resources.roles },
    ],
  }, {
    key: 'ED_SYSTEM',
    label: 'HỆ THỐNG',
    type: 'group',
    children: [
      { key: nav_links.ed_org_structures.route, label: nav_links.ed_org_structures.title, icon: <AccountTreeOutlined />, roles: nav_links.ed_org_structures.roles },
      { key: nav_links.ed_synchronize_data.route, label: nav_links.ed_synchronize_data.title, icon: <DatabaseUploadOutlined />, roles: nav_links.ed_synchronize_data.roles },
    ],
  }
];

const school_menu_items: any[] = [
  {
    key: nav_links.school_dashboard.route,
    label: nav_links.school_dashboard.title,
    icon: <DashboardOutlined />
  }, {
    key: 'ACADEMIC AFFAIRS',
    label: 'HỌC VỤ',
    type: 'group',
    children: [
      { key: nav_links.school_years.route, label: nav_links.school_years.title, icon: <SchoolOutlined />, roles: nav_links.school_years.roles },
      { key: nav_links.grade_levels.route, label: nav_links.grade_levels.title, icon: <StairOutlined />, roles: nav_links.grade_levels.roles },
      { key: nav_links.curriculums.route, label: nav_links.curriculums.title, icon: <BookOutlined />, roles: nav_links.curriculums.roles },
    ],
  }, {
    key: 'STUDENTS',
    label: 'HỌC SINH',
    type: 'group',
    children: [
      { key: nav_links.students.route, label: nav_links.students.title, icon: <StudentOutlined />, roles: nav_links.students.roles },
    ],
  }, {
    key: 'PERSONNEL',
    label: 'NHÂN SỰ',
    type: 'group',
    children: [
      { key: nav_links.staffs.route, label: nav_links.staffs.title, icon: <UserGroupOutlined />, roles: nav_links.staffs.roles },
    ],
  }, {
    key: 'SYSTEMS',
    label: 'HỆ THỐNG',
    type: 'group',
    children: [
      { key: nav_links.school_org_structures.route, label: nav_links.school_org_structures.title, icon: <AccountTreeOutlined />, roles: nav_links.school_org_structures.roles },
    ],
  },
]