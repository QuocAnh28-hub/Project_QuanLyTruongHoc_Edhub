import { Form, Input, Modal, Select } from "antd"
import { useState } from "react"
import { useSubjectsContext } from "../../../../../contexts/school-only/curriculums/SubjectsContext"
import { useMetaSchoolDepartments } from "../../../../../hooks/school-only/shared-data-hook"
import { SubjectRow } from "../../../../../models/subject-model"

interface Props {
  close?: () => void
  ok?: () => void
  record?: SubjectRow | any
  onUpdate?: (id: number, data: any) => Promise<boolean>
}

export default function UpdateSubjectModal({ record, close, ok, onUpdate }: Props) {
  const { updateSubject } = useSubjectsContext()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState<boolean>(false)
  const { data: departments = [], fetching: departments_load } = useMetaSchoolDepartments()

  async function handleOk() {
    if (!record) return
    setLoading(true)
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => err.errors.length ? true : false)
      if (!is_err) {
        const values = form.getFieldsValue()
        const payload = {
          name: values.name,
          departments: values.departments || []
        }
        const doUpdate = onUpdate || updateSubject
        const res = await doUpdate(record.id, payload) as any
        if (res) {
          ok?.()
        }
      }
      setLoading(false)
    })
  }

  if (!record) return null

  const initialDepartments = Array.isArray(record.departments)
    ? record.departments.map((d: any) => typeof d === 'object' ? d.id : d)
    : []

  const deptOptions = Array.isArray(departments)
    ? departments.map((d: any) => ({ value: d.id, label: d.name }))
    : []

  return (
    <Modal
      maskClosable={false}
      open={true}
      title={'Chỉnh sửa Môn học ' + (record.name || '')}
      cancelText="Huỷ bỏ"
      okText="Lưu"
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
      <Form
        layout="vertical"
        form={form}
        initialValues={{
          code: record.code,
          name: record.name,
          departments: initialDepartments,
        }}
      >
        <Form.Item label="Mã môn học" name="code">
          <Input disabled />
        </Form.Item>
        <Form.Item
          required
          label="Tên môn học"
          name="name"
          rules={[{ required: true, whitespace: true, message: 'Vui lòng nhập tên môn học' }]}
        >
          <Input placeholder="Nhập tên môn học" />
        </Form.Item>
        <Form.Item label="Tổ chuyên môn phụ trách" name="departments">
          <Select
            mode="multiple"
            showSearch
            options={deptOptions}
            loading={departments_load}
            placeholder="Chọn Tổ chuyên môn phụ trách"
            allowClear
            optionFilterProp="label"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}

