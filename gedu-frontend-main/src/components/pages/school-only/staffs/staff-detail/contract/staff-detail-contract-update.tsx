import { Button, Col, Flex, Form, Input, InputNumber, Row } from "antd"
import { Fragment, useEffect } from "react"
import { useAppContext } from "../../../../../../contexts/AppContext"
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext"
import { useStaffDetailContext } from "../../../../../../contexts/school-only/staffs/StaffDetailContext"
import { CheckOutlined, CloseOutlined } from "../../../../../atoms/svg/outlined-icons"
import ForbiddenState from "../../../../../molecules/forbidden-state"
import TitleSegmentRow from "../../../../../atoms/title-segment-row"
import GDatePicker from "../../../../../atoms/g-date-picker"

const StaffDetailContractUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StaffDetailContractUpdate

function Content() {
  const { authority } = useAppContext()
  const [form] = Form.useForm()
  const { switchUpdateMode, loading } = useStaffDetailContext()
  const { setBlock } = useRouterBlockerContext()

  useEffect(() => {
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (!authority?.can_touch_staff) return <ForbiddenState onBack={() => switchUpdateMode(false)} />
  return <Fragment>
    <Flex justify='end' gap={12}>
      <Button loading={loading} icon={<CloseOutlined />} onClick={() => switchUpdateMode(false)}>Huỷ bỏ</Button>
      <Button loading={loading} type="primary" icon={<CheckOutlined />}>Lưu thay đổi</Button>
    </Flex>
    <Form
      layout="vertical" form={form}
      onValuesChange={(_value) => setBlock(true)}
      initialValues={{
      }}>

      <TitleSegmentRow title="Trình độ & Năng lực">
        <Row gutter={16} >
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Loại hợp đồng" name="highestAcademicQualification">
              <Input placeholder="Nhập trình độ học vấn cao nhất" />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Ngày ký" name="professionalQualification">
              <GDatePicker placeholder="Chọn" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Ngày hết hạn" name="foreignLanguageQualification">
              <GDatePicker placeholder="Chọn" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </TitleSegmentRow>
      <TitleSegmentRow title="Thông tin Lương & Phụ cấp">
        <Row gutter={[16, 16]} >
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Mã ngạch" name="highestAcademicQualification">
              <Input placeholder="Nhập" />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Bậc lương" name="gradeStep">
              <InputNumber placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} >
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Hệ số lương" name="coefficient">
              <InputNumber placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>

            <Form.Item labelAlign="left" label="Phần trăm vượt khung" >
              <InputNumber formatter={(value) => `${value}%`} placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} >
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Phụ cấp ưu đãi nghề" >
              <InputNumber formatter={(value) => `${value}%`} placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Phụ cấp thu hút nghề" >
              <InputNumber formatter={(value) => `${value}%`} placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} >
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Phụ cấp thâm niên" >
              <InputNumber formatter={(value) => `${value}%`} placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Hệ số phụ cấp chức vụ lãnh đạo" >
              <InputNumber placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </TitleSegmentRow>
      <TitleSegmentRow title="Thông tin Bảo hiểm & Tài chính">
        <Row gutter={[16, 16]} >
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Mã số BHXH" name="socialInsuranceCode">
              <Input placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Mã số thuế cá nhân" name="taxCode">
              <Input placeholder="Nhập" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={[16, 16]} >
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Thông tin tài khoản ngân hàng" >
              <Input placeholder="Chọn" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item labelAlign="left" label="Ngày nhận lương" name="expirationDate">
              <GDatePicker placeholder="Chọn" style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </TitleSegmentRow>
    </Form>

  </Fragment>
}