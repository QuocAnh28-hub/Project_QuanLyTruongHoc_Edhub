import { DatePicker } from "antd";
import { RangePickerProps } from "antd/lib/date-picker";

const { RangePicker } = DatePicker
export default function GDateRangePicker(props: RangePickerProps) {
  return <RangePicker {...props}
    format={{
      format: 'DD/MM/YYYY',
      type: 'mask',
    }}
    placeholder={props.placeholder || ['01/08/2025', '31/05/2026']} />
}