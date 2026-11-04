import { Button, Col, Divider, Flex, Row, Select } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { useWardsCommunes } from "../../../../hooks/shared-data-hook";
import { SchoolLevelEnum, SchoolTypeEnum } from "../../../../models/enums";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import SearchTextBox from "../../../atoms/search-textbox";
import { ArrowRightOutlined, DownloadOutlined, PlusOutlined } from "../../../atoms/svg/outlined-icons";
import { svg_business_presentation, svg_check_report, svg_degree, svg_employee_id, svg_office_cupboard, svg_potted_daisy, svg_review_sheet, svg_scholar, svg_school, svg_school_bag, svg_science, svg_social_connection, svg_table_globe } from "../../../atoms/svg/svg-list";

export default function EdReports() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { title: nav_links.ed_reports.title },
    ], nav_links.ed_reports.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <Content />
}
function Content() {
  const { account } = useAppContext()
  const { data: wards, fetching: wrd_load } = useWardsCommunes(account?.additional.province_id || null)
  return <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
    <Row gutter={[16, 16]}>
      <Col>
        <GTitle level={3}>Thư viện Báo cáo</GTitle>
      </Col>
      <Col flex='auto' style={{ justifyItems: 'flex-end' }}>
        <Flex gap={12} wrap justify="end" align="center">
          <GText italic style={{ textAlign: 'end' }}>Cập nhật lần cuối: {dayjs().format('DD/MM/YYYY HH:mm:ss')}</GText>
          <Link to={'#'}><Button type='primary' icon={<PlusOutlined />}>Tạo báo cáo tuỳ chỉnh</Button></Link>
        </Flex>
      </Col>
    </Row>
    <Divider style={{ marginTop: 4, marginBottom: 8 }} />
    <Row gutter={[16, 16]} justify="space-between" wrap>
      <Flex gap={12} wrap>
        <Row gutter={[12, 12]}>
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={8}>
              <GText>Năm học</GText>
              <Select style={{ minWidth: 150 }}
                options={[{ id: 1, title: '2024-2025' }]}
                fieldNames={{ value: 'id', label: 'title' }}
                defaultValue={1}
                placeholder='Chọn' />
            </Flex>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={8}>
              <GText>Cấp học</GText>
              <Select style={{ minWidth: 150 }}
                options={[
                  { value: SchoolLevelEnum.MamNon.enum, label: SchoolLevelEnum.MamNon.title },
                  { value: SchoolLevelEnum.TieuHoc.enum, label: SchoolLevelEnum.TieuHoc.title },
                  { value: SchoolLevelEnum.THCS.enum, label: SchoolLevelEnum.THCS.title },
                  { value: SchoolLevelEnum.THPT.enum, label: SchoolLevelEnum.THPT.title },
                  { value: SchoolLevelEnum.TTGDTX.enum, label: SchoolLevelEnum.TTGDTX.title },
                ]}
                placeholder='Tất cả' />
            </Flex>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={8}>
              <GText>Loại hình trường</GText>
              <Select style={{ minWidth: 150 }}
                options={[
                  { value: SchoolTypeEnum.CongLap.enum, label: SchoolTypeEnum.CongLap.title },
                  { value: SchoolTypeEnum.DanLap.enum, label: SchoolTypeEnum.DanLap.title },
                  { value: SchoolTypeEnum.TuThuc.enum, label: SchoolTypeEnum.TuThuc.title }
                ]}
                placeholder='Tất cả' />
            </Flex>
          </Col>
          <Col xs={24} md={12} lg={6}>
            <Flex vertical gap={8}>
              <GText>Phường/Xã</GText>
              <Select showSearch style={{ minWidth: 150 }}
                options={wards} loading={wrd_load}
                placeholder="Tất cả"
                fieldNames={{ value: 'id', label: 'title' }}
                optionFilterProp="title"
              />
            </Flex>
          </Col>
        </Row>
      </Flex>
      <Flex vertical justify='flex-end'>
        <SearchTextBox placeholder='Tìm kiếm' style={{ maxWidth: 356 }} />
      </Flex>
    </Row>
    <Flex vertical gap={12}>
      <GTitle level={5}>Báo cáo Chất lượng Giáo dục</GTitle>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_degree(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Phổ điểm Kỳ thi Tốt nghiệp THPT</GText>
              <GText>Phân tích chi tiết phổ điểm các môn thi, so sánh kết quả giữa các trường và các năm.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_business_presentation(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo So sánh Kết quả Học tập</GText>
              <GText>Xếp hạng và so sánh học lực trung bình, tỷ lệ học sinh Giỏi/Khá giữa các trường, phường/xã.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_scholar(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Tỷ lệ Tốt nghiệp</GText>
              <GText>Thống kê tỷ lệ học sinh hoàn thành chương trình và tốt nghiệp THCS, THPT theo từng đơn vị.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
      </Row>
    </Flex>
    <Flex vertical gap={12}>
      <GTitle level={5}>Báo cáo Quản lý Học sinh</GTitle>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_table_globe(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Thống kê Sĩ số Toàn ngành</GText>
              <GText>Tổng hợp số lượng học sinh theo cấp học, loại hình trường, khu vực địa lý.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_school_bag(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Biến động Học sinh</GText>
              <GText>Thống kê số lượng học sinh chuyển đi, chuyển đến, thôi học trong năm để dự báo nhu cầu.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_check_report(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Chuyên cần & Kỷ luật</GText>
              <GText>Tổng hợp tỷ lệ chuyên cần và các vụ việc kỷ luật nghiêm trọng trên toàn địa bàn.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_potted_daisy(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Thống kê Học sinh theo Diện Chính sách</GText>
              <GText>Chi tiết số lượng học sinh thuộc các diện ưu tiên, hộ nghèo, khuyết tật...</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
      </Row>
    </Flex>
    <Flex vertical gap={12}>
      <GTitle level={5}>Báo cáo Quản lý Đội ngũ</GTitle>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_review_sheet(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Thống kê Chất lượng Đội ngũ</GText>
              <GText>Phân tích tỷ lệ giáo viên theo trình độ (Cử nhân, Thạc sĩ), hạng chức danh nghề nghiệp.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_employee_id(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Cơ cấu Nhân sự</GText>
              <GText>Biểu đồ tháp tuổi, thống kê thâm niên công tác và số lượng giáo viên sắp nghỉ hưu.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_social_connection(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Tỷ lệ Giáo viên/Học sinh</GText>
              <GText>So sánh tỷ lệ GV/HS giữa các trường, các cấp học để đánh giá việc phân bổ nhân sự.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
      </Row>
    </Flex>
    <Flex vertical gap={12}>
      <GTitle level={5}>Báo cáo Vận hành</GTitle>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_office_cupboard(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Tình hình Cơ sở vật chất</GText>
              <GText>Thống kê số lượng phòng học, phòng chức năng, trang thiết bị dạy học.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_school(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Tỷ lệ Trường Đạt chuẩn Quốc gia</GText>
              <GText>Danh sách và tỷ lệ các trường đã đạt và chưa đạt chuẩn quốc gia.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
        <Col xs={24} lg={12} xxl={8}>
          <GCard vertical gap={12} style={{ height: '100%' }}>
            {svg_science(48)}
            <Flex vertical gap={8}>
              <GText strong>Báo cáo Tình hình Đồng bộ Dữ liệu</GText>
              <GText>Chi tiết tiến độ và các lỗi (nếu có) trong việc đồng bộ dữ liệu từ các trường lên hệ thống.</GText>
            </Flex>
            <Flex gap={12}>
              <Button icon={<ArrowRightOutlined />} iconPosition='end'>Xem báo cáo</Button>
              <Button icon={<DownloadOutlined />}>Xuất Excel</Button>
            </Flex>
          </GCard>
        </Col>
      </Row>
    </Flex>
  </ContentCover>
}
