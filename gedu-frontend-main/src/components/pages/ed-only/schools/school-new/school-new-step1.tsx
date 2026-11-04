import { Checkbox, Col, Flex, Form, Input, Radio, Row, Select, Typography } from "antd";
import { useEffect, useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useSchoolCreateContext } from "../../../../../contexts/ed-only/SchoolNewContext";
import { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { useWardsCommunes } from "../../../../../hooks/shared-data-hook";
import { SchoolLevelEnum, SchoolTypeEnum } from "../../../../../models/enums";
const { Title } = Typography

export default function SchoolNewStep1() {
  const { account } = useAppContext()
  const { setBlock } = useRouterBlockerContext()
  const { data: wards, fetching: wrd_load } = useWardsCommunes(account?.additional.province_id || null)
  const { school, form_step1 } = useSchoolCreateContext()
  useEffect(() => {
    if (school) {
      const levels = [] as string[]
      if (school.canPreschool) levels.push('canPreschool')
      if (school.canPrimarySchool) levels.push('canPrimarySchool')
      if (school.canLowerSecondarySchool) levels.push('canLowerSecondarySchool')
      if (school.canUpperSecondarySchool) levels.push('canUpperSecondarySchool')
      if (school.canComplementaryEducation) levels.push('canComplementaryEducation')
      form_step1?.setFieldValue('levels', levels)
    }
  }, [school])
  return <Col flex='auto' style={{ marginLeft: 24 }}>
    <Row><Title level={4} style={{ margin: '16px 0' }}>Thông tin Trường</Title></Row>
    <Form layout="vertical" form={form_step1}
      onValuesChange={(_value) => setBlock(true)}
      initialValues={{ ...school }}
    >
      {/* Thong tin chung */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} lg={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Thông tin chung</Title>
        </Col>
        <Col xs={{ flex: '100%' }} lg={{ flex: 'auto' }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={{ flex: 24 }} md={{ flex: '0 0 110px' }}>
              <Form.Item label="Mã trường" name="code" rules={[{ required: true, whitespace: true }]}>
                <Input placeholder="12345678" />
              </Form.Item>
            </Col>
            <Col xs={{ flex: 24 }} md={{ flex: 'auto' }}>
              <Form.Item label="Tên trường" name="name" rules={[{ required: true, whitespace: true }]}>
                <Input placeholder="THPT Lê Hồng Phong TPHCM" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Loại hình" name="type" rules={[{ required: true, message: 'Chưa chọn Loại hình' }]}>
            <Radio.Group>
              <Radio.Button value={SchoolTypeEnum.CongLap.enum}>{SchoolTypeEnum.CongLap.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.TuThuc.enum}>{SchoolTypeEnum.TuThuc.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.DanLap.enum}>{SchoolTypeEnum.DanLap.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.NgoaiCongLap.enum}>{SchoolTypeEnum.NgoaiCongLap.title}</Radio.Button>
              <Radio.Button value={SchoolTypeEnum.CongLapTuChu.enum}>{SchoolTypeEnum.CongLapTuChu.title}</Radio.Button>
            </Radio.Group>
          </Form.Item>
          <Form.Item>
            <Form.Item name="isInternationalSchool" valuePropName="checked" noStyle>
              <Checkbox>Có yếu tố Quốc tế</Checkbox>
            </Form.Item>
          </Form.Item>
          <Form.Item labelAlign="left" label="Cấp học" name='levels'
            rules={[{ required: true, message: 'Chọn ít nhất một cấp học' }]}>
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
        </Col>
      </Row>

      {/* Nguoi dai dien va lien he */}
      <Row style={{ padding: '16px 0' }}>
        <Col xs={{ flex: '100%' }} lg={{ flex: '0 0 210px' }}>
          <Title level={5} style={{ margin: 0, marginBottom: 16 }}>Người đại diện & Liên hệ</Title>
        </Col>
        <Col xs={{ flex: '100%' }} lg={{ flex: 'auto' }}>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={{ span: 24 }} md={{ span: 12 }}>
              <Form.Item label="Họ tên Hiệu trưởng" name="principalName">
                <Input placeholder="Nguyễn Văn A" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 12 }}>
              <Form.Item label="Số điện thoại Hiệu trưởng" name="principalPhone">
                <Input placeholder="932000123" addonBefore='+84' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={{ span: 24 }} md={{ span: 12 }}>
              <Form.Item label="Email trường" name="email">
                <Input placeholder="info@geduhub.vn" />
              </Form.Item>
            </Col>
            <Col xs={{ span: 24 }} md={{ span: 12 }}>
              <Form.Item label="Số điện thoại trường" name="hotline">
                <Input placeholder="932000123" addonBefore='+84' />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={16} style={{ width: '100%' }}>
            <Col xs={{ span: 24 }}>
              <Form.Item label="Phường/Xã" name="wardId">
                <Select showSearch options={wards} loading={wrd_load} placeholder="Chọn"
                  fieldNames={{ value: 'id', label: 'title' }}
                  optionFilterProp="title"
                />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item label="Địa chỉ trường" name="address">
            <Input placeholder="25 Nguyễn Du" />
          </Form.Item>
        </Col>
      </Row>
    </Form>
  </Col>
}