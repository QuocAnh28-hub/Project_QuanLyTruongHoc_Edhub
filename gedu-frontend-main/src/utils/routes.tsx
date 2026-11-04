import { EDRoles, ScRoles } from "./constants"

export const base_path = '/' //'/gedu'
export const paths = {
  home: '/',
  login: '/login',
  forgot_password: '/forgot-password',
  ed_dashboard: '/tong-quan',
  ed_reports: '/bao-cao',
  ed_emis_reports: '/bao-cao-emis',
  ed_curriculums: '/chuong-trinh-hoc',
  ed_academic_transcript: '/hoc-ba-dien-tu',
  ed_learning_materials: '/hoc-lieu',
  ed_school_staffs: '/can-bo-giao-vien',
  ed_staffs: '/nhan-su',
  ed_resources: '/van-ban',

  ed_org_structures: '/to-chuc',
  edu_departments: '/to-chuc/phong-ban',
  edu_department_detail: '/to-chuc/phong-ban/:id',
  ed_positions: '/to-chuc/chuc-danh',
  ed_position_detail: '/to-chuc/chuc-danh/:id',

  ed_synchronize_data: '/dong-bo-du-lieu',

  schools: '/truong-hoc',
  school_new: '/truong-hoc/tao-moi',
  school_detail: '/truong-hoc/:id',
  school_detail_admin: '/truong-hoc/:id/admin',
  school_detail_operation: '/truong-hoc/:id/van-hanh',
  school_detail_facility: '/truong-hoc/:id/co-so-vat-chat',
  school_update: '/truong-hoc/:id/cap-nhat',
  school_admin_new: '/truong-hoc/:id/admin/tao-moi',
  school_import: '/truong-hoc/import',
  school_requests: '/yeu-cau-tu-truong',

  report_maps: '/bao-cao/ban-do-chien-luoc',

  school_dashboard: '/tong-quan',
  staffs: '/can-bo-giao-vien',
  staff_new: '/can-bo-giao-vien/tao-moi',
  staff_detail: '/can-bo-giao-vien/:id',
  staff_detail_major: '/can-bo-giao-vien/:id/cong-viec',
  staff_detail_contract: '/can-bo-giao-vien/:id/hop-dong-che-do',
  staff_detail_folders: '/can-bo-giao-vien/:id/ho-so-van-ban',
  staff_detail_rewards: '/can-bo-giao-vien/:id/khen-thuong-ky-luat',
  staff_update: '/can-bo-giao-vien/:id/cap-nhat',
  staff_import: '/can-bo-giao-vien/import',

  students: '/hoc-sinh',
  student_new: '/hoc-sinh/tao-moi',
  student_detail: '/hoc-sinh/:id',
  student_detail_special_policies: '/hoc-sinh/:id/hoc-vu-chinh-sach',
  student_detail_medical_info: '/hoc-sinh/:id/y-te',
  student_import: '/hoc-sinh/import',

  school_org_structures: '/cau-truc-to-chuc',
  school_departments: '/cau-truc-to-chuc/phong-ban',
  school_department_detail: '/cau-truc-to-chuc/phong-ban/:id',
  school_positions: '/cau-truc-to-chuc/chuc-danh',
  school_position_detail: '/cau-truc-to-chuc/chuc-danh/:id',

  school_years: '/nam-hoc',
  school_year_new: '/nam-hoc/tao-moi',
  school_year_detail: '/nam-hoc/:id',

  curriculums: '/chuong-trinh',
  curriculum_new: '/chuong-trinh/tao-moi',
  curriculum_detail: '/chuong-trinh/:id',
  subjects: '/chuong-trinh/mon-hoc',
  subject_new: '/chuong-trinh/mon-hoc/tao-moi',
  subject_detail: '/chuong-trinh/mon-hoc/:id',

  grade_levels: '/khoi-lop',
  grade_level_detail: '/khoi-lop/:id',
  class_new: '/khoi-lop/lop-hoc/tao-moi',
  classes_new: '/khoi-lop/lop-hoc/tao-danh-sach',
  class_detail: '/khoi-lop/lop-hoc/:id',
  class_detail_attendance: '/khoi-lop/lop-hoc/:id/chuyen-can',
  class_detail_students: '/khoi-lop/lop-hoc/:id/hoc-sinh',
  class_detail_teaching_assignments: '/khoi-lop/lop-hoc/:id/phan-cong-giang-day',
  class_detail_timetable: '/khoi-lop/lop-hoc/:id/thoi-khoa-bieu',
  class_detail_scoreboard: '/khoi-lop/lop-hoc/:id/bang-diem',

  examples: '/vi-du',
  example_new: '/vi-du/tao-moi',
  example_detail: '/vi-du/:id',

  under_construction: '/dang-xay-dung'
}
export const nav_links = {

  // unauth layout

  home: { route: paths.home, title: 'Trang chu', roles: null },
  login: { route: paths.login, title: 'Đăng nhập', roles: null },
  forgot_password: { route: paths.forgot_password, title: 'Quên mật khẩu', roles: null },
  under_construction: { route: paths.under_construction, title: 'Đang xây dựng', roles: null },

  // ed layout

  ed_dashboard: { route: paths.ed_dashboard, title: 'Tổng quan', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  ed_reports: { route: paths.ed_reports, title: 'Thư viện Báo cáo', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  ed_emis_reports: { route: paths.ed_emis_reports, title: 'Báo cáo EMIS', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  ed_curriculums: { route: paths.ed_curriculums, title: 'Chương trình học', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  ed_academic_transcripts: { route: paths.ed_academic_transcript, title: 'Học bạ điện tử', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  ed_learning_materials: { route: paths.ed_learning_materials, title: 'Quản lý Học liệu', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  ed_school_staffs: { route: paths.ed_school_staffs, title: 'Quản lý Cán bộ & Giáo viên', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  ed_staffs: { route: paths.ed_staffs, title: 'Quản lý Nhân sự Sở', roles: [EDRoles.ADMIN] },
  ed_resources: { route: paths.ed_resources, title: 'Quản lý Văn bản & Công việc', roles: [EDRoles.ADMIN, EDRoles.MOD] },

  ed_org_structures: { route: paths.ed_org_structures, title: 'Cấu trúc Tổ chức & Phân quyền', roles: [EDRoles.ADMIN] },
  edu_departments: { route: paths.edu_departments, title: 'Phòng ban / Tổ chuyên môn', roles: [EDRoles.ADMIN] },
  edu_department_detail: { route: paths.edu_department_detail, title: 'Chi tiết Phòng ban / Tổ chuyên môn', roles: [EDRoles.ADMIN] },
  ed_positions: { route: paths.ed_positions, title: 'Chức danh & Phân quyền', roles: [EDRoles.ADMIN] },
  ed_position_detail: { route: paths.ed_position_detail, title: 'Chi tiết Chức danh & Phân quyền', roles: [EDRoles.ADMIN] },

  ed_synchronize_data: { route: paths.ed_synchronize_data, title: 'Cài đặt Đồng bộ dữ liệu', roles: [EDRoles.ADMIN] },

  schools: { route: paths.schools, title: 'Danh sách Trường học', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_new: { route: paths.school_new, title: 'Tạo Trường học', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_detail: { route: paths.school_detail, title: 'Chi tiết Trường', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_detail_admin: { route: paths.school_detail_admin, title: 'Quản trị viên Trường', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_detail_operation: { route: paths.school_detail_operation, title: 'Chất lượng & Vận hành', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_detail_facility: { route: paths.school_detail_facility, title: 'Cơ sở vật chất', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_update: { route: paths.school_update, title: 'Cập nhật thông tin Trường', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_import: { route: paths.school_import, title: 'Tải lên danh sách', roles: [EDRoles.ADMIN, EDRoles.MOD] },
  school_admin_new: { route: paths.school_admin_new, title: 'Tạo quản trị viên Trường', roles: [EDRoles.ADMIN, EDRoles.MOD] },

  report_maps: { route: paths.report_maps, title: 'Bản đồ Giáo dục Chiến lược', roles: [EDRoles.ADMIN, EDRoles.MOD] },

  // school layout

  school_dashboard: { route: paths.school_dashboard, title: 'Tổng quan' },
  staffs: { route: paths.staffs, title: 'Hồ sơ Cán bộ & Giáo viên', roles: [ScRoles.STAFF_ALL, ScRoles.STAFF_READ] },
  staff_new: { route: paths.staff_new, title: 'Tạo Cán bộ / Giáo viên', roles: [ScRoles.STAFF_ALL] },
  staff_detail: { route: paths.staff_detail, title: 'Chi tiết Cán bộ & Giáo viên', roles: [ScRoles.STAFF_ALL, ScRoles.STAFF_READ] },
  staff_detail_major: { route: paths.staff_detail_major, title: 'Chuyên môn & Giảng dạy', roles: [ScRoles.STAFF_ALL, ScRoles.STAFF_READ] },
  staff_detail_contract: { route: paths.staff_detail_contract, title: 'Hợp đồng & Chế độ', roles: [ScRoles.STAFF_ALL, ScRoles.STAFF_READ] },
  staff_detail_folders: { route: paths.staff_detail_folders, title: 'Hồ sơ Văn bản', roles: [ScRoles.STAFF_ALL, ScRoles.STAFF_READ] },
  staff_detail_rewards: { route: paths.staff_detail_rewards, title: 'Khen thưởng & Kỷ luật', roles: [ScRoles.STAFF_ALL, ScRoles.STAFF_READ] },
  staff_import: { route: paths.staff_import, title: 'Tải lên danh sách', roles: [ScRoles.STAFF_ALL] },

  students: { route: paths.students, title: 'Hồ sơ Học sinh', roles: [ScRoles.STUDENT_ALL, ScRoles.STUDENT_READ] },
  student_new: { route: paths.student_new, title: 'Tạo Học sinh', roles: [ScRoles.STUDENT_ALL] },
  student_detail: { route: paths.student_detail, title: 'Chi tiết Học sinh', roles: [ScRoles.STUDENT_ALL, ScRoles.STUDENT_READ] },
  student_detail_special_policies: { route: paths.student_detail_special_policies, title: 'Học vụ và Chính sách', roles: [ScRoles.STUDENT_ALL, ScRoles.STUDENT_READ] },
  student_detail_medical_info: { route: paths.student_detail_medical_info, title: 'Thông tin Sức khoẻ', roles: [ScRoles.STUDENT_ALL, ScRoles.STUDENT_READ] },
  student_import: { route: paths.student_import, title: 'Tải lên danh sách', roles: [ScRoles.STUDENT_ALL] },

  school_org_structures: { route: paths.school_org_structures, title: 'Cấu trúc Tổ chức & Phân quyền', roles: [ScRoles.DEPARTMENT_ALL, ScRoles.DEPARTMENT_READ] },
  school_departments: { route: paths.school_departments, title: 'Phòng ban / Tổ chuyên môn', roles: [ScRoles.DEPARTMENT_ALL, ScRoles.DEPARTMENT_READ] },
  school_department_detail: { route: paths.school_department_detail, title: 'Chi tiết Phòng ban / Tổ chuyên môn', roles: [ScRoles.DEPARTMENT_ALL, ScRoles.DEPARTMENT_READ] },
  school_positions: { route: paths.school_positions, title: 'Chức danh & Phân quyền', roles: [ScRoles.DEPARTMENT_ALL, ScRoles.DEPARTMENT_READ] },
  school_position_detail: { route: paths.school_position_detail, title: 'Chi tiết Chức danh & Phân quyền', roles: [ScRoles.DEPARTMENT_ALL, ScRoles.DEPARTMENT_READ] },

  school_years: { route: paths.school_years, title: 'Năm học', roles: [ScRoles.SCHOOLYEAR_ALL, ScRoles.SCHOOLYEAR_READ] },
  school_year_new: { route: paths.school_year_new, title: 'Tạo Năm học', roles: [ScRoles.SCHOOLYEAR_ALL] },
  school_year_detail: { route: paths.school_year_detail, title: 'Chi tiết Năm học', roles: [ScRoles.SCHOOLYEAR_ALL, ScRoles.SCHOOLYEAR_READ] },

  curriculums: { route: paths.curriculums, title: 'Chương trình học & Môn học', roles: [ScRoles.CURRICULUM_ALL, ScRoles.CURRICULUM_READ] },
  curriculum_new: { route: paths.curriculum_new, title: 'Tạo chương trình học', roles: [ScRoles.CURRICULUM_ALL] },
  curriculum_detail: { route: paths.curriculum_detail, title: 'Chi tiết chương trình', roles: [ScRoles.CURRICULUM_ALL, ScRoles.CURRICULUM_READ] },
  subjects: { route: paths.subjects, title: 'Môn học', roles: [ScRoles.CURRICULUM_ALL, ScRoles.CURRICULUM_READ] },
  subject_new: { route: paths.subject_new, title: 'Tạo Môn học', roles: [ScRoles.CURRICULUM_ALL] },
  subject_detail: { route: paths.subject_detail, title: 'Chi tiết Môn học', roles: [ScRoles.CURRICULUM_ALL, ScRoles.CURRICULUM_READ] },

  grade_levels: { route: paths.grade_levels, title: 'Khối lớp & Lớp học', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
  grade_level_detail: { route: paths.grade_level_detail, title: 'Chi tiết Khối lớp', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
  classes_new: { route: paths.classes_new, title: 'Tạo danh sách lớp', roles: [ScRoles.GRADE_ALL] },
  class_new: { route: paths.class_new, title: 'Tạo lớp mới', roles: [ScRoles.GRADE_ALL] },
  class_detail: { route: paths.class_detail, title: 'Chi tiết Lớp', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
  class_detail_attendance: { route: paths.class_detail_attendance, title: 'Chuyên cần & Điểm danh', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
  class_detail_students: { route: paths.class_detail_students, title: 'Danh sách học sinh', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
  class_detail_teaching_assignments: { route: paths.class_detail_teaching_assignments, title: 'Phân công Giảng dạy', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
  class_detail_timetable: { route: paths.class_detail_timetable, title: 'Thời khoá biểu', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
  class_detail_scoreboard: { route: paths.class_detail_scoreboard, title: 'Bảng điểm & Kết quả', roles: [ScRoles.GRADE_ALL, ScRoles.GRADE_READ] },
}