import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { Button, Col, Flex, Form, Input, InputNumber } from "antd";
import { useEffect, useState } from "react";
import { useSchoolFacilitiesContext } from "../../../../../../contexts/ed-only/school-detail/SchoolDetailFacilitiesContext";
import { useSchoolDetailContext } from "../../../../../../contexts/ed-only/SchoolDetailContext";
import { useLayoutContext } from "../../../../../../contexts/EDLayoutContext";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../../contexts/RouterBlockerContext";
import AskYesNo from "../../../../../atoms/ask-yes-no";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

const SchoolDetailFacilityUpdate = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default SchoolDetailFacilityUpdate

const MAX_INPUT_WIDTH = 800
function Content() {
  const { callMessage } = useLayoutContext()
  const { block, setBlock } = useRouterBlockerContext()
  const { data: school, switchUpdateMode } = useSchoolDetailContext()
  const { data, updateSchoolFacilities, loading } = useSchoolFacilitiesContext()
  const [form] = Form.useForm();

  const [hasMinimumTeachingEquipment, setHasMinimumTeachingEquipment] = useState(false);
  const [hasComputers, setHasComputers] = useState(false);
  const [hasInternetAccess, setHasInternetAccess] = useState(false);
  const [hasPowerGrid, setHasPowerGrid] = useState(false);
  const [hasCleanWaterSource, setHasCleanWaterSource] = useState(false);
  const [hasRestrooms, setHasRestrooms] = useState(false);
  const [hasCleanHygieneEducationProgram, setHasCleanHygieneEducationProgram] = useState(false);
  const [hasAccessibleInfraStudentsWithDisabilities, setHasAccessibleInfraStudentsWithDisabilities] = useState(false);
  const [hasStudentServiceUnit, setHasStudentServiceUnit] = useState(false);

  useEffect(() => {
    setHasMinimumTeachingEquipment(data?.hasMinimumTeachingEquipment || false)
    setHasComputers(data?.hasComputers || false)
    setHasInternetAccess(data?.hasInternetAccess || false)
    setHasPowerGrid(data?.hasPowerGrid || false)
    setHasCleanWaterSource(data?.hasCleanWaterSource || false)
    setHasRestrooms(data?.hasRestrooms || false)
    setHasCleanHygieneEducationProgram(data?.hasCleanHygieneEducationProgram || false)
    setHasAccessibleInfraStudentsWithDisabilities(data?.hasAccessibleInfraStudentsWithDisabilities || false)
    setHasStudentServiceUnit(data?.hasStudentServiceUnit || false)

    return () => switchUpdateMode(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  function handleUpdate() {
    if (!block) {
      switchUpdateMode(false)
      return
    }
    form?.validateFields().catch(() => {
      return
    }).finally(async () => {
      const is_err = form.getFieldsError().some((err) => { return err.errors.length ? true : false })
      if (is_err) {
        callMessage('Chưa điền hết thông tin bắt buộc', 'warning')
        return
      }
      const __school = form.getFieldsValue()
      __school.id = school?.id
      __school.hasMinimumTeachingEquipment = hasMinimumTeachingEquipment
      __school.hasComputers = hasComputers
      __school.hasInternetAccess = hasInternetAccess
      __school.hasPowerGrid = hasPowerGrid
      __school.hasCleanWaterSource = hasCleanWaterSource
      __school.hasRestrooms = hasRestrooms
      __school.hasCleanHygieneEducationProgram = hasCleanHygieneEducationProgram
      __school.hasAccessibleInfraStudentsWithDisabilities = hasAccessibleInfraStudentsWithDisabilities
      __school.hasStudentServiceUnit = hasStudentServiceUnit
      const result = await updateSchoolFacilities(__school)
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
        ...data
      }}>
      {/* Thông tin Cơ sở vật chất */}
      <TitleSegmentRow title='Thông tin cơ sở vật chất'>
        <Col style={{ width: MAX_INPUT_WIDTH }}>
          <Form.Item labelAlign="left" label="Diện tích (mét vuông)" name="totalArea" >
            <InputNumber placeholder="Nhập diện tích" min={0} addonAfter={<span>m<sup>2</sup></span>} style={{ width: '100%' }} />
          </Form.Item>
          <Col style={{ marginBottom: 8 }}>
            <AskYesNo value={hasMinimumTeachingEquipment}
              text="Đủ thiết bị dạy học tối thiểu"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasMinimumTeachingEquipment', null)
                setHasMinimumTeachingEquipment(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 8 }}>
            <AskYesNo value={hasComputers}
              text="Có sử dụng máy vi tính"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasComputers', null)
                setHasComputers(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 8 }}>
            <AskYesNo value={hasInternetAccess}
              text="Được kết nối Internet"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasInternetAccess', null)
                setHasInternetAccess(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 8 }}>
            <AskYesNo value={hasPowerGrid}
              text="Có điện lưới"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasPowerGrid', null)
                setHasPowerGrid(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 8 }}>
            <AskYesNo value={hasCleanWaterSource}
              text="Có nguồn nước sạch"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasCleanWaterSource', null)
                setHasCleanWaterSource(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 12 }}>
            <AskYesNo value={hasRestrooms}
              text="Có công trình vệ sinh"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasRestrooms', null)
                setHasRestrooms(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 12 }}>
            <AskYesNo value={hasCleanHygieneEducationProgram}
              text="Có chương trình giáo dục vệ sinh đôi tay"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasCleanHygieneEducationProgram', null)
                setHasCleanHygieneEducationProgram(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 12 }}>
            <AskYesNo value={hasAccessibleInfraStudentsWithDisabilities}
              text="Có hạ tầng tiếp cận học sinh khuyết tật"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasAccessibleInfraStudentsWithDisabilities', null)
                setHasAccessibleInfraStudentsWithDisabilities(_v)
                setBlock(true)
              }} />
          </Col>
          <Col style={{ marginBottom: 12 }}>
            <AskYesNo value={hasStudentServiceUnit}
              text="Có bộ phận công tác tư vấn học đường"
              onChange={(_v: boolean) => {
                if (!_v) form?.setFieldValue('hasStudentServiceUnit', null)
                setHasStudentServiceUnit(_v)
              }} />
          </Col>
        </Col>
      </TitleSegmentRow>
    </Form>
  </Flex>
}