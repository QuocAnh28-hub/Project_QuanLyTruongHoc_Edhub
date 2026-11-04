import { Checkbox, Col, Form, Radio, Row, Typography } from "antd";
import { useSchoolCreateContext } from "../../../../../contexts/ed-only/SchoolNewContext";
import { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { SchoolDailyScheduleEnum } from "../../../../../models/enums";
const { Title } = Typography

export default function SchoolNewStep2() {
  const { school, form_step2 } = useSchoolCreateContext()
  const { setBlock } = useRouterBlockerContext()

  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0' }}>Đặc điểm & Chương trình</Title></Row>
    <Form layout="vertical" form={form_step2}
      onValuesChange={(_value) => setBlock(true)}
      initialValues={{
        dailyScheduleType: school.dailyScheduleType,
      }}>

      {/* Đặc điểm/Loại hình Chuyên biệt */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} lg={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: '0 16px 16px 0' }}>Đặc điểm/Loại hình Chuyên biệt</Title>
        </Col>
        <Col xs={{ flex: '100%' }} lg={{ flex: 'auto' }}>
          <Row>
            <Form.Item name="isSchoolForGifted" valuePropName="checked" noStyle>
              <Checkbox>Trường Chuyên</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="isEthnicDayBoardingSchool" valuePropName="checked" noStyle>
              <Checkbox>Trường Phổ thông Dân tộc Bán trú</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="isEthnicBoardingSchool" valuePropName="checked" noStyle>
              <Checkbox>Trường Phổ thông Dân tộc Nội trú</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="isSpecialEducationSchool" valuePropName="checked" noStyle>
              <Checkbox>Trường dành cho học sinh khuyết tật</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>

      {/* Chính sách Vùng/Đối tượng Ưu tiên */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} lg={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: '0 16px 16px 0' }}>Chính sách Vùng/Đối tượng Ưu tiên</Title>
        </Col>
        <Col xs={{ flex: '100%' }} lg={{ flex: 'auto' }}>
          <Row>
            <Form.Item name="isRemoteOrMountainous" valuePropName="checked" noStyle>
              <Checkbox>Khu vực (miền núi - vùng sâu)</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="isBorderOrIsland" valuePropName="checked" noStyle>
              <Checkbox>Chính sách vùng (biên giới - hải đảo)</Checkbox>
            </Form.Item>
          </Row>
          <Row style={{ paddingTop: 8 }}>
            <Form.Item name="isEspeciallyDifficultArea" valuePropName="checked" noStyle>
              <Checkbox>Vùng đặc biệt khó khăn</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row>

      {/* Hình thức tổ chức học */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} lg={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: '0 16px 16px 0' }}>Hình thức tổ chức học</Title>
        </Col>
        <Col xs={{ flex: '100%' }} lg={{ flex: 'auto' }}>
          <Row>
            <Form.Item name="dailyScheduleType">
              <Radio.Group style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Radio value={SchoolDailyScheduleEnum.OnePerDay.enum}>{SchoolDailyScheduleEnum.OnePerDay.title}</Radio>
                <Radio value={SchoolDailyScheduleEnum.TwicePerDay.enum}>{SchoolDailyScheduleEnum.TwicePerDay.title}</Radio>
                <Radio value={SchoolDailyScheduleEnum.DayBoarding.enum}>{SchoolDailyScheduleEnum.DayBoarding.title}</Radio>
                <Radio value={SchoolDailyScheduleEnum.Boarding.enum}>{SchoolDailyScheduleEnum.Boarding.title}</Radio>
              </Radio.Group>
            </Form.Item>
          </Row>
        </Col>
      </Row>
      {/* Danh hiệu */}
      {/* <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} lg={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: '0 16px 16px 0' }}>Danh hiệu</Title>
        </Col>
        <Col xs={{ flex: '100%' }} lg={{ flex: 'auto' }}>
          <Row>
            <Form.Item name="is12" valuePropName="checked" noStyle>
              <Checkbox>Trường Đạt chuẩn Quốc gia</Checkbox>
            </Form.Item>
          </Row>
        </Col>
      </Row> */}
    </Form>
  </Col>
}