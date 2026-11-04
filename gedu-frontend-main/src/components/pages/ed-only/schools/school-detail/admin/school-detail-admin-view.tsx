import { CheckCircleOutlined, PlusOutlined } from "@ant-design/icons"
import { Button, Col, Flex, Form, Input, Modal, Row, Select, Typography } from "antd"
import { useMemo, useState } from "react"
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext"
import { useLayoutContext } from "../../../../../../contexts/EDLayoutContext"
import { activateASchoolAdmin, createASchoolAdmin } from "../../../../../../hooks/ed-only/schools-hook"
import { useMetaSchoolDepartments, useMetaSchoolPositions } from "../../../../../../hooks/school-only/shared-data-hook"
import { SchoolStatusEnum } from "../../../../../../models/enums"
import { SplitNameByLocale, ToFullNameByLocale } from "../../../../../../utils/locale-helpers"
import GTitle from "../../../../../atoms/g-title"
import SchoolStatusTag from "../../../../../atoms/school-status"
import EmptyState from "../../../../../molecules/empty-state"
import { useAppContext } from "../../../../../../contexts/AppContext"

const { Text } = Typography
export default function SchoolDetailAdminView() {
  const { data } = useSchoolDetailContext()
  const admin = useMemo(() => {
    if (!data) return
    if (data.admin?.length) return data.admin[0]
  }, [data])
  if (!data) return
  if (!admin)
    return <NotExist school_id={data.id} />
  return <Content admin={admin} school_id={data.id} school_name={data.name} school_code={data.code} />
}

type FieldType = {
  email: string;
  phone?: string;
  full_name?: string;
  departmentId?: number;
  positionId?: number;
};
function NotExist({ school_id }: { school_id: number }) {
  const { account } = useAppContext()
  const { mutate } = useSchoolDetailContext()
  const { callMessage } = useLayoutContext()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [form] = Form.useForm();
  const [dept_id, setDeptId] = useState(null)
  const { data: dept, fetching: dept_load } = useMetaSchoolDepartments(account?.additional.template_id)
  const { data: pos, fetching: pos_load } = useMetaSchoolPositions(dept_id, account?.additional.template_id)
  async function handleOk() {
    setLoading(true)
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (!is_err) {
        const __admin = form.getFieldsValue()
        const { firstName, lastName } = SplitNameByLocale(__admin.full_name)
        __admin.firstName = firstName
        __admin.lastName = lastName
        const { data, error } = await createASchoolAdmin(school_id, __admin) as any
        if (data) {
          callMessage('Thêm tài khoản admin trường thành công', 'success')
          mutate()
          setOpen(false)
        } else {
          if (error?.message) {
            callMessage(error.message, 'error')
          } else {
            callMessage('Có lỗi trong quá trình Thêm tài khoản trường', 'error')
          }
        }
      }
    })
    setLoading(false)
  }
  return <Flex vertical gap={24} align="center">
    <EmptyState title="Chưa có Quản trị viên nào" desc="Hãy thêm Quản trị viên để kích hoạt tài khoản Trường." />
    <Flex>
      <Button type="primary" icon={<PlusOutlined />} onClick={() => { setOpen(true) }}>Thêm quản trị viên</Button>
    </Flex>
    <Modal
      open={open}
      maskClosable={false}
      title='Thêm Quản trị viên'
      cancelText="Đóng"
      okText='Lưu'
      onOk={handleOk}
      confirmLoading={loading}
      onCancel={() => {
        if (loading) return
        setOpen(false)
      }}
      footer={(_, { CancelBtn, OkBtn }) => (
        <>
          <CancelBtn />
          <OkBtn />
        </>
      )}
    >
      <Form layout="vertical" form={form}>
        <Row gutter={[8, 8]}>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item<FieldType> required
              label="Email của Quản trị viên" name="email" rules={[{ required: true, whitespace: true }]}>
              <Input placeholder="info_ten@gedu.vn" />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item label="Số điện thoại của Quản trị viên" name="phone">
              <Input placeholder="932890172" addonBefore='+84' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <Form.Item<FieldType> required
              label="Họ tên Quản trị viên" name="full_name" rules={[{ required: true, whitespace: true }]}>
              <Input placeholder="Trương Thiên Ái" />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item label="Tổ/Phòng ban" name='departmentId'>
              <Select showSearch options={dept} loading={dept_load}
                placeholder="Chọn Tổ hoặc Phòng Ban"
                fieldNames={{ value: 'id', label: 'name' }}
                optionFilterProp="name"
                onChange={(_value) => {
                  setDeptId(_value)
                  form?.setFieldValue('positionId', undefined)
                }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} md={{ span: 12 }}>
            <Form.Item label="Chức vụ tại trường" name='positionId'>
              <Select showSearch options={pos} loading={pos_load}
                placeholder="Chọn Chức vụ tại trường"
                fieldNames={{ value: 'id', label: 'title' }}
                optionFilterProp="title" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  </Flex>
}
function Content({ admin, school_id, school_name, school_code }: { admin: any, school_id: number, school_name: string, school_code: string }) {
  const { callMessage } = useLayoutContext()
  const { mutate } = useSchoolDetailContext()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  async function handleOk() {
    setLoading(true)
    const res = await activateASchoolAdmin(school_id, admin.staffId)
    if (res?.error?.message) callMessage(res.error.message, 'error')
    else {
      callMessage('Kích hoạt trường thành công', 'success')
      setOpen(false)
      mutate()
    }
    setLoading(false)
    return res
  }
  return <Col>
    {Number(admin?.status) === SchoolStatusEnum.MoiTao.enum ?
      <Row justify='end'>
        <Button
          icon={<CheckCircleOutlined />}
          onClick={() => setOpen(true)}
        >Kích hoạt Quản trị viên</Button>
        <Modal
          open={open}
          maskClosable={false}
          title='Xác nhận Kích hoạt'
          okText='Xác nhận Kích hoạt'
          onOk={handleOk}
          confirmLoading={loading}
          cancelText="Huỷ bỏ"
          onCancel={() => {
            if (loading) return
            setOpen(false)
          }}
          footer={(_, { CancelBtn, OkBtn }) => (
            <>
              <CancelBtn />
              <OkBtn />
            </>
          )}
        >
          <Flex vertical gap={12}>
            <Typography.Text>Bạn có chắc chắn muốn kích hoạt trường:</Typography.Text>
            <Typography.Text>
              <strong>{school_name} (Mã trường: {school_code})</strong>
            </Typography.Text>
            <Typography.Text>
              Sau khi kích hoạt, trường sẽ chuyển sang trạng thái "Đang hoạt động" và Quản trị viên <strong>{ToFullNameByLocale(admin.firstName, admin.lastName)}</strong> có thể bắt đầu sử dụng hệ thống.
            </Typography.Text>
          </Flex>
        </Modal>
      </Row>
      : null
    }
    <Flex gap={16} style={{ padding: '16px 0' }}>
      <Col flex='0 0 228px'>
        <GTitle level={5}>Tài khoản Gedu</GTitle>
      </Col>
      <Col flex='auto'>
        <Row gutter={16}>
          <Col flex='0 0 228px'>
            <Text strong type="secondary">Trạng thái</Text>
          </Col>
          <Col flex='auto'>
            <Text>
              <SchoolStatusTag status={admin.status} /></Text>
          </Col>
        </Row>
      </Col>
    </Flex>

    <Flex gap={16} style={{ padding: '16px 0' }}>
      <Col flex='0 0 228px'>
        <GTitle level={5}>Quản trị Viên trường</GTitle>
      </Col>
      <Col flex='auto'>
        <Row gutter={16}>
          <Col flex='0 0 228px'>
            <Text strong type="secondary">Email của Quản trị viên</Text>
          </Col>
          <Col flex='auto'>
            <Text>{admin.email}</Text>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col flex='0 0 228px'>
            <Text strong type="secondary">Số điện thoại</Text>
          </Col>
          <Col flex='auto'>
            <Text>{admin.phone}</Text>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col flex='0 0 228px'>
            <Text strong type="secondary">Họ tên</Text>
          </Col>
          <Col flex='auto'>
            <Text>{ToFullNameByLocale(admin.firstName, admin.lastName)}</Text>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col flex='0 0 228px'>
            <Text strong type="secondary">Chức vụ tại trường</Text>
          </Col>
          <Col flex='auto'>
            <Text>{admin.positionTitle}</Text>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col flex='0 0 228px'>
            <Text strong type="secondary">Phòng ban</Text>
          </Col>
          <Col flex='auto'>
            <Text>{admin.departmentName}</Text>
          </Col>
        </Row>
      </Col>
    </Flex>
  </Col>
}
