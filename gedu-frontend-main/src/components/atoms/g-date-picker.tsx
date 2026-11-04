import { DatePicker, DatePickerProps } from "antd";

interface Props {
  format?: string;
}

export default function GDatePicker(props: DatePickerProps & Props) {
  return <DatePicker {...props}
    format={{
      format: props.format || 'DD/MM/YYYY',
      type: 'mask',
    }}
    placeholder={props.placeholder || '26/05/2025'} />
}