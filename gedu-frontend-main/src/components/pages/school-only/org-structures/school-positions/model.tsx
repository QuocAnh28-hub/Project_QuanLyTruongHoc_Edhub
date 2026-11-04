import { TabsProps } from "antd";

export enum POS_TAB_TYPEs {
  permission = 'permission',
  members = 'members'
}
export const POS_DEFAULT_SELECTED_TAB = POS_TAB_TYPEs.permission as string
export const pos_tab_items: TabsProps['items'] = [
  {
    key: POS_TAB_TYPEs.permission,
    label: 'Phân quyền chi tiết',
  },
  {
    key: POS_TAB_TYPEs.members,
    label: 'Danh sách thành viên',
  },
];