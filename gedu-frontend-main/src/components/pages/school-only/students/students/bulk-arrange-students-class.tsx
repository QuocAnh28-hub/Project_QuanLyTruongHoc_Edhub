import { Col, Form, Modal, Row, Select } from "antd";
import { useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useStudentsContext } from "../../../../../contexts/school-only/students/StudentsContext";
import { useLayoutContext } from "../../../../../contexts/SchoolLayoutContext";
import { useMetaClasses } from "../../../../../hooks/school-only/shared-data-hook";
import { StudentRow } from "../../../../../models/student-model";
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers";
import GText from "../../../../atoms/g-text";

interface Props {
    open?: boolean,
    close?: () => void,
    ok?: () => void,
    record?: StudentRow[]
}

export default function BulkArrangeStudentClass({ record, open, close, ok }: Props) {
    const { bulkArrangeStudentClass } = useStudentsContext()
    const { account } = useAppContext()
    const [grade, setGrade] = useState<number | null>(null)
    const [form] = Form.useForm();
    const { grade_levels } = useLayoutContext()
    const { data: classes, fetching: clss_load } = useMetaClasses(
        account?.additional?.school_year_id,
        grade ?? null
    )
    const [loading, setLoading] = useState<boolean>(false)

    async function handleOk() {
        if (!record || loading) return
        setLoading(true)
        form?.validateFields().catch(() => { return }).finally(async () => {
            const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
            if (!is_err) {
                const __data = form.getFieldsValue()
                const res = await bulkArrangeStudentClass({
                    gradeLevel: __data.gradeLevel,
                    classId: __data.classId,
                    studentIds: record.map(item => item.id)
                }) as any
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
        open={open}
        title="Xếp lớp"
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
        >
            <GText>Bạn đang xếp lớp cho học sinh</GText>
            <ul style={{ margin: 0, marginBottom: 12, paddingLeft: 16 }}>
                {record.map((item) => (
                    <li key={item.id}>
                        {`${ToFullNameByLocale(item.firstName, item.lastName)} (MSH: ${item.code})`}
                    </li>
                ))}
            </ul>
            <Col xs={{ flex: '100%' }} xxl={{ flex: 'auto' }}>
                <Row gutter={16}>
                    <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                        <Form.Item label="Khối"
                            name="gradeLevel" rules={[{ required: true, message: 'Chưa chọn Khối lớp' }]}>
                            <Select showSearch options={grade_levels} allowClear onChange={(_v) => {
                                setGrade(_v)
                                form.setFieldValue('classId', null)
                            }}
                                fieldNames={{ value: 'enum', label: 'title' }}
                                optionFilterProp='label'
                                placeholder='Chọn' />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 24 }} xl={{ span: 12 }}>
                        <Form.Item label="Lớp" name="classId">
                            <Select showSearch allowClear options={classes} loading={clss_load}
                                fieldNames={{ value: 'id', label: 'name' }}
                                optionFilterProp='name'
                                placeholder='Chọn' />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>

        </Form>
    </Modal>
}