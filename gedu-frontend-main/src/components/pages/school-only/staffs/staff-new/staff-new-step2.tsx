import { Col, Flex, Form, Row, Select, Switch, Typography } from "antd";
import { useEffect, useState } from "react";
import RouterBlockerProvider, { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useStaffCreateContext } from "../../../../../contexts/school-only/staffs/StaffNewContext";
import { useMetaSchoolDepartments, useMetaSchoolPositions } from "../../../../../hooks/school-only/shared-data-hook";
import { CheckOutlined, CloseOutlined } from "../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../atoms/title-segment-row";
import GText from "../../../../atoms/g-text";
const { Title } = Typography

const StaffNewStep2 = () => <RouterBlockerProvider><Content /></RouterBlockerProvider>
export default StaffNewStep2

function Content() {
  const { staff, form_step2 } = useStaffCreateContext()
  const { setBlock } = useRouterBlockerContext()
  const [hasConcurrent, setHasConcurrent] = useState<boolean>(false)
  const [dept_id, setDeptId] = useState<number | null>(null)
  const [post_id, setPosId] = useState<number | null>(null)
  const { data: dept, fetching: dept_load } = useMetaSchoolDepartments()
  const { data: pos, fetching: pos_load } = useMetaSchoolPositions(dept_id)
  const pos_id_selected = Form.useWatch<number | null>('positionId', form_step2)
  const { data: posCon = [], fetching: posCon_load } = useMetaSchoolPositions(null)
  useEffect(() => {
    setDeptId(staff.departmentId)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0 32px' }}>Thông tin Chuyên môn & Công việc</Title></Row>
    <Form layout="vertical" form={form_step2}
      initialValues={staff}
      onValuesChange={(_value) => setBlock(true)}>
      {/* Bố trí công việc */}
      <TitleSegmentRow title='Bố trí công việc'>
        <Row gutter={16}>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Tổ/Phòng ban" name='departmentId' rules={[{ required: true, message: 'Chưa chọn Tổ/Phòng ban' }]}>
              <Select allowClear showSearch options={dept} loading={dept_load}
                fieldNames={{ value: 'id', label: 'name' }} placeholder='Chọn'
                onChange={(_value) => {
                  setDeptId(_value)
                  form_step2?.setFieldValue('positionId', null)
                }} />
            </Form.Item>
          </Col>
          <Col xs={{ span: 24 }} xl={{ span: 12 }}>
            <Form.Item label="Chức danh" name='positionId' rules={[{ required: true, message: 'Chưa chọn chức danh' }]}>
              <Select allowClear showSearch options={pos} loading={pos_load}
                fieldNames={{ value: 'id', label: 'title' }} placeholder='Chọn' onChange={(_value) => { setPosId(_value); form_step2?.setFieldValue('schoolStaffPositions', null); }} />
            </Form.Item>
          </Col>

        </Row>
        <Row>
          <Flex gap={8}>
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              defaultChecked={false}
              disabled={!pos_id_selected}
              onChange={() => { setHasConcurrent(!hasConcurrent); form_step2?.setFieldValue('schoolStaffPositions', []) }}
            />
            <GText>Có kiêm nhiệm 1 hoặc nhiều vị trí</GText>
          </Flex>
        </Row>
        {hasConcurrent && <Row style={{ marginTop: 12 }}>
          <Col span={24}>
            <Form.Item label="Vị trí kiêm nhiệm" required name="schoolStaffPositions">
              <Select mode="multiple" placeholder="Chọn" allowClear options={posCon.filter((item: any) => item.id !== post_id)} loading={posCon_load} fieldNames={{ value: 'id', label: 'title' }} />
            </Form.Item>
          </Col>
        </Row>}
      </TitleSegmentRow>

      {/* Kiêm nhiệm */}

    </Form>
  </Col>
}