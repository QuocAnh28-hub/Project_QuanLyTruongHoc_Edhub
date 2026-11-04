import { Badge, Button, Col, Divider, Flex, Row, Select, Tabs } from "antd";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useAppContext } from "../../../contexts/AppContext";
import { useLayoutContext } from "../../../contexts/EDLayoutContext";
import { useWardsCommunes } from "../../../hooks/shared-data-hook";
import { SchoolLevelEnum, SchoolTypeEnum } from "../../../models/enums";
import { ToFormatedNumber } from "../../../utils/locale-helpers";
import { nav_links } from "../../../utils/routes";
import GColumnChart from "../../atoms/charts/g-column";
import GFullBarChart from "../../atoms/charts/g-full-bar";
import GPieChart from "../../atoms/charts/g-pie";
import GTimeBarChart from "../../atoms/charts/g-time-bar";
import { chart_palette } from "../../atoms/color-palette";
import ContentCover from "../../atoms/content-cover";
import GCard from "../../atoms/g-card";
import GChartText from "../../atoms/g-chart-text";
import GChartTitle from "../../atoms/g-chart-title";
import GText from "../../atoms/g-text";
import GTitle from "../../atoms/g-title";
import SearchTextBox from "../../atoms/search-textbox";
import { SchoolFilled, StudentFilled, TeacherFilled } from "../../atoms/svg/filled-icons";
import { ArrowRightOutlined, DownloadOutlined, SettingOutlined } from "../../atoms/svg/outlined-icons";
import StreetMap from "./report-maps/ed-street-map";

export default function EdDashboard() {
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
  return <ContentCover vertical size="stretch" gap={20} style={{ paddingBottom: 40 }}>
    <Row gutter={[16, 16]}>
      <Col xs={{ flex: 1 }} xl={{ flex: 'auto' }}>
        <Flex gap={16} justify="space-between" align="center" wrap>
          <GTitle level={3}>Tổng quan</GTitle>
          <GText italic style={{ textAlign: 'end' }}>Cập nhật lần cuối: {dayjs().format('DD/MM/YYYY HH:mm:ss')}</GText>
        </Flex>
      </Col>
      <Col xs={{ flex: 1 }} xl={{ flex: 0 }}>
        <Flex gap={12} justify="end" align="center" wrap>
          <Button icon={<SettingOutlined />}>Tuỳ chỉnh</Button>
          <Button type='primary' icon={<DownloadOutlined />}>Xuất báo cáo (PDF/Excel)</Button>
        </Flex>
      </Col>
    </Row>
    <Divider style={{ marginTop: 0, marginBottom: 4 }} />
    <Flex gap={16} justify="space-between" wrap>
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
    </Flex>
    <Flex vertical gap={12}>
      <GTitle level={5}>Số liệu Tổng quan</GTitle>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={12} xl={8}>
          <GCard vertical gap={4} style={{ height: '100%' }}>
            <Flex justify='space-between' gap={12}>
              <SchoolFilled size={24} fill='var(--pink-5)' />
              <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
            </Flex>
            <GText>Tổng số Trường học</GText>
            <GTitle level={3}>{ToFormatedNumber(1774)}</GTitle>
          </GCard>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <GCard vertical gap={4} style={{ height: '100%' }}>
            <Flex justify='space-between' gap={12}>
              <StudentFilled size={24} fill='var(--purple-4)' />
              <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
            </Flex>
            <GText>Tổng số Học sinh</GText>
            <GTitle level={3}>{ToFormatedNumber(1218100)}</GTitle>
          </GCard>
        </Col>
        <Col xs={24} md={12} xl={8}>
          <GCard vertical gap={4} style={{ height: '100%' }}>
            <Flex justify='space-between' gap={12}>
              <TeacherFilled size={24} fill='var(--green-5)' />
              <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
            </Flex>
            <GText>Tổng số Giáo viên</GText>
            <GTitle level={3}>{ToFormatedNumber(56825)}</GTitle>
          </GCard>
        </Col>
      </Row>
    </Flex>
    <Row gutter={[24, 24]}>
      <Col xs={24} xl={16}>
        <Flex vertical gap={12} style={{ height: '100%' }}>
          <Flex justify='space-between' align="center" gap={12}>
            <GTitle level={5}>Tổng quan Sĩ số & Cấp học</GTitle>
            <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
          </Flex>
          <GCard vertical gap={48} style={{ height: '100%' }}>
            <Row gutter={[48, 24]}>
              <Col xs={24} lg={12}>
                <Flex vertical gap={16}>
                  <Flex vertical gap={4}>
                    <GChartTitle>Phân bổ Học sinh theo Cấp học</GChartTitle>
                    <GChartText type="secondary">Đơn vị tính: Học sinh</GChartText>
                  </Flex>
                  <Flex vertical style={{ maxWidth: 360, width: '100%', alignSelf: 'center' }}>
                    <GPieChart data={pie1} custom_color />
                  </Flex>
                  <Flex vertical gap={12}>
                    {pie1.map((p, i) => {
                      return <Flex key={p.label + i} gap={12} justify="space-between">
                        <Badge color={p.color} text={p.label} />
                        <GChartText>{ToFormatedNumber(p.value)}</GChartText>
                      </Flex>
                    })}
                  </Flex>
                </Flex>
              </Col>
              <Col xs={24} lg={12}>
                <Flex vertical gap={16}>
                  <Flex vertical gap={4}>
                    <GChartTitle>Thống kê theo Giới tính</GChartTitle>
                    <GChartText type="secondary">Đơn vị tính: Học sinh</GChartText>
                  </Flex>
                  <Flex vertical style={{ maxWidth: 360, width: '100%', alignSelf: 'center' }}>
                    <GPieChart data={pie2} custom_color />
                  </Flex>
                  <Flex vertical gap={12}>
                    {pie2.map((p, i) => {
                      return <Flex key={p.label + i} gap={12} justify="space-between">
                        <Badge color={p.color} text={p.label} />
                        <GChartText>{ToFormatedNumber(p.value)}</GChartText>
                      </Flex>
                    })}
                  </Flex>
                </Flex>
              </Col>
            </Row>
          </GCard>
        </Flex>
      </Col>
      <Col xs={24} xl={8}>
        <Flex vertical gap={12} style={{ height: '100%' }}>
          <Flex justify='space-between' align='center' gap={12}>
            <GTitle level={5}>Phân bổ theo Khu vực Địa lý</GTitle>
            <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
          </Flex>
          <GCard vertical style={{ height: '100%' }}>
            <Flex vertical gap={4}>
              <GChartTitle>Top 5 Phường/Xã có nhiều học sinh nhất</GChartTitle>
              <GChartText type="secondary">Đơn vị tính: Học sinh</GChartText>
            </Flex>
            <Flex vertical style={{ margin: 'auto 0' }}>
              <GColumnChart data={col1} />
            </Flex>
          </GCard>
        </Flex>
      </Col>
    </Row>
    <Flex vertical gap={12}>
      <Flex gap={16} justify="space-between" align="center" wrap>
        <GTitle level={5}>Tình hình Đồng bộ Dữ liệu</GTitle>
        <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
      </Flex>
      <GCard vertical>
        <Row gutter={[48, 24]}>
          <Col xs={24} lg={12}>
            <Flex vertical gap={4}>
              <GChartTitle>Các trường đã đồng bộ ({ToFormatedNumber(1652)} trường)</GChartTitle>
              <GChartText type="secondary">Đơn vị tính: Trường</GChartText>
            </Flex>
            <Flex vertical gap={16}>
              <Tabs
                activeKey={'1'}
                items={[{ label: 'Theo Cấp học', key: '1' }, { label: 'Theo Khu vực', key: '2' }]}
                size='middle'
              />
              <Flex gap={12}>
                <Badge color={chart_palette.palette_1} text='Đã đồng bộ' />
                <Badge color={chart_palette.palette_2} text='Chưa đồng bộ' />
              </Flex>
              <GFullBarChart data={bar1} custom_color={[chart_palette.palette_1, chart_palette.palette_2]} />
            </Flex>
          </Col>
          <Col xs={24} lg={12}>
            <Flex vertical gap={4}>
              <GChartTitle>Các trường chưa đồng bộ ({ToFormatedNumber(122)} trường)</GChartTitle>
              <GChartText type="secondary">Đơn vị tính: Trường</GChartText>
            </Flex>
            <Flex vertical gap={16}>
              <Tabs
                activeKey={'1'}
                items={[{ label: 'Theo Cấp học', key: '1' }, { label: 'Theo Khu vực', key: '2' }]}
                size='middle'
              />
              <Flex gap={12}>
                <Badge color={chart_palette.palette_1} text='Quá hạn đồng bộ' />65
                <Badge color={chart_palette.palette_2} text='Có lỗi dữ liệu' />35
                <Badge color={chart_palette.palette_2} text='Chưa gửi dữ liệu' />22
              </Flex>
              <GFullBarChart data={bar2} custom_color={[chart_palette.spectral_2, chart_palette.palette_3, chart_palette.palette_2]} />
            </Flex>
          </Col>
        </Row>
      </GCard>
    </Flex>
    <Row gutter={[24, 24]}>
      <Col xs={24} xl={12}>
        <Flex vertical gap={12} style={{ height: '100%' }}>
          <Flex justify='space-between' align='center' gap={12}>
            <GTitle level={5}>Chất lượng Học tập Toàn ngành</GTitle>
            <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
          </Flex>
          <GCard vertical gap={16} style={{ height: '100%' }}>
            <Flex vertical gap={4}>
              <GChartTitle>Phân loại theo Học lực</GChartTitle>
              <GChartText type="secondary">Đơn vị tính: Học sinh</GChartText>
            </Flex>
            <Flex gap={12}>
              <Badge color={chart_palette.palette_6} text='Giỏi' />
              <Badge color={chart_palette.palette_1} text='Khá' />
              <Badge color={chart_palette.palette_3} text='Trung bình' />
              <Badge color={chart_palette.palette_5} text='Yếu/Kém' />
            </Flex>
            <Flex vertical style={{ margin: 'auto 0' }}>
              <GTimeBarChart data={bar3} custom_color={[chart_palette.palette_6, chart_palette.palette_1, chart_palette.palette_3, chart_palette.palette_5]} />
            </Flex>
          </GCard>
        </Flex>
      </Col>
      <Col xs={24} xl={12}>
        <Flex vertical gap={12} style={{ height: '100%' }}>
          <Flex justify='space-between' align='center' gap={12}>
            <GTitle level={5}>Bản đồ Phân bố</GTitle>
            <Button type='link' icon={<ArrowRightOutlined />} iconPosition='end'>Xem chi tiết</Button>
          </Flex>
          <GCard vertical gap={16} style={{ height: '100%' }}>
            <Flex vertical gap={4}>
              <GChartTitle>Các cụm trường học</GChartTitle>
              <GChartText type="secondary">Đơn vị tính: Trường</GChartText>
            </Flex>
            <Flex gap={12} style={{ height: '100%' }}>
              <StreetMap />
            </Flex>
          </GCard>
        </Flex>
      </Col>
    </Row>
  </ContentCover>
}
const pie1 = [
  { label: 'Mầm non', value: 270418, color: chart_palette.palette_1 },
  { label: 'Tiểu học', value: 461660, color: chart_palette.palette_2 },
  { label: 'Trung học cơ sở', value: 259455, color: chart_palette.palette_3 },
  { label: 'Trung học phổ thông', value: 170534, color: chart_palette.palette_4 },
  { label: 'Giáo dục thường xuyên', value: 56033, color: chart_palette.palette_5 },
]
const pie2 = [
  { label: 'Nam', value: 621231, color: chart_palette.palette_1 },
  { label: 'Nữ', value: 596869, color: chart_palette.palette_2 },
]

const col1 = [
  { label: 'P. Long Xuyên', value: 18500 },
  { label: 'P. Châu Phú A', value: 16200 },
  { label: 'P. Bình Đức', value: 15100 },
  { label: 'P. Mỹ Thới', value: 13800 },
  { label: 'TT. An Châu', value: 12500 },
]

const bar1 = [
  { group: 'TT GDTX', label: 'Đã đồng bộ', value: 12 },
  { group: 'THPT', label: 'Đã đồng bộ', value: 107 },
  { group: 'THCS', label: 'Đã đồng bộ', value: 337 },
  { group: 'Tiểu học', label: 'Đã đồng bộ', value: 604 },
  { group: 'Mầm non', label: 'Đã đồng bộ', value: 593 },
  { group: 'TT GDTX', label: 'Chưa đồng bộ', value: 10 },
  { group: 'THPT', label: 'Chưa đồng bộ', value: 2 },
  { group: 'THCS', label: 'Chưa đồng bộ', value: 25 },
  { group: 'Tiểu học', label: 'Chưa đồng bộ', value: 53 },
  { group: 'Mầm non', label: 'Chưa đồng bộ', value: 31 },
]
const bar2 = [
  { group: 'TT GDTX', label: 'Quá hạn đồng bộ', value: 7 },
  { group: 'THPT', label: 'Quá hạn đồng bộ', value: 2 },
  { group: 'THCS', label: 'Quá hạn đồng bộ', value: 12 },
  { group: 'Tiểu học', label: 'Quá hạn đồng bộ', value: 30 },
  { group: 'Mầm non', label: 'Quá hạn đồng bộ', value: 15 },
  { group: 'TT GDTX', label: 'Có lỗi dữ liệu', value: 2 },
  { group: 'THPT', label: 'Có lỗi dữ liệu', value: 0 },
  { group: 'THCS', label: 'Có lỗi dữ liệu', value: 8 },
  { group: 'Tiểu học', label: 'Có lỗi dữ liệu', value: 15 },
  { group: 'Mầm non', label: 'Có lỗi dữ liệu', value: 10 },
  { group: 'TT GDTX', label: 'Chưa gửi dữ liệu', value: 2 },
  { group: 'THPT', label: 'Chưa gửi dữ liệu', value: 1 },
  { group: 'THCS', label: 'Chưa gửi dữ liệu', value: 5 },
  { group: 'Tiểu học', label: 'Chưa gửi dữ liệu', value: 8 },
  { group: 'Mầm non', label: 'Chưa gửi dữ liệu', value: 6 },
]
const bar3 = [
  { label: 'Giỏi', start: 0, end: 28 },
  { label: 'Khá', start: 28, end: 80 },
  { label: 'Trung bình', start: 80, end: 96 },
  { label: 'Yếu/Kém', start: 96, end: 100 },
]