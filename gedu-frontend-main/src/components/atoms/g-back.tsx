import { Button, ButtonProps } from "antd";
import { useNavigate } from "react-router-dom";
import { ArrowLeftOutlined } from "./svg/outlined-icons";

interface Props {
  default_route?: string
}
export default function GBack(props: Props & ButtonProps) {
  const navigate = useNavigate()

  return <Button icon={<ArrowLeftOutlined />} {...props}
    onClick={() => navigate(-1)}
  />
}
