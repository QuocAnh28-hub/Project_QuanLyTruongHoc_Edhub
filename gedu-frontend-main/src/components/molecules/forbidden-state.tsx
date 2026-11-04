import { Button, Result } from "antd";
import { useNavigate } from "react-router-dom";

interface Props {
  onBack?: () => void
}
export default function ForbiddenState({ onBack }: Props) {
  const navigate = useNavigate()
  return <Result
    status="403"
    title="403"
    subTitle="Bạn không có quyền truy cập tính năng này."
    extra={<Button type="primary" onClick={() => onBack ? onBack?.() : navigate(-1)}>Quay lại</Button>}
  />
}