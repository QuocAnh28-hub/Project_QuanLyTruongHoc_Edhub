import { Form, Input, Modal, Select } from "antd"
import { useMemo, useState } from "react"
import { useSubjectDetailContext } from "../../../../../contexts/school-only/curriculums/SubjectDetailContext"
import { subjectType } from "../../../../../models/curriculum-model"
import { studentGradeStatus } from "../../../../../models/student-model"
import { SubjectCurriculumRow } from "../../../../../models/subject-model"

interface Props {
  close?: () => void,
  ok?: () => void,
  curriculum?: SubjectCurriculumRow
  record?: any
}
export default function UpdateCurriculumSubjectModal({ record, curriculum, close, ok }: Props) {
  const { data, updateCurriculumSubject, curriculums_mutate } = useSubjectDetailContext()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)

  const assessmentType = useMemo(() => {
    if (!record) return undefined
    if (record.commentsBased && record.scoringBased) return 3
    if (record.commentsBased) return 1
    if (record.scoringBased) return 2
  }, [record])

  async function handleOk() {
    if (!record || !curriculum || !data) return
    setLoading(true)
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (!is_err) {
        const __data = form.getFieldsValue()
        const req = {
          type: __data.type,
          lessonsPerWeek: __data.lessonsPerWeek,
          commentsBased: __data.assessmentType == 1 || __data.assessmentType == 3,
          scoringBased: __data.assessmentType == 2 || __data.assessmentType == 3,
        }
        const res = await updateCurriculumSubject(curriculum.id, data.id, record.name, req) as any
        if (res) {
          curriculums_mutate()
          ok?.()
        }
      }
    })
    setLoading(false)
  }
  if (!data || !record) return null
  return <Modal
    maskClosable={false}
    open={true}
    title={`Chỉnh sửa môn học ${data.name} trong ${studentGradeStatus.find((g) => g.value == record.name)?.text}`}
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
        type: record.subjectType,
        assessmentType,
        lessonsPerWeek: record.lessonsPerWeek
      }}
    >
      <Form.Item label="Loại môn học" name='type'>
        <Select showSearch options={subjectType}
          placeholder="Chọn Loại môn học"
          fieldNames={{ value: 'value', label: 'text' }}
          optionFilterProp="name"
        />
      </Form.Item>
      <Form.Item label="Hình thức đánh giá" name='assessmentType'>
        <Select showSearch options={assessmentTypes}
          placeholder="Chọn Hình thức đánh giá"
          optionFilterProp="title" />
      </Form.Item>
      <Form.Item
        label="Số tiết/tuần" name="lessonsPerWeek">
        <Input placeholder="0" />
      </Form.Item>
    </Form>
  </Modal>
}
const assessmentTypes = [
  { value: 1, label: 'Nhận xét' },
  { value: 2, label: 'Điểm số' },
  { value: 3, label: 'Kết hợp nhận xét và điểm số' },
]