import { Form, Input, Modal, Select } from "antd"
import { useState } from "react"
import { useGradeLevelDetailContext } from "../../../../../contexts/school-only/grade-levels/GradeLevelDetailContext"
import { useMetaCurriculums, useMetaHomeroomTeachers } from "../../../../../hooks/school-only/shared-data-hook"
import { ClassRow } from "../../../../../models/class-model"
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers"

interface Props {
  close?: () => void,
  ok?: () => void,
  record?: ClassRow
}
export default function UpdateClassModal({ record, close, ok }: Props) {
  const { updateClass } = useGradeLevelDetailContext()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const { data: currs, fetching: currs_load } = useMetaCurriculums(record?.gradeLevel)
  const { data: teachers = [], fetching: teachers_load } = useMetaHomeroomTeachers()

  async function handleOk() {
    if (!record) return
    setLoading(true)
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (!is_err) {
        const __data = form.getFieldsValue()
        const res = await updateClass(record.id, __data) as any
        if (res) {
          ok?.()
        }
      }
    })
    setLoading(false)
  }
  if (!record) return null
  return <Modal
    maskClosable={false}
    open={true}
    title={'Chỉnh sửa Lớp ' + record.name}
    cancelText="Huỷ bỏ"
    okText='Lưu'
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
    <Form layout="vertical" form={form}
      initialValues={{
        name: record.name,
        curriculumId: record.curriculumId,
        homeroomTeacherId: record.homeroomTeacherId
      }}
    >
      <Form.Item required
        label="Tên lớp" name="name" rules={[{ required: true, whitespace: true }]}>
        <Input placeholder="1A" />
      </Form.Item>
      <Form.Item label="Chương trình học" name='curriculumId'>
        <Select showSearch options={currs} loading={currs_load}
          placeholder="Chọn Chương trình học"
          allowClear
          fieldNames={{ value: 'id', label: 'name' }}
          optionFilterProp="name"
        />
      </Form.Item>
      <Form.Item label="Giáo viên chủ nhiệm" name='homeroomTeacherId'>
        <Select
          showSearch
          allowClear
          options={teachers.map((teacher: { id: number, user: { firstName: string, lastName: string } }) => ({
            id: teacher.id,
            name: ToFullNameByLocale(teacher.user.firstName, teacher.user.lastName)
          }))}
          loading={teachers_load}
          placeholder="Chọn Giáo viên chủ nhiệm"
          fieldNames={{ value: 'id', label: 'name' }}
          optionFilterProp="name" />
      </Form.Item>
    </Form>
  </Modal>
}