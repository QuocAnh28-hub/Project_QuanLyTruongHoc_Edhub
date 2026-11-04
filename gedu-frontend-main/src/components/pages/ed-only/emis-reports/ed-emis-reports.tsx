import { Button, Col, Divider, Flex, Radio, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import ReportReadyStatusTag from "../../../atoms/report-ready-status";
import { ArrowRightOutlined, CloseOutlined, DownloadOutlined, ResetOutlined, SearchOutlined } from "../../../atoms/svg/outlined-icons";
import { svg_degree } from "../../../atoms/svg/svg-list";

export default function EdEMISReports() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { title: nav_links.ed_emis_reports.title },
    ], nav_links.ed_emis_reports.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Content />
}
function Content() {
  return <ContentCover size="stretch" gap={16}>
    <Flex gap={16} justify="space-between" align="center" wrap>
      <GTitle level={3}>Báo cáo Thống kê EMIS</GTitle>
      <GText italic style={{ textAlign: 'end' }}>Cập nhật lần cuối: {dayjs().format('DD/MM/YYYY HH:mm:ss')}</GText>
    </Flex>
    <Divider style={{ marginTop: 4, marginBottom: 8 }} />
    <Row gutter={[16, 16]} justify="space-between" wrap>
      <Flex gap={12} wrap>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={8}>
              <GText>Năm học</GText>
              <Select style={{ minWidth: 150 }}
                options={[{ id: 1, title: '2025-2026' }]}
                fieldNames={{ value: 'id', label: 'title' }}
                defaultValue={1}
                placeholder='Chọn' />
            </Flex>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={8}>
              <GText>Kỳ báo cáo</GText>
              <Radio.Group block style={{ whiteSpace: 'nowrap' }}
                value={1}
                options={[
                  { value: 1, label: 'Đầu năm' },
                  { value: 2, label: 'Giữa kỳ I' },
                  { value: 3, label: 'Cuối kỳ I' },
                  { value: 4, label: 'Giữa kỳ II' },
                  { value: 5, label: 'Cuối kỳ II' },
                ]}
              />
            </Flex>
          </Col>
        </Row>
      </Flex>
    </Row>
    <Flex vertical gap={12}>
      <GTitle level={5}>Báo cáo Chất lượng Giáo dục</GTitle>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_degree(48)}
            <Flex vertical gap={8} flex='auto'>
              <GText strong>Thống kê Mạng lưới Trường lớp</GText>
              <GText>Báo cáo số liệu tổng quan về trường, lớp, điểm trường trên toàn địa bàn.</GText>
            </Flex>
            <Flex vertical gap={8}>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Mã biểu mẫu</GText>
                <GText>Bieu_mau_CSDL_MNPT_01</GText>
              </Flex>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Trạng thái</GText>
                <GText><ReportReadyStatusTag status={3} /></GText>
              </Flex>
            </Flex>
            <Flex gap={12} wrap>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
              <Button icon={<ResetOutlined />}>Tổng hợp lại</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_degree(48)}
            <Flex vertical gap={8} flex='auto'>
              <GText strong>Thống kê Đội ngũ Cán bộ, Giáo viên, Nhân viên</GText>
              <GText>Báo cáo chi tiết về số lượng, trình độ, cơ cấu của đội ngũ nhân sự toàn ngành.</GText>
            </Flex>
            <Flex vertical gap={8}>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Mã biểu mẫu</GText>
                <GText>Bieu_mau_CSDL_MNPT_02</GText>
              </Flex>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Trạng thái</GText>
                <GText><ReportReadyStatusTag status={3} /></GText>
              </Flex>
            </Flex>
            <Flex gap={12} wrap>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
              <Button icon={<ResetOutlined />}>Tổng hợp lại</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_degree(48)}
            <Flex vertical gap={8} flex='auto'>
              <GText strong>Thống kê Học sinh</GText>
              <GText>Báo cáo chi tiết về sĩ số học sinh, phân loại theo độ tuổi, giới tính, dân tộc, diện chính sách...</GText>
            </Flex>
            <Flex vertical gap={8}>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Mã biểu mẫu</GText>
                <GText>Bieu_mau_CSDL_MNPT_03</GText>
              </Flex>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Trạng thái</GText>
                <GText><ReportReadyStatusTag status={2} /></GText>
              </Flex>
            </Flex>
            <Flex gap={12}>
              <Button danger icon={<CloseOutlined />}>Huỷ bỏ</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_degree(48)}
            <Flex vertical gap={8} flex='auto'>
              <GText strong>Thống kê Cơ sở vật chất & Thiết bị Dạy học</GText>
              <GText>Báo cáo về tình hình phòng học, thư viện, thiết bị dạy học tối thiểu.</GText>
            </Flex>
            <Flex vertical gap={8}>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Mã biểu mẫu</GText>
                <GText>Bieu_mau_CSDL_MNPT_04</GText>
              </Flex>
              <Flex gap={8} justify="space-between">
                <GText type="secondary">Trạng thái</GText>
                <GText><ReportReadyStatusTag status={1} /></GText>
              </Flex>
            </Flex>
            <Flex gap={12}>
              <Button type="primary" icon={<SearchOutlined />}>Tổng hợp dữ liệu</Button>
            </Flex>
          </GCard>
        </Col>
      </Row>
    </Flex>
  </ContentCover>
}
