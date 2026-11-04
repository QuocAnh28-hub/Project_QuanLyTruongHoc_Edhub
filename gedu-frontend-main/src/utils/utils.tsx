import { StaffAuthority } from "../models/staff-authority-model"

/* eslint-disable react-refresh/only-export-components */
export function CheckRoles(accepted_roles: string[], menu_roles: string[]) {
  if (!menu_roles?.length) return true
  if (!accepted_roles?.length) return false
  const exists = accepted_roles.filter(value => menu_roles.includes(value))
  if (exists?.length) return true
  return false
}
export function canTouchRole(role_check: string, accepted_roles: string[]) {
  const exist_idx = accepted_roles.findIndex(r => r === role_check)
  return exist_idx > -1
}

type authority_type = 'all' | 'read' | 'none'
const authority_list = [
  { code: 'dshbrd', title: 'Tổng quan', authority: 'none', group: 'Tổng quan', span: 1 },
  { code: 'schlyr', title: 'Năm học & Học kỳ', authority: 'none', group: 'Học vụ', span: 3 },
  { code: 'grd', title: 'Khối lớp & Lớp học', authority: 'none', group: '', span: 0 },
  { code: 'crrclm', title: 'Chương trình & Môn học', authority: 'none', group: '', span: 0 },
  { code: 'stdnt', title: 'Hồ sơ Học sinh', authority: 'none', group: 'Học sinh', span: 1 },
  { code: 'stff', title: 'Hồ sơ CB&GV', authority: 'none', group: 'Nhân sự', span: 1 },
  { code: 'schldprtmnt', title: 'Cấu trúc phòng ban & Chức danh', authority: 'none', group: 'Hệ thống', span: 2 },
  { code: 'prmssn', title: 'Phân quyền', authority: 'none', group: '', span: 0 },
] as { code: string, title: string, authority: authority_type, group: string, span: number }[]

export function ToAuthoritiesShow(_authorities: StaffAuthority[]) {
  const results = [] as any
  authority_list.map((auth) => {
    const _auth = { ...auth }
    if (_authorities.find((a => a.permissionCode == auth.code + '_a')))
      _auth.authority = 'all'
    else if (_authorities.find((a => a.permissionCode == auth.code + '_r')))
      _auth.authority = 'read'
    results.push(_auth)
  })

  return results
}