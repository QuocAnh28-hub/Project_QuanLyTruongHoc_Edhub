import { Card, Col, Flex, Form, Input, Modal, Row, Select } from "antd";
import { useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useStudentsContext } from "../../../../../contexts/school-only/students/StudentsContext";
import { useMetaClasses } from "../../../../../hooks/school-only/shared-data-hook";
import { StudentRow } from "../../../../../models/student-model";
import GText from "../../../../atoms/g-text";
import { ArrowRightOutlined } from "../../../../atoms/svg/outlined-icons";
import NameCardSimple from "../../../../molecules/name-card-simple";
const { TextArea } = Input


interface Props {
    close?: () => void,
    ok?: () => void,
    record?: StudentRow
}
// transfer-class

export default function TransferStudentClass({ record, close, ok }: Props) {
    const { transferStudentClass } = useStudentsContext()
    const { account } = useAppContext()
    const [form] = Form.useForm();
    const { data: classes, fetching: clss_load } = useMetaClasses(
        account?.additional?.school_year_id,
        record?.gradeLevel
    )
    const [loading, setLoading] = useState<boolean>(false)

    async function handleOk() {
        if (!record) return
        setLoading(true)
        form?.validateFields().catch(() => { return }).finally(async () => {
            const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
            if (!is_err) {
                const __data = form.getFieldsValue()
                const res = await transferStudentClass(record.id, { ...__data, gradeLevel: record?.gradeLevel }) as any
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
        title="Chuyển lớp"
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
                gradeLevel: record.gradeLevel,
                fromClassId: record.classId,
            }}
        >
            <GText>Bạn đang thực hiện chuyển lớp cho học sinh:</GText>

            <Col xs={{ flex: '100%' }} xxl={{ flex: 'auto' }} style={{ marginTop: 16 }}>
                <Row gutter={[16, 16]}>
                    <Col xs={{ span: 24 }}>
                        <Card>
                            <NameCardSimple firstName={record.firstName} lastName={record.lastName} code={record.code} />
                        </Card>
                    </Col>
                    <Col xs={{ span: 11 }} xl={{ span: 11 }}>
                        <Form.Item label="Lớp" name="fromClassId">
                            <Select showSearch allowClear options={classes} loading={clss_load}
                                disabled
                                fieldNames={{ value: 'id', label: 'name' }}
                                optionFilterProp='name'
                                placeholder='Chọn' />
                        </Form.Item>
                    </Col>
                    <Col xs={{ span: 2 }} xl={{ span: 2 }}>
                        <Flex justify='center' align='center' style={{ height: '100%' }}>
                            <ArrowRightOutlined style={{ width: 24, height: 24 }} />
                        </Flex>
                    </Col>
                    <Col xs={{ span: 11 }} xl={{ span: 11 }}>
                        <Form.Item label="Sang lớp" name="toClassId">
                            <Select showSearch allowClear options={classes} loading={clss_load}
                                fieldNames={{ value: 'id', label: 'name' }}
                                optionFilterProp='name'
                                placeholder='Chọn' />
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={[16, 16]}>
                    <Col xs={{ span: 24 }} xl={{ span: 24 }}>
                        <Form.Item label="Ghi chú" name="note">
                            <TextArea placeholder="Nhập ghi chú" />
                        </Form.Item>
                    </Col>
                </Row>
            </Col>
        </Form>
    </Modal>
}
