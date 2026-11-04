import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Checkbox, Col, Divider, Flex, Form, Input, Radio, Select } from "antd";
import { Switch } from "antd/lib";
import { useEffect, useMemo } from "react";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext";
import { useLayoutContext } from "../../../../../../contexts/EDLayoutContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import { useWardsCommunes } from "../../../../../../hooks/shared-data-hook";
import { SchoolLevelEnum, SchoolTypeEnum } from "../../../../../../models/enums";
import { SplitNameByLocale, ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import GDatePicker from "../../../../../atoms/g-date-picker";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";
import dayjs from "dayjs";

const SchoolDetailInfoUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default SchoolDetailInfoUpdate

const MAX_INPUT_WIDTH = 800
function Content() {
  const { account } = useAppContext()
  const { callMessage } = useLayoutContext()
  const { block, setBlock } = useRouterBlockerContext()

  const { data: wards, fetching: wrd_load } = useWardsCommunes(account?.additional.province_id || null)
  const { data, updateSchool, loading, switchUpdateMode } = useSchoolDetailContext()
  const [form] = Form.useForm();

  useEffect(() => {
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (data) {
      const levels = [] as string[]
      if (data.canPreschool) levels.push('canPreschool')
      if (data.canPrimarySchool) levels.push('canPrimarySchool')
      if (data.canLowerSecondarySchool) levels.push('canLowerSecondarySchool')
      if (data.canUpperSecondarySchool) levels.push('canUpperSecondarySchool')
      if (data.canComplementaryEducation) levels.push('canComplementaryEducation')
      form.setFieldValue('levels', levels)
    }
  }, [data])

  function handleUpdate() {
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
      const __school = form.getFieldsValue()
      const { firstName, lastName } = SplitNameByLocale(__school.principalName)
      __school.id = data?.id
      __school.shortName = __school.name
      __school.principalFirstName = firstName
      __school.principalLastName = lastName
      __school.provinceId = account?.additional.province_id
      __school.canPreschool = __school.levels.find((l: string) => l == 'canPreschool') ? true : false
      __school.canPrimarySchool = __school.levels.find((l: string) => l == 'canPrimarySchool') ? true : false
      __school.canLowerSecondarySchool = __school.levels.find((l: string) => l == 'canLowerSecondarySchool') ? true : false
      __school.canUpperSecondarySchool = __school.levels.find((l: string) => l == 'canUpperSecondarySchool') ? true : false
      __school.canComplementaryEducation = __school.levels.find((l: string) => l == 'canComplementaryEducation') ? true : false
      const result = await updateSchool(__school)
      if (!result) return
      switchUpdateMode(false)
    })
  }
  if (!data) return
  return <Flex vertical gap={16}>
    <Flex justify="flex-end">
      <Button loading={loading} icon={<CloseOutlined />} style={{ marginRight: 16 }}
        onClick={() => switchUpdateMode(false)}
      >Huỷ bỏ</Button>
      <Button loading={loading} type='primary' icon={<CheckOutlined />}
        onClick={handleUpdate}
      >Lưu thay đổi</Button>
    </Flex>
    <Form
      form={form}
      onValuesChange={(_value) => setBlock(true)}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 18 }}
      initialValues={{
        ...data,
        dateFounded: data.dateFounded ? dayjs(data.dateFounded) : null,
        dailyScheduleType: Number(data.dailyScheduleType),
        principalName: ToFullNameByLocale(data.principalFirstName, data.principalLastName),
      }}>

      <TitleSegmentRow title='Thông tin trường & Phân loại'>
        <Col style={{ width: MAX_INPUT_WIDTH }}>
          <Form.Item labelAlign="left" name="code" label="Mã trường">
            <Input placeholder="12345678" readOnly disabled />
          </Form.Item>
          <Form.Item labelAlign="left" label="Tên trường" name="name" >
            <Input placeholder="THPT Lê Hồng Phong TPHCM" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Cấp học" name='levels'
            rules={[{
              required: true, message: 'Chọn ít nhất một cấp học',
              validator: (_, value) => {
                console.log(value)
                if (value?.length > 0) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Chọn ít nhất một cấp học'));
              }
            }]}>
            <Checkbox.Group>
              <Flex vertical gap={8}>
                <Checkbox value="canPreschool">{SchoolLevelEnum.MamNon.title}</Checkbox>
                <Checkbox value="canPrimarySchool">{SchoolLevelEnum.TieuHoc.title}</Checkbox>
                <Checkbox value="canLowerSecondarySchool">{SchoolLevelEnum.THCS.title}</Checkbox>
                <Checkbox value="canUpperSecondarySchool">{SchoolLevelEnum.THPT.title}</Checkbox>
                <Checkbox value="canComplementaryEducation">{SchoolLevelEnum.TTGDTX.title}</Checkbox>
              </Flex>
            </Checkbox.Group>
          </Form.Item>
          <Form.Item labelAlign="left" label="Loại hình" name="type" >
            <Radio.Group>
              <Radio.Button value={SchoolTypeEnum.CongLap.enum}>{SchoolTypeEnum.CongLap.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.TuThuc.enum}>{SchoolTypeEnum.TuThuc.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.DanLap.enum}>{SchoolTypeEnum.DanLap.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.NgoaiCongLap.enum}>{SchoolTypeEnum.NgoaiCongLap.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.CongLapTuChu.enum}>{SchoolTypeEnum.CongLapTuChu.title}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item labelAlign="left" label="Có yếu tố Quốc tế" name="isInternationalSchool" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item labelAlign="left" label="Ngày tháng năm thành lập" name="dateFounded">
            <GDatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item labelAlign="left" label="Hạng trường" name="ranking" >
            <Select placeholder="Chọn hạng trường" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Dự án" name="project">
            <Input placeholder="Nhập tên Dự án thành lập trường (nếu có)" />
          </Form.Item>
        </Col>
      </TitleSegmentRow>
      <Divider />
      <TitleSegmentRow title="Vị trí & Liên hệ">
        <Col style={{ width: MAX_INPUT_WIDTH }}>
          <Form.Item labelAlign="left" label="Phường/Xã" name="wardId">
            <Select allowClear showSearch options={wards} loading={wrd_load}
              fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn' />
          </Form.Item>
          <Form.Item labelAlign="left" label="Địa chỉ" name="address">
            <Input placeholder="Nhập số & tên đường" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Số điện thoại trường" name="hotline" >
            <Input placeholder="Nhập số điện thoại trường" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Email trường" name="email" >
            <Input placeholder="Nhập email trường" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Fax" name="fax" >
            <Input placeholder="Nhập số fax" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Website" name="website" >
            <Input placeholder="Nhập địa chỉ website" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Vị trí trên bản đồ"  >
            <Input placeholder="THPT Lê Hồng Phong TPHCM" />
          </Form.Item>
        </Col>
      </TitleSegmentRow>
      <Divider />
      <TitleSegmentRow title='Thông tin Quản lý & Lãnh đạo'>
        <Col style={{ width: MAX_INPUT_WIDTH }}>
          <Form.Item labelAlign="left" label="Tên hiệu trưởng" name="principalName" >
            <Input placeholder="Nhập tên Hiệu trưởng hiện tại" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Số điện thoại hiệu trưởng" name="principalPhone" >
            <Input placeholder="Nhập số điện thoại Hiệu trưởng" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Email hiệu trưởng" name="principalEmail" >
            <Input placeholder="Nhập email Hiệu trưởng" />
          </Form.Item>
          <Form.Item labelAlign="left" label="Có chi bộ Đảng" name="principalIsPartyMember" valuePropName="checked">
            <Switch />
          </Form.Item>
        </Col>
      </TitleSegmentRow>
    </Form>
  </Flex >
}