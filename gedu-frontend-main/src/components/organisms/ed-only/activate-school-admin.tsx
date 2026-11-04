import { Button, Flex, Modal, Typography } from "antd"
import { useSchoolsContext } from "../../../contexts/ed-only/SchoolsContext"
import { useLayoutContext } from "../../../contexts/EDLayoutContext"
import { activateASchoolAdmin } from "../../../hooks/ed-only/schools-hook"
import { ThunderboltOutlined } from "../../atoms/svg/outlined-icons"

interface Props {
  school_id: number
  school_code: string
  school_name: string
  admin_id: number
  admin_name: string
}
export default function ActivateSchoolAdmin({ school_id, school_code, school_name, admin_id, admin_name }: Props) {
  const { mutate } = useSchoolsContext()
  const { callMessage } = useLayoutContext()
  async function handleOk() {
    const res = await activateASchoolAdmin(school_id, admin_id)
    if (res?.error?.message) callMessage(res.error.message, 'error')
    else {
      callMessage('Kích hoạt trường thành công', 'success')
      mutate()
    }
    return res
  }
  return <Button
    onClick={() => {
      Modal.confirm({
        title: 'Xác nhận Kích hoạt',
        content: <Flex vertical gap={12}>
          <Typography.Text>Bạn có chắc chắn muốn kích hoạt trường:</Typography.Text>
          <Typography.Text>
            <strong>{school_name} (Mã trường: {school_code})</strong>
          </Typography.Text>
          <Typography.Text>
            Sau khi kích hoạt, trường sẽ chuyển sang trạng thái "Đang hoạt động" và Quản trị viên <strong>{admin_name}</strong> có thể bắt đầu sử dụng hệ thống.
          </Typography.Text>
        </Flex>,
        onOk: handleOk,
        cancelText: 'Huỷ bỏ',
        okText: 'Xác nhận Kích hoạt',
        footer: (_, { OkBtn, CancelBtn }) => (
          <>
            <CancelBtn />
            <OkBtn />
          </>
        ),
      });
    }}
    icon={<ThunderboltOutlined />}
  >Kích hoạt</Button>
}