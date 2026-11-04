import { Modal } from "antd"
import { useState } from "react"
import { useGradeLevelDetailContext } from "../../../../../contexts/school-only/grade-levels/GradeLevelDetailContext"
import { ClassRow } from "../../../../../models/class-model"
import GText from "../../../../atoms/g-text"

interface Props {
  close?: () => void,
  ok?: () => void,
  record?: ClassRow
}
export default function DeleteClassModal({ record, close, ok }: Props) {
  const { deleteClass } = useGradeLevelDetailContext()
  const [loading, setLoading] = useState<boolean>(false)

  async function handleOk() {
    if (!record) return
    setLoading(true)
    const res = await deleteClass(record.id) as any
    if (res) {
      ok?.()
    }
    setLoading(false)
  }
  if (!record) return null
  return <Modal
    maskClosable={false}
    open={true}
    title={'Xác nhận xoá Lớp ' + record.name}
    cancelText="Đã hiểu"
    okText='Xác nhận xoá'
    okType="danger"
    onOk={handleOk}
    confirmLoading={loading}
    onCancel={() => {
      if (loading) return
      close?.()
    }}
    footer={(_, { CancelBtn, OkBtn }) => (
      <>
        <CancelBtn />
        <OkBtn />
      </>
    )}
  >
    <GText>Bạn có chắc chắn muốn xoá Lớp {record.name}? Hành động này không thể hoàn tác.</GText>
  </Modal>
}