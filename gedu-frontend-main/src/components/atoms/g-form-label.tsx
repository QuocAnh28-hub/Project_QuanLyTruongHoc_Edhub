import { ReactNode } from "react";
import GText from "./g-text";

interface Props {
  required?: boolean
  children?: ReactNode
}
export default function GFormLabel({ children, required = true }: Props) {
  const clss = 'g-label-required'
  return <GText className={required ? clss : undefined}>{children}</GText>
}
