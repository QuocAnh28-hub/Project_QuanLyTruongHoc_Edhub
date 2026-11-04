import { Flex } from "antd";
import GText from "../atoms/g-text";
import GTitle from "../atoms/g-title";
import { svg_calendar, svg_checklist, svg_class_table, svg_lock, svg_medal, svg_schedule, svg_school_bag, svg_stationery } from "../atoms/svg/svg-list";

interface Props {
  icon?:
  'school-bag' | 'stationery' | 'schedule'
  | 'lock' | 'class-table' | 'checklist'
  | 'calendar' | 'medal'
  title?: string,
  desc?: string
}
export default function EmptyState({ icon = 'stationery', title = 'Không có thông tin', desc }: Props) {
  return <Flex vertical gap={4} align="center">
    {icon == 'school-bag' && svg_school_bag()}
    {icon == 'stationery' && svg_stationery()}
    {icon == 'schedule' && svg_schedule()}
    {icon == 'lock' && svg_lock()}
    {icon == 'class-table' && svg_class_table()}
    {icon == 'checklist' && svg_checklist()}
    {icon == 'calendar' && svg_calendar()}
    {icon == 'medal' && svg_medal()}
    {title && <GTitle level={5} style={{ marginTop: 20 }}>{title}</GTitle>}
    {desc && <GText>{desc}</GText>}
  </Flex>
}