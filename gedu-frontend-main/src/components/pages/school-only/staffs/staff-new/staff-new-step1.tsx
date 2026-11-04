import { Checkbox, Col, Flex, Form, Row, Select, Typography, Upload } from "antd";
import { useEffect, useState } from "react";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useStaffCreateContext } from "../../../../../contexts/school-only/staffs/StaffNewContext";
import { useNations, useProvincesCities, useReligions, useWardsCommunes } from "../../../../../hooks/shared-data-hook";
import GDatePicker from "../../../../atoms/g-date-picker";
import GFormItemInput from "../../../../atoms/g-form-item-input";
import { PlusOutlined } from "../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../atoms/title-segment-row";
const { Title, Text } = Typography

const StaffNewStep1 = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StaffNewStep1

function Content() {
  const { staff, form_step1 } = useStaffCreateContext()
  const { setBlock } = useRouterBlockerContext()

  const [provinceId, setProvinceId] = useState<number | null>(null)
  const { data: nations, fetching: nation_load } = useNations()
  const { data: religions, fetching: religion_load } = useReligions()
  const { data: provinces, fetching: prv_load } = useProvincesCities()
  const { data: wards, fetching: wrd_load } = useWardsCommunes(provinceId)

  const [tempProvinceId, setTempProvinceId] = useState<number | null>(null)
  const { data: temp_wards, fetching: temp_wrd_load } = useWardsCommunes(tempProvinceId)

  const [same_as_permanent, setSameAsPermanent] = useState(false)

  useEffect(() => {
    setProvinceId(staff.permanentResidenceProvinceId)
    setTempProvinceId(staff.permanentResidenceProvinceId)
    setSameAsPermanent(staff.same_as_permanent)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0 32px' }}>Thông tin Cá nhân</Title></Row>
    <Form layout="vertical" form={form_step1}
      initialValues={staff}
      onValuesChange={(_value) => setBlock(true)}>
      {/* Thong tin chung */}
      <TitleSegmentRow title='Thông tin chung'>
        <Row gutter={16}>
          <Col>
            <Upload
              name="avatar"
              listType="picture-circle"
              className="avatar-uploader"
              showUploadList={false}
            >
              <button style={{ border: 0, background: 'none' }} type="button">
                <PlusOutlined />
                <div style={{ marginTop: 8 }}>Tải lên</div>
              </button>
            </Upload>
          </Col>
          <Col flex='auto'>
            <Flex gap={8} vertical>
              <Text>Ảnh đại diện (Hình ảnh này sẽ được sử dụng trên thẻ ID của trường)</Text>
              <ul style={{ margin: 0 }}>
                <li>Kích cỡ: 128 x 128 pixel </li>
                <li>Dung lượng tối đa: 1MB </li>
                <li>Định dạng: JPEG, PNG</li>
              </ul>
            </Flex>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: 12 }}>
          <Col xs={{ span: 24 }} xl={{ span: 6 }}>
            <GFormItemInput label="Mã giáo viên/nhân sự" name="code"
              rules={[{ required: true, whitespace: true }]}
              placeholder="VS-000" />
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 18 }}>
            <GFormItemInput label="Họ tên" name="fullName"
              rules={[{ required: true, whitespace: true }]}
              placeholder="Nguyễn Văn A" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <GFormItemInput label="Số CCCD" name="citizenId" rules={[{ required: true, whitespace: true }]}
              placeholder="082194029767" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Ngày cấp" name="dateOfIssue">
              <GDatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Ngày hết hạn" name="dateOfExpiry">
              <GDatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <GFormItemInput label="Nơi cấp" name="placeOfIssue"
              placeholder="Đồng Nai" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label="Ngày sinh" name="dateOfBirth" rules={[{ required: true, message: 'Chưa điền Ngày sinh' }]}>
              <GDatePicker style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Giới tính" name="sex" rules={[{ required: true, message: 'Chưa chọn giới tính' }]}>
              <Select allowClear placeholder='Chọn' >
                <Select.Option value={1}>Nam</Select.Option>
                <Select.Option value={2}>Nữ</Select.Option>
              </Select>
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Quốc tịch" name="nationalityId" rules={[{ required: true, message: 'Chưa chọn Quốc tịch' }]}>
              <Select allowClear showSearch options={nations} loading={nation_load}
                fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn' />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 8 }}>
            <Form.Item label="Tôn giáo" name="religionId">
              <Select showSearch options={religions} loading={religion_load}
                fieldNames={{ value: 'id', label: 'title' }}
                optionFilterProp='title'
                placeholder='Chọn' />
            </Form.Item>
          </Col>
        </Row>
      </TitleSegmentRow>
      {/* Thông tin địa chỉ */}
      <TitleSegmentRow title='Thông tin địa chỉ'>
        <Row gutter={16}>
          <Col span={24} style={{ marginBottom: 12 }}><Text strong>Nơi thường trú</Text></Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Tỉnh/Thành phố" name="permanentResidenceProvinceId">
              <Select allowClear showSearch options={provinces} loading={prv_load}
                fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn'
                onChange={(_value => {
                  setProvinceId(_value)
                  form_step1?.setFieldValue('permanentResidenceWardId', null)
                })} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Phường/Xã" name="permanentResidenceWardId">
              <Select allowClear showSearch options={wards} loading={wrd_load}
                fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <GFormItemInput label="Số nhà & Tên đường" name="permanentResidenceAddress"
              placeholder="25 Nguyễn Du" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}><Text strong>Nơi tạm trú</Text></Col>
          <Col span={24} style={{ marginTop: 16, marginBottom: 24 }}>
            <Form.Item name="same_as_permanent" valuePropName="checked" noStyle>
              <Checkbox checked={same_as_permanent}
                onChange={() => {
                  setSameAsPermanent(!same_as_permanent)
                }}>Giống Nơi thường trú</Checkbox>
            </Form.Item>
          </Col>
        </Row>
        {same_as_permanent ? null : <Row gutter={16}>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Tỉnh/Thành phố" name="temporaryResidenceProvinceId">
              <Select allowClear showSearch options={provinces} loading={prv_load}
                fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn'
                onChange={(_value => {
                  setTempProvinceId(_value)
                  form_step1?.setFieldValue('temporaryResidenceWardId', null)
                })} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Phường/Xã" name="temporaryResidenceWardId">
              <Select allowClear showSearch options={temp_wards} loading={temp_wrd_load}
                fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn' />
            </Form.Item>
          </Col>
          <Col span={24}>
            <GFormItemInput label="Số nhà & Tên đường" name="temporaryResidenceAddress"
              placeholder="25 Nguyễn Du" />
          </Col>
        </Row>
        }
      </TitleSegmentRow>
      {/* Thoong tin lien he */}
      <TitleSegmentRow title='Thông tin liên hệ'>
        <Row gutter={16}>
          <Col span={24}>
            <GFormItemInput label="Email làm việc của Giáo viên/nhân viên" name="email"
              rules={[{ required: true, whitespace: true }]}
              placeholder="info@gedu.vn" />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <GFormItemInput label="Số điện thoại Giáo viên/nhân viên" name="phone"
              rules={[{ required: true, whitespace: true }]}
              placeholder="932000123" input_props={{ addonBefore: '+84' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <GFormItemInput label="Số điện thoại Người thân 1" name="contactPhone"
              placeholder="932000123" input_props={{ addonBefore: '+84' }} />
          </Col>
        </Row>
        <Row gutter={16}>
          <Col span={24}>
            <GFormItemInput label="Số điện thoại Người thân 2" name="contactPhone2"
              placeholder="932000123" input_props={{ addonBefore: '+84' }} />
          </Col>
        </Row>
      </TitleSegmentRow>
    </Form>
  </Col>
}