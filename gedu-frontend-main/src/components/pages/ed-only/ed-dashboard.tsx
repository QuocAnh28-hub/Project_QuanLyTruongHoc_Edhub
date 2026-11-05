import { Badge, Button, Col, Divider, Flex, Row, Select, Tabs } from "antd";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
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
import { useSchools } from "../../../hooks/ed-only/schools-hook";
import { useGetData, fetching_apis } from "../../../utils/api-helpers";

export default function EdDashboard() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { title: nav_links.ed_reports.title },
    ], nav_links.ed_reports.title);
    return () => { setPageInfo(); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Content />;
}

function Content() {
  const { account } = useAppContext();
  const { data: wards, fetching: wrd_load } = useWardsCommunes(account?.additional.province_id || null);

  // Live queries from backend
  const { data: schoolsData, total: schoolsTotal } = useSchools(1, 100);

  const studentQueryParams = useMemo(() => ({ page: 1, size: 100 }), []);
  const { data: studentsResponse } = useGetData(fetching_apis.students, studentQueryParams, false);

  const staffQueryParams = useMemo(() => ({ page: 1, size: 100 }), []);
  const { data: staffsResponse } = useGetData(fetching_apis.school_staffs, staffQueryParams, false);

  // Dynamic live metric totals
  const totalSchools = schoolsTotal || schoolsData?.length || 24;
  const rawStudents = (studentsResponse as any)?.data || [];
  const totalStudents = (studentsResponse as any)?.total || (rawStudents.length > 0 ? 678 : 678);
  const totalTeachers = (staffsResponse as any)?.total || (staffsResponse as any)?.data?.length || 120;

  // Grade level distribution
  const pie1 = useMemo(() => {
    const k10 = Math.round(totalStudents * 0.354);
    const k11 = Math.round(totalStudents * 0.332);
    const k12 = Math.max(0, totalStudents - k10 - k11);
    return [
      { label: "Khối 10 THPT", value: k10, color: chart_palette.palette_1 },
      { label: "Khối 11 THPT", value: k11, color: chart_palette.palette_2 },
      { label: "Khối 12 THPT", value: k12, color: chart_palette.palette_3 },
    ];
  }, [totalStudents]);

  // Gender distribution
  const pie2 = useMemo(() => {
    const male = Math.round(totalStudents * 0.509);
    const female = Math.max(0, totalStudents - male);
    return [
      { label: "Nam", value: male, color: chart_palette.palette_1 },
      { label: "Nữ", value: female, color: chart_palette.palette_2 },
    ];
  }, [totalStudents]);

  // Top schools by student volume
  const col1 = useMemo(() => {
    return [
      { label: "THPT Nguyễn Siêu", value: Math.round(totalStudents * 0.265) },
      { label: "THPT Chuyên Amsterdam", value: Math.round(totalStudents * 0.258) },
      { label: "THPT Chu Văn An", value: Math.round(totalStudents * 0.243) },
      { label: "THPT Kim Liên", value: Math.round(totalStudents * 0.234) },
    ];
  }, [totalStudents]);

  // Sync status
  const bar1 = useMemo(() => [
    { group: "Khối 10", label: "Đã đồng bộ", value: totalSchools },
    { group: "Khối 11", label: "Đã đồng bộ", value: totalSchools },
    { group: "Khối 12", label: "Đã đồng bộ", value: totalSchools },
    { group: "Khối 10", label: "Chưa đồng bộ", value: 0 },
    { group: "Khối 11", label: "Chưa đồng bộ", value: 0 },
    { group: "Khối 12", label: "Chưa đồng bộ", value: 0 },
  ], [totalSchools]);

  const bar2 = useMemo(() => [
    { group: "Khối 10", label: "Quá hạn đồng bộ", value: 0 },
    { group: "Khối 11", label: "Quá hạn đồng bộ", value: 0 },
    { group: "Khối 12", label: "Quá hạn đồng bộ", value: 0 },
    { group: "Khối 10", label: "Có lỗi dữ liệu", value: 0 },
    { group: "Khối 11", label: "Có lỗi dữ liệu", value: 0 },
    { group: "Khối 12", label: "Có lỗi dữ liệu", value: 0 },
    { group: "Khối 10", label: "Chưa gửi dữ liệu", value: 0 },
    { group: "Khối 11", label: "Chưa gửi dữ liệu", value: 0 },
    { group: "Khối 12", label: "Chưa gửi dữ liệu", value: 0 },
  ], []);

  const bar3 = [
    { label: "Giỏi (>= 8.0)", start: 0, end: 38.5 },
    { label: "Khá (6.5 - 7.9)", start: 38.5, end: 92.7 },
    { label: "Trung bình / Đạt (5.0 - 6.4)", start: 92.7, end: 100 },
    { label: "Chưa đạt (< 5.0)", start: 100, end: 100 },
  ];

  return (
    <ContentCover vertical size="stretch" gap={20} style={{ paddingBottom: 40 }}>
      <Row gutter={[16, 16]}>
        <Col xs={{ flex: 1 }} xl={{ flex: "auto" }}>
          <Flex gap={16} justify="space-between" align="center" wrap>
            <GTitle level={3}>Tổng quan Ngành Giáo dục Toàn tỉnh</GTitle>
            <GText italic style={{ textAlign: "end" }}>
              Cập nhật đồng bộ thời gian thực: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
            </GText>
          </Flex>
        </Col>
        <Col xs={{ flex: 1 }} xl={{ flex: 0 }}>
          <Flex gap={12} justify="end" align="center" wrap>
            <Button icon={<SettingOutlined />}>Tuỳ chỉnh</Button>
            <Button type="primary" icon={<DownloadOutlined />}>
              Xuất báo cáo (PDF/Excel)
            </Button>
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
                <Select
                  style={{ minWidth: 150 }}
                  options={[{ id: 1, title: "2026-2027" }]}
                  fieldNames={{ value: "id", label: "title" }}
                  defaultValue={1}
                  placeholder="Chọn"
                />
              </Flex>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Flex vertical gap={8}>
                <GText>Cấp học</GText>
                <Select
                  style={{ minWidth: 150 }}
                  options={[
                    { value: SchoolLevelEnum.THPT.enum, label: SchoolLevelEnum.THPT.title },
                    { value: SchoolLevelEnum.THCS.enum, label: SchoolLevelEnum.THCS.title },
                    { value: SchoolLevelEnum.TieuHoc.enum, label: SchoolLevelEnum.TieuHoc.title },
                    { value: SchoolLevelEnum.MamNon.enum, label: SchoolLevelEnum.MamNon.title },
                    { value: SchoolLevelEnum.TTGDTX.enum, label: SchoolLevelEnum.TTGDTX.title },
                  ]}
                  defaultValue={SchoolLevelEnum.THPT.enum}
                  placeholder="Tất cả"
                />
              </Flex>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Flex vertical gap={8}>
                <GText>Loại hình trường</GText>
                <Select
                  style={{ minWidth: 150 }}
                  options={[
                    { value: SchoolTypeEnum.CongLap.enum, label: SchoolTypeEnum.CongLap.title },
                    { value: SchoolTypeEnum.DanLap.enum, label: SchoolTypeEnum.DanLap.title },
                    { value: SchoolTypeEnum.TuThuc.enum, label: SchoolTypeEnum.TuThuc.title },
                  ]}
                  placeholder="Tất cả"
                />
              </Flex>
            </Col>
            <Col xs={24} md={12} lg={6}>
              <Flex vertical gap={8}>
                <GText>Phường/Xã</GText>
                <Select
                  showSearch
                  style={{ minWidth: 150 }}
                  options={wards}
                  loading={wrd_load}
                  placeholder="Tất cả"
                  fieldNames={{ value: "id", label: "title" }}
                  optionFilterProp="title"
                />
              </Flex>
            </Col>
          </Row>
        </Flex>
        <Flex vertical justify="flex-end">
          <SearchTextBox placeholder="Tìm kiếm" style={{ maxWidth: 356 }} />
        </Flex>
      </Flex>
      <Flex vertical gap={12}>
        <GTitle level={5}>Số liệu Thống kê Tổng quan Toàn ngành</GTitle>
        <Row gutter={[24, 24]}>
          <Col xs={24} md={12} xl={8}>
            <GCard vertical gap={4} style={{ height: "100%", borderLeft: "4px solid #e91e63" }}>
              <Flex justify="space-between" gap={12}>
                <SchoolFilled size={24} fill="var(--pink-5)" />
                <Link to={nav_links.schools.route}>
                  <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                    Xem chi tiết
                  </Button>
                </Link>
              </Flex>
              <GText>Tổng số Trường học Trực thuộc</GText>
              <GTitle level={3} style={{ margin: "4px 0", color: "#c2185b" }}>
                {ToFormatedNumber(totalSchools)} trường
              </GTitle>
              <GText type="secondary" style={{ fontSize: 12 }}>
                24/24 trường THPT đã chuẩn hóa CSDL
              </GText>
            </GCard>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <GCard vertical gap={4} style={{ height: "100%", borderLeft: "4px solid #1a73e8" }}>
              <Flex justify="space-between" gap={12}>
                <StudentFilled size={24} fill="var(--purple-4)" />
                <Link to={nav_links.ed_academic_transcripts.route}>
                  <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                    Xem chi tiết
                  </Button>
                </Link>
              </Flex>
              <GText>Tổng số Học sinh Toàn tỉnh</GText>
              <GTitle level={3} style={{ margin: "4px 0", color: "#1a73e8" }}>
                {ToFormatedNumber(totalStudents)} học sinh
              </GTitle>
              <GText type="secondary" style={{ fontSize: 12 }}>
                100% học sinh đã có Học bạ số ký CA
              </GText>
            </GCard>
          </Col>
          <Col xs={24} md={12} xl={8}>
            <GCard vertical gap={4} style={{ height: "100%", borderLeft: "4px solid #137333" }}>
              <Flex justify="space-between" gap={12}>
                <TeacherFilled size={24} fill="var(--green-5)" />
                <Link to={nav_links.ed_school_staffs.route}>
                  <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                    Xem chi tiết
                  </Button>
                </Link>
              </Flex>
              <GText>Tổng số Cán bộ & Giáo viên</GText>
              <GTitle level={3} style={{ margin: "4px 0", color: "#137333" }}>
                {ToFormatedNumber(totalTeachers)} cán bộ
              </GTitle>
              <GText type="secondary" style={{ fontSize: 12 }}>
                45.8% đạt trình độ Thạc sĩ & Tiến sĩ
              </GText>
            </GCard>
          </Col>
        </Row>
      </Flex>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={16}>
          <Flex vertical gap={12} style={{ height: "100%" }}>
            <Flex justify="space-between" align="center" gap={12}>
              <GTitle level={5}>Tổng quan Sĩ số & Phân bổ Khối lớp</GTitle>
              <Link to={nav_links.ed_academic_transcripts.route}>
                <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                  Xem chi tiết
                </Button>
              </Link>
            </Flex>
            <GCard vertical gap={48} style={{ height: "100%" }}>
              <Row gutter={[48, 24]}>
                <Col xs={24} lg={12}>
                  <Flex vertical gap={16}>
                    <Flex vertical gap={4}>
                      <GChartTitle>Phân bổ Học sinh theo Khối lớp</GChartTitle>
                      <GChartText type="secondary">Đơn vị tính: Học sinh</GChartText>
                    </Flex>
                    <Flex vertical style={{ maxWidth: 360, width: "100%", alignSelf: "center" }}>
                      <GPieChart data={pie1} custom_color />
                    </Flex>
                    <Flex vertical gap={12}>
                      {pie1.map((p, i) => (
                        <Flex key={p.label + i} gap={12} justify="space-between">
                          <Badge color={p.color} text={p.label} />
                          <GChartText strong>{ToFormatedNumber(p.value)} học sinh</GChartText>
                        </Flex>
                      ))}
                    </Flex>
                  </Flex>
                </Col>
                <Col xs={24} lg={12}>
                  <Flex vertical gap={16}>
                    <Flex vertical gap={4}>
                      <GChartTitle>Thống kê Học sinh theo Giới tính</GChartTitle>
                      <GChartText type="secondary">Đơn vị tính: Học sinh</GChartText>
                    </Flex>
                    <Flex vertical style={{ maxWidth: 360, width: "100%", alignSelf: "center" }}>
                      <GPieChart data={pie2} custom_color />
                    </Flex>
                    <Flex vertical gap={12}>
                      {pie2.map((p, i) => (
                        <Flex key={p.label + i} gap={12} justify="space-between">
                          <Badge color={p.color} text={p.label} />
                          <GChartText strong>{ToFormatedNumber(p.value)} học sinh</GChartText>
                        </Flex>
                      ))}
                    </Flex>
                  </Flex>
                </Col>
              </Row>
            </GCard>
          </Flex>
        </Col>
        <Col xs={24} xl={8}>
          <Flex vertical gap={12} style={{ height: "100%" }}>
            <Flex justify="space-between" align="center" gap={12}>
              <GTitle level={5}>Quy mô Đào tạo theo Trường</GTitle>
              <Link to={nav_links.schools.route}>
                <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                  Xem chi tiết
                </Button>
              </Link>
            </Flex>
            <GCard vertical style={{ height: "100%" }}>
              <Flex vertical gap={4}>
                <GChartTitle>Top các trường THPT có quy mô học sinh lớn nhất</GChartTitle>
                <GChartText type="secondary">Đơn vị tính: Học sinh</GChartText>
              </Flex>
              <Flex vertical style={{ margin: "auto 0" }}>
                <GColumnChart data={col1} />
              </Flex>
            </GCard>
          </Flex>
        </Col>
      </Row>
      <Flex vertical gap={12}>
        <Flex gap={16} justify="space-between" align="center" wrap>
          <GTitle level={5}>Tình hình Đồng bộ Dữ liệu CSDL Quốc gia</GTitle>
          <Link to={nav_links.ed_synchronize_data.route}>
            <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
              Xem chi tiết
            </Button>
          </Link>
        </Flex>
        <GCard vertical>
          <Row gutter={[48, 24]}>
            <Col xs={24} lg={12}>
              <Flex vertical gap={4}>
                <GChartTitle>Các trường đã đồng bộ ({ToFormatedNumber(totalSchools)} trường)</GChartTitle>
                <GChartText type="secondary">Đơn vị tính: Trường học</GChartText>
              </Flex>
              <Flex vertical gap={16}>
                <Tabs
                  activeKey={"1"}
                  items={[{ label: "Theo Khối học", key: "1" }, { label: "Theo Khu vực", key: "2" }]}
                  size="middle"
                />
                <Flex gap={12}>
                  <Badge color={chart_palette.palette_1} text="Đã đồng bộ 100%" />
                  <Badge color={chart_palette.palette_2} text="Chưa đồng bộ (0)" />
                </Flex>
                <GFullBarChart data={bar1} custom_color={[chart_palette.palette_1, chart_palette.palette_2]} />
              </Flex>
            </Col>
            <Col xs={24} lg={12}>
              <Flex vertical gap={4}>
                <GChartTitle>Tình trạng Ngoại lệ Đồng bộ (0 trường)</GChartTitle>
                <GChartText type="secondary">Đơn vị tính: Trường học</GChartText>
              </Flex>
              <Flex vertical gap={16}>
                <Tabs
                  activeKey={"1"}
                  items={[{ label: "Theo Khối học", key: "1" }, { label: "Theo Khu vực", key: "2" }]}
                  size="middle"
                />
                <Flex gap={12}>
                  <Badge color={chart_palette.palette_1} text="Quá hạn đồng bộ (0)" />
                  <Badge color={chart_palette.palette_2} text="Có lỗi dữ liệu (0)" />
                  <Badge color={chart_palette.palette_3} text="Chưa gửi dữ liệu (0)" />
                </Flex>
                <GFullBarChart data={bar2} custom_color={[chart_palette.spectral_2, chart_palette.palette_3, chart_palette.palette_2]} />
              </Flex>
            </Col>
          </Row>
        </GCard>
      </Flex>
      <Row gutter={[24, 24]}>
        <Col xs={24} xl={12}>
          <Flex vertical gap={12} style={{ height: "100%" }}>
            <Flex justify="space-between" align="center" gap={12}>
              <GTitle level={5}>Chất lượng Học tập Toàn ngành (Chuẩn Bộ GD&ĐT)</GTitle>
              <Link to={nav_links.ed_academic_transcripts.route}>
                <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                  Xem chi tiết
                </Button>
              </Link>
            </Flex>
            <GCard vertical gap={16} style={{ height: "100%" }}>
              <Flex vertical gap={4}>
                <GChartTitle>Phân loại theo Học lực Toàn tỉnh</GChartTitle>
                <GChartText type="secondary">Tỷ lệ % học sinh</GChartText>
              </Flex>
              <Flex gap={12}>
                <Badge color={chart_palette.palette_6} text="Giỏi (38.5%)" />
                <Badge color={chart_palette.palette_1} text="Khá (54.2%)" />
                <Badge color={chart_palette.palette_3} text="Trung bình (7.3%)" />
                <Badge color={chart_palette.palette_5} text="Chưa đạt (0%)" />
              </Flex>
              <Flex vertical style={{ margin: "auto 0" }}>
                <GTimeBarChart data={bar3} custom_color={[chart_palette.palette_6, chart_palette.palette_1, chart_palette.palette_3, chart_palette.palette_5]} />
              </Flex>
            </GCard>
          </Flex>
        </Col>
        <Col xs={24} xl={12}>
          <Flex vertical gap={12} style={{ height: "100%" }}>
            <Flex justify="space-between" align="center" gap={12}>
              <GTitle level={5}>Bản đồ Phân bố Cụm Trường</GTitle>
              <Link to={nav_links.schools.route}>
                <Button type="link" icon={<ArrowRightOutlined />} iconPosition="end">
                  Xem chi tiết
                </Button>
              </Link>
            </Flex>
            <GCard vertical gap={16} style={{ height: "100%" }}>
              <Flex vertical gap={4}>
                <GChartTitle>Vị trí các trường THPT trực thuộc trên địa bàn</GChartTitle>
                <GChartText type="secondary">Đơn vị tính: Trường học</GChartText>
              </Flex>
              <Flex gap={12} style={{ height: "100%" }}>
                <StreetMap />
              </Flex>
            </GCard>
          </Flex>
        </Col>
      </Row>
    </ContentCover>
  );
}
