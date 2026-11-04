import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Col, Divider, Flex, Form, Select, Switch } from "antd";
import { useEffect, useState } from "react";
import { useSchoolOperationsContext } from "../../../../../../contexts/ed-only/school-detail/SchoolDetailOperationContext";
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext";
import { useLayoutContext } from "../../../../../../contexts/EDLayoutContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import { schoolNationalStandardStatus, schoolRegion, schoolZone } from "../../../../../../models/ed-only/school-model";
import AskYesNo from "../../../../../atoms/ask-yes-no";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

const SchoolDetailOperationUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default SchoolDetailOperationUpdate

const MAX_INPUT_WIDTH = 800
function Content() {
  const { callMessage } = useLayoutContext()
  const { block, setBlock } = useRouterBlockerContext()

  const { data: school, switchUpdateMode } = useSchoolDetailContext()
  const { data, loading, updateSchoolOperations } = useSchoolOperationsContext()
  const [form] = Form.useForm();
  const [isNationalStandard, setIsNationalStandard] = useState<boolean>(false)

  const [hasStudentsWithDisabilities, setHasStudentsWithDisabilities] = useState<boolean>(data?.hasStudentsWithDisabilities || false)
  const [hasLifeSkillsEducation, setHasLifeSkillsEducation] = useState<boolean>(data?.hasLifeSkillsEducation || false)
  const [hasBasicEducationProgram, setHasBasicEducationProgram] = useState<boolean>(data?.hasBasicEducationProgram || false)
  useEffect(() => {
    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if (data)
      setIsNationalStandard(data.nationalStandardStatus && data.nationalStandardStatus > 0 ? true : false)
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
      __school.id = school?.id
      __school.hasStudentsWithDisabilities = hasStudentsWithDisabilities
      __school.hasLifeSkillsEducation = hasLifeSkillsEducation
      __school.hasBasicEducationProgram = hasBasicEducationProgram
      if (!__school.isNationalStandard)
        __school.nationalStandardStatus = 0
      const result = await updateSchoolOperations(__school)
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
    <Form form={form}
      onValuesChange={(_value) => setBlock(true)}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{
        ...data,
        // init more data
        isNationalStandard: data.nationalStandardStatus && data.nationalStandardStatus > 0,
        nationalStandardStatus: data.nationalStandardStatus || schoolNationalStandardStatus[0].value

      }}>
      {/* Đặc điểm Chất lượng */}
      <TitleSegmentRow title='Đặc điểm Chất lượng'>
        <Col style={{ width: MAX_INPUT_WIDTH }}>
          <Form.Item labelAlign="left" label="Là trường Đạt chuẩn Quốc gia"
            name="isNationalStandard" valuePropName="checked">
            <Switch onChange={(e) => {
              setIsNationalStandard(e)
            }} />
          </Form.Item>
          <Form.Item labelAlign="left" label="Cấp độ Đạt chuẩn Quốc gia"
            name="nationalStandardStatus"
            hidden={!isNationalStandard}>
            <Select placeholder="Chọn cấp độ"
              options={schoolNationalStandardStatus}
              fieldNames={{ label: 'text' }}
              optionLabelProp="text"
              disabled={!isNationalStandard}
            />
          </Form.Item>
          <Form.Item labelAlign="left" label="Khu vực" name="region" >
            <Select placeholder="Chọn khu vực"
              options={schoolRegion} fieldNames={{ label: 'text' }}
              optionLabelProp="text"
              allowClear />
          </Form.Item>
          <Form.Item labelAlign="left" label="Vùng" name="zone" >
            <Select placeholder="Chọn vùng" options={schoolZone}
              fieldNames={{ label: 'text' }} optionLabelProp="text"
              allowClear
            />
          </Form.Item>
        </Col>
      </TitleSegmentRow>
      <Divider />
      <TitleSegmentRow title='Đặc điểm Vận hành'>
        <Col style={{ width: MAX_INPUT_WIDTH }}>
          <Flex vertical gap={8}>
            <AskYesNo value={hasStudentsWithDisabilities}
              text="Có học sinh khuyết tật"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasStudentsWithDisabilities', null)
                setHasStudentsWithDisabilities(_v)
                setBlock(true)
              }} />
            <AskYesNo value={hasLifeSkillsEducation}
              text="Có học kỹ năng sống"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasLifeSkillsEducation', null)
                setHasLifeSkillsEducation(_v)
                setBlock(true)
              }} />
            <AskYesNo value={hasBasicEducationProgram}
              text="Có chương trình giáo dục cơ bản"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasBasicEducationProgram', null)
                setHasBasicEducationProgram(_v)
                setBlock(true)
              }} />
          </Flex>
        </Col>
      </TitleSegmentRow>
    </Form>
  </Flex >
}