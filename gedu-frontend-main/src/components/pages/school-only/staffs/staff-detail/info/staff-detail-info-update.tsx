import { Button, Checkbox, Col, Flex, Form, Row, Select, Typography, Upload } from "antd";
import dayjs from "dayjs";
import { Fragment, useEffect, useState } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import { useStaffDetailContext } from "../../../../../../contexts/school-only/staffs/StaffDetailContext";
import { useLayoutContext } from "../../../../../../contexts/SchoolLayoutContext";
import { useNations, useProvincesCities, useReligions, useWardsCommunes } from "../../../../../../hooks/shared-data-hook";
import { SplitNameByLocale, ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import GDatePicker from "../../../../../atoms/g-date-picker";
import GFormItemInput from "../../../../../atoms/g-form-item-input";
import { CheckOutlined, CloseOutlined, PlusOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";
import ForbiddenState from "../../../../../molecules/forbidden-state";

const { Text } = Typography

const StaffDetailInfoUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StaffDetailInfoUpdate

function Content() {
  const { authority } = useAppContext()
  const { callMessage } = useLayoutContext()
  const { data, switchUpdateMode, updateStaff, loading } = useStaffDetailContext()
  const [form] = Form.useForm()
  const { block, setBlock } = useRouterBlockerContext()

  const [provinceId, setProvinceId] = useState<number | null>(null)
  const { data: nations, fetching: nation_load } = useNations()
  const { data: religions, fetching: religion_load } = useReligions()
  const { data: provinces, fetching: prv_load } = useProvincesCities()
  const { data: wards, fetching: wrd_load } = useWardsCommunes(provinceId)

  const [tempProvinceId, setTempProvinceId] = useState<number | null>(null)
  const { data: temp_wards, fetching: temp_wrd_load } = useWardsCommunes(tempProvinceId)

  const [same_as_permanent, setSameAsPermanent] = useState(false)
  useEffect(() => {
    setProvinceId(data?.permanentResidenceProvinceId || null)
    setTempProvinceId(data?.temporaryResidenceProvinceId || null)
    setSameAsPermanent(data?.same_as_permanent || false)
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function handleSave() {
    if (!block) {
      switchUpdateMode(false)
      return
    }
    form?.validateFields().catch(() => { return }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __staff = form.getFieldsValue()
      __staff.id = data?.id
      const { firstName, lastName } = SplitNameByLocale(__staff.fullName)
      __staff.firstName = firstName
      __staff.lastName = lastName
      if (__staff.same_as_permanent) {
        __staff.temporaryResidenceProvinceId = __staff.permanentResidenceProvinceId
        __staff.temporaryResidenceWardId = __staff.permanentResidenceWardId
        __staff.temporaryResidenceAddress = __staff.permanentResidenceAddress
      }
      const res = await updateStaff(__staff)
      if (!res) return
      switchUpdateMode(false)
    })
  }
  if (!authority?.can_touch_staff) return <ForbiddenState onBack={() => switchUpdateMode(false)} />
  if (!data) return null
  return <Fragment>
    <Flex justify='end' gap={12}>
      <Button loading={loading} icon={<CloseOutlined />} onClick={() => switchUpdateMode(false)}>Huỷ bỏ</Button>
      <Button loading={loading} type="primary" icon={<CheckOutlined />} onClick={handleSave}>Lưu thay đổi</Button>
    </Flex>
    <Col flex='auto' style={{ marginLeft: 24 }}>
      <Form layout="vertical" form={form}
        onValuesChange={(_value) => setBlock(true)}
        initialValues={{
          ...data,
          fullName: ToFullNameByLocale(data.firstName, data.lastName),
          dateOfIssue: data.dateOfIssue ? dayjs(data.dateOfIssue) : null,
          dateOfExpiry: data.dateOfExpiry ? dayjs(data.dateOfExpiry) : null,
          placeOfIssue: data.placeOfIssue,
          dateOfBirth: data.dateOfBirth ? dayjs(data.dateOfBirth) : null,
        }}>
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
                input_props={{ disabled: true }} />
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
                <Select allowClear placeholder='Chọn'>
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
          </Row>
          <Row gutter={16}>
            <Col xs={{ span: 24 }} xl={{ span: 12 }}>
              <Form.Item label="Tỉnh/Thành phố" name="permanentResidenceProvinceId">
                <Select allowClear showSearch options={provinces} loading={prv_load}
                  fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn'
                  onChange={(_value => {
                    setProvinceId(_value)
                    form?.setFieldValue('permanentResidenceWardId', null)
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
                    form?.setFieldValue('temporaryResidenceWardId', null)
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
              <GFormItemInput label="Số điện thoại Người thân 1" name="contactPhone1"
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
        {/* Thông tin đoàn thể & khác */}
        <TitleSegmentRow title="Thông tin Đoàn thể & Khác">
          <Row gutter={16}>
            <Col span={24}>
              <Form.Item label="Ngày vào Đoàn" name="youngPioneerAdmissionDate">
                <GDatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ngày vào Đảng" name="youthUnionAdmissionDate">
                <GDatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ngày nhập ngũ" name="startMilitaryServiceDate">
                <GDatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Ngày xuất ngũ" name="endMilitaryServiceDate">
                <GDatePicker style={{ width: '100%' }} />
              </Form.Item>
            </Col>
          </Row>
        </TitleSegmentRow>
      </Form>
    </Col>
  </Fragment>
}