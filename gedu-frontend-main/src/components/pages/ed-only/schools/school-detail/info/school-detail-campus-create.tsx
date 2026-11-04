import { Col, Flex, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext";
import { useLayoutContext } from "../../../../../../contexts/EDLayoutContext";
import { useWardsCommunes } from "../../../../../../hooks/shared-data-hook";
import GFormLabel from "../../../../../atoms/g-form-label";

interface Props {
  close?: () => void
}
export default function SchoolDetailCampusCreate({ close }: Props) {
  const { account } = useAppContext()
  const { callMessage } = useLayoutContext()
  const { createSchoolCampus, loading, mutate } = useSchoolDetailContext()
  const [form] = Form.useForm();

  const { data: wards, fetching: wrd_load } = useWardsCommunes(account?.additional.province_id || null)

  async function handleOk() {
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const req = form.getFieldsValue()
      req.provinceId = account?.additional.province_id || null
      const result = await createSchoolCampus(req)
      if (result) {
        mutate()
        close?.()
      }
    })
  }
  return <Modal centered
    open
    maskClosable={false}
    title='Thêm điểm trường'
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
    <Form form={form}>
      <Flex vertical gap={0}>
        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}><GFormLabel>Mã điểm trường</GFormLabel></Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name='code' rules={[{ required: true, message: 'Chưa nhập thông tin' }]}>
              <Input placeholder="Nhập mã điểm trường" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}><GFormLabel>Tên điểm trường</GFormLabel></Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name='name' rules={[{ required: true, message: 'Chưa nhập thông tin' }]}>
              <Input placeholder="Nhập tên điểm trường" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}>Phường/Xã</Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name="wardId">
              <Select allowClear showSearch options={wards} loading={wrd_load}
                fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn' />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}>Địa chỉ</Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name='address'>
              <Input placeholder="Nhập địa chỉ" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}>Số điện thoại</Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name='hotline'>
              <Input placeholder="Nhập số điện thoại" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}>Khoảng cách điểm trường chính</Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name='distance'>
              <InputNumber placeholder="Nhập khoảng cách" min={0} addonAfter='mét' style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}>Phương tiện có thể đi lại</Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name='meansOfTransportation'>
              <Input placeholder="Nhập phương tiện (cách nhau bằng dấu phẩy)" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[24, 4]}>
          <Col xs={24} lg={{ flex: '230px' }}>Diện tích</Col>
          <Col xs={24} lg={{ flex: 'auto' }}>
            <Form.Item label="" name='totalArea'>
              <InputNumber placeholder="Nhập diện tích" min={0} addonAfter={<span>m<sup>2</sup></span>} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Flex>
    </Form>
  </Modal>
}