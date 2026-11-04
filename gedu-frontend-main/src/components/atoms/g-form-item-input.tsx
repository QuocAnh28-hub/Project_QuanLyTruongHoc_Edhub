import { Form, FormItemProps, Input, InputProps } from "antd";

interface Props {
  trim_space?: boolean // true by default
  placeholder?: string
  input_props?: InputProps
}
export default function GFormItemInput(props: Props & FormItemProps) {
  const form = Form.useFormInstance();
  function handleBlur(_e: any) {
    if (props.trim_space ?? true) {
      form?.setFieldValue(props.name, _e.target.value.trim())
    }
  }
  return <Form.Item {...props}>
    <Input placeholder={props.placeholder} {...props.input_props} onBlur={handleBlur} />
  </Form.Item>
}