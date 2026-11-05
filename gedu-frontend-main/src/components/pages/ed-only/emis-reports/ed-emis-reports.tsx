import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Input,
  Modal,
  Progress,
  Radio,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  message,
} from "antd";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import ReportReadyStatusTag from "../../../atoms/report-ready-status";
import {
  ArrowRightOutlined,
  CloseOutlined,
  DownloadOutlined,
  ResetOutlined,
  SearchOutlined,
} from "../../../atoms/svg/outlined-icons";
import { svg_degree } from "../../../atoms/svg/svg-list";
import {
  ApartmentOutlined,
  CheckCircleOutlined,
  DatabaseOutlined,
  FileExcelOutlined,
  FilePdfOutlined,
  PrinterOutlined,
  SyncOutlined,
  TeamOutlined,
} from "@ant-design/icons";

interface EmisFormData {
  id: string;
  code: string;
  title: string;
  description: string;
  category: string;
  status: 1 | 2 | 3; // 1: Chưa tổng hợp, 2: Đang tổng hợp, 3: Đã tổng hợp
  updatedAt: string;
  summaryKpis: { label: string; value: string; color?: string }[];
  tableHeaders: string[];
  tableData: any[];
}

export default function EdEMISReports() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_emis_reports.title },
      ],
      nav_links.ed_emis_reports.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return <Content />;
}

function Content() {
  const [selectedYear, setSelectedYear] = useState<string>("2026-2027");
  const [selectedPeriod, setSelectedPeriod] = useState<number>(1);
  const [aggregatingId, setAggregatingId] = useState<string | null>(null);
  const [viewingForm, setViewingForm] = useState<EmisFormData | null>(null);
  const [formSearchText, setFormSearchText] = useState<string>("");

  // Map period label
  const periodMap: Record<number, string> = {
    1: "Đầu năm học (Tháng 9)",
    2: "Giữa kỳ I (Tháng 11)",
    3: "Cuối kỳ I (Tháng 1)",
    4: "Giữa kỳ II (Tháng 3)",
    5: "Cuối năm học (Tháng 5)",
  };

  // State of the 4 EMIS forms
  const [formsState, setFormsState] = useState<Record<string, { status: 1 | 2 | 3; updatedAt: string }>>({
    Bieu_mau_CSDL_MNPT_01: { status: 3, updatedAt: "05/11/2026 08:30:00" },
    Bieu_mau_CSDL_MNPT_02: { status: 3, updatedAt: "05/11/2026 08:32:15" },
    Bieu_mau_CSDL_MNPT_03: { status: 2, updatedAt: "05/11/2026 08:45:00" },
    Bieu_mau_CSDL_MNPT_04: { status: 1, updatedAt: "04/11/2026 17:00:00" },
  });

  // Base raw data for the 4 official EMIS forms
  const formsConfig: EmisFormData[] = useMemo(() => {
    return [
      {
        id: "EMIS-01",
        code: "Bieu_mau_CSDL_MNPT_01",
        title: "Thống kê Mạng lưới Trường lớp",
        description:
          "Báo cáo số liệu tổng quan về trường, lớp, điểm trường, diện tích đất sử dụng và bán kính phục vụ trên toàn địa bàn.",
        category: "MẠNG LƯỚI TRƯỜNG LỚP",
        status: formsState.Bieu_mau_CSDL_MNPT_01.status,
        updatedAt: formsState.Bieu_mau_CSDL_MNPT_01.updatedAt,
        summaryKpis: [
          { label: "Tổng số trường THPT", value: "24 trường", color: "#1a73e8" },
          { label: "Tổng số lớp học", value: "680 lớp", color: "#137333" },
          { label: "Lớp học 2 buổi/ngày", value: "100%", color: "#9c27b0" },
        ],
        tableHeaders: ["STT", "Mã trường", "Tên đơn vị trường học", "Loại hình", "Số lớp", "Sĩ số HS", "Phòng học", "Diện tích (m²)", "Trạng thái Đạt chuẩn"],
        tableData: [
          { stt: 1, code: "THPT-001", name: "Trường THPT Chuyên Hà Nội - Amsterdam", type: "Công lập", classes: 45, students: 1650, rooms: 52, area: "32,500", standard: "Chuẩn QG Mức 2" },
          { stt: 2, code: "THPT-002", name: "Trường THPT Chu Văn An", type: "Công lập", classes: 42, students: 1540, rooms: 48, area: "28,400", standard: "Chuẩn QG Mức 2" },
          { stt: 3, code: "THPT-003", name: "Trường THPT Nguyễn Siêu", type: "Tư thục", classes: 36, students: 1080, rooms: 42, area: "19,800", standard: "Chuẩn QG Mức 2" },
          { stt: 4, code: "THPT-004", name: "Trường THPT Kim Liên", type: "Công lập", classes: 39, students: 1450, rooms: 44, area: "15,200", standard: "Chuẩn QG Mức 1" },
          { stt: 5, code: "THPT-005", name: "Trường THPT Thăng Long", type: "Công lập", classes: 36, students: 1380, rooms: 40, area: "14,600", standard: "Chuẩn QG Mức 1" },
          { stt: 6, code: "THPT-006", name: "Trường THPT Phan Đình Phùng", type: "Công lập", classes: 36, students: 1390, rooms: 42, area: "16,800", standard: "Chuẩn QG Mức 1" },
          { stt: 7, code: "THPT-007", name: "Trường THPT Việt Đức", type: "Công lập", classes: 38, students: 1420, rooms: 42, area: "14,100", standard: "Chuẩn QG Mức 1" },
          { stt: 8, code: "THPT-008", name: "Trường THPT Yên Hòa", type: "Công lập", classes: 35, students: 1350, rooms: 38, area: "13,900", standard: "Chuẩn QG Mức 1" },
        ],
      },
      {
        id: "EMIS-02",
        code: "Bieu_mau_CSDL_MNPT_02",
        title: "Thống kê Đội ngũ Cán bộ, Giáo viên, Nhân viên",
        description:
          "Báo cáo chi tiết về số lượng, trình độ, chuẩn nghề nghiệp, cơ cấu bộ môn và tỷ lệ biên chế của đội ngũ nhân sự toàn ngành.",
        category: "ĐỘI NGŨ NHÂN SỰ",
        status: formsState.Bieu_mau_CSDL_MNPT_02.status,
        updatedAt: formsState.Bieu_mau_CSDL_MNPT_02.updatedAt,
        summaryKpis: [
          { label: "Tổng số CBGV-NV", value: "1,840 người", color: "#1a73e8" },
          { label: "Trình độ ThS & TS", value: "48.2%", color: "#137333" },
          { label: "Đạt chuẩn nghề nghiệp", value: "100%", color: "#f2994a" },
        ],
        tableHeaders: ["STT", "Mã trường", "Tên đơn vị trường học", "Tổng CBGV", "Cán bộ quản lý", "Giáo viên trực tiếp", "Nhân viên", "Trình độ ThS/TS", "Đảng viên"],
        tableData: [
          { stt: 1, code: "THPT-001", name: "Trường THPT Chuyên Hà Nội - Amsterdam", total: 112, mgmt: 4, teachers: 92, staff: 16, masterDoc: "72 (64.3%)", party: "68 (60.7%)" },
          { stt: 2, code: "THPT-002", name: "Trường THPT Chu Văn An", total: 104, mgmt: 4, teachers: 86, staff: 14, masterDoc: "61 (58.7%)", party: "62 (59.6%)" },
          { stt: 3, code: "THPT-003", name: "Trường THPT Nguyễn Siêu", total: 96, mgmt: 3, teachers: 80, staff: 13, masterDoc: "55 (57.3%)", party: "48 (50.0%)" },
          { stt: 4, code: "THPT-004", name: "Trường THPT Kim Liên", total: 98, mgmt: 3, teachers: 81, staff: 14, masterDoc: "46 (46.9%)", party: "54 (55.1%)" },
          { stt: 5, code: "THPT-005", name: "Trường THPT Thăng Long", total: 92, mgmt: 3, teachers: 76, staff: 13, masterDoc: "42 (45.7%)", party: "50 (54.3%)" },
          { stt: 6, code: "THPT-006", name: "Trường THPT Phan Đình Phùng", total: 90, mgmt: 3, teachers: 75, staff: 12, masterDoc: "40 (44.4%)", party: "49 (54.4%)" },
        ],
      },
      {
        id: "EMIS-03",
        code: "Bieu_mau_CSDL_MNPT_03",
        title: "Thống kê Học sinh",
        description:
          "Báo cáo chi tiết về sĩ số học sinh, phân loại theo độ tuổi, giới tính, dân tộc, diện chính sách và cấp mã định danh VNeID.",
        category: "QUẢN LÝ HỌC SINH",
        status: formsState.Bieu_mau_CSDL_MNPT_03.status,
        updatedAt: formsState.Bieu_mau_CSDL_MNPT_03.updatedAt,
        summaryKpis: [
          { label: "Tổng số học sinh THPT", value: "24,560 HS", color: "#1a73e8" },
          { label: "Tỷ lệ học sinh Nữ", value: "51.2%", color: "#e91e63" },
          { label: "Xác thực định danh CCCD", value: "99.8%", color: "#137333" },
        ],
        tableHeaders: ["STT", "Mã trường", "Tên đơn vị trường học", "Tổng số HS", "Học sinh Nữ", "Dân tộc thiểu số", "Học sinh Khối 10", "Học sinh Khối 11", "Học sinh Khối 12", "Chính sách"],
        tableData: [
          { stt: 1, code: "THPT-001", name: "Trường THPT Chuyên Hà Nội - Amsterdam", total: 1650, female: 865, ethnic: 18, g10: 550, g11: 550, g12: 550, policy: 14 },
          { stt: 2, code: "THPT-002", name: "Trường THPT Chu Văn An", total: 1540, female: 810, ethnic: 24, g10: 520, g11: 510, g12: 510, policy: 22 },
          { stt: 3, code: "THPT-003", name: "Trường THPT Nguyễn Siêu", total: 1080, female: 540, ethnic: 8, g10: 360, g11: 360, g12: 360, policy: 12 },
          { stt: 4, code: "THPT-004", name: "Trường THPT Kim Liên", total: 1450, female: 750, ethnic: 15, g10: 490, g11: 480, g12: 480, policy: 18 },
          { stt: 5, code: "THPT-005", name: "Trường THPT Thăng Long", total: 1380, female: 710, ethnic: 12, g10: 460, g11: 460, g12: 460, policy: 16 },
        ],
      },
      {
        id: "EMIS-04",
        code: "Bieu_mau_CSDL_MNPT_04",
        title: "Thống kê Cơ sở vật chất & Thiết bị Dạy học",
        description:
          "Báo cáo về tình hình phòng học, thư viện đạt chuẩn, phòng bộ môn, máy vi tính và danh mục thiết bị dạy học tối thiểu theo Thông tư 37/38/39 của Bộ GD&ĐT.",
        category: "CƠ SỞ VẬT CHẤT & THIẾT BỊ",
        status: formsState.Bieu_mau_CSDL_MNPT_04.status,
        updatedAt: formsState.Bieu_mau_CSDL_MNPT_04.updatedAt,
        summaryKpis: [
          { label: "Tổng phòng học kiên cố", value: "720 phòng (100%)", color: "#137333" },
          { label: "Phòng máy tính & LAB", value: "96 phòng", color: "#1a73e8" },
          { label: "Bộ thiết bị tối thiểu", value: "100% Đạt chuẩn", color: "#f2994a" },
        ],
        tableHeaders: ["STT", "Mã trường", "Tên đơn vị trường học", "Phòng học kiên cố", "Phòng Lý - Hóa - Sinh", "Phòng Tin học", "Số máy tính", "Thư viện tiên tiến", "Tỷ lệ thiết bị"],
        tableData: [
          { stt: 1, code: "THPT-001", name: "Trường THPT Chuyên Hà Nội - Amsterdam", solidRooms: 52, scienceLabs: 6, computerLabs: 5, computers: 220, library: "Thư viện số chuẩn Quốc gia", devRate: "100%" },
          { stt: 2, code: "THPT-002", name: "Trường THPT Chu Văn An", solidRooms: 48, scienceLabs: 6, computerLabs: 4, computers: 180, library: "Thư viện tiên tiến", devRate: "100%" },
          { stt: 3, code: "THPT-003", name: "Trường THPT Nguyễn Siêu", solidRooms: 42, scienceLabs: 5, computerLabs: 4, computers: 175, library: "Thư viện số thông minh", devRate: "100%" },
          { stt: 4, code: "THPT-004", name: "Trường THPT Kim Liên", solidRooms: 44, scienceLabs: 4, computerLabs: 4, computers: 160, library: "Thư viện tiên tiến", devRate: "98.5%" },
          { stt: 5, code: "THPT-005", name: "Trường THPT Thăng Long", solidRooms: 40, scienceLabs: 4, computerLabs: 3, computers: 140, library: "Thư viện tiên tiến", devRate: "98.0%" },
        ],
      },
    ];
  }, [formsState]);

  // Handler: trigger data aggregation
  const handleAggregate = (code: string, title: string) => {
    setAggregatingId(code);
    message.loading({
      content: `Đang kết nối API CSDL ngành EMIS và đồng bộ dữ liệu cho biểu mẫu "${title}"...`,
      key: `agg_${code}`,
      duration: 0,
    });

    setTimeout(() => {
      setFormsState((prev) => ({
        ...prev,
        [code]: {
          status: 3,
          updatedAt: dayjs().format("DD/MM/YYYY HH:mm:ss"),
        },
      }));
      setAggregatingId(null);
      message.success({
        content: `Đã tổng hợp thành công dữ liệu biểu mẫu "${title}" từ 24 trường học toàn tỉnh!`,
        key: `agg_${code}`,
        duration: 3,
      });
    }, 1500);
  };

  // Handler: export Excel file (.xlsx / .csv download simulation)
  const handleExportExcel = (form: EmisFormData) => {
    message.loading({
      content: `Đang kết xuất biểu mẫu ${form.code} ra tệp Excel (.xlsx)...`,
      key: "exp_emis",
    });

    setTimeout(() => {
      // Build CSV content with BOM for Vietnamese characters in Excel
      const headers = form.tableHeaders.join(",");
      const rows = form.tableData.map((row) => Object.values(row).join(",")).join("\n");
      const csvContent = "\uFEFF" + `${form.title} - Năm học ${selectedYear} - ${periodMap[selectedPeriod]}\n\n` + headers + "\n" + rows;

      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `${form.code}_${selectedYear.replace("-", "_")}_Ky_${selectedPeriod}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success({
        content: `Đã tải xuống thành công tệp dữ liệu biểu mẫu "${form.title}"!`,
        key: "exp_emis",
        duration: 3,
      });
    }, 800);
  };

  // Filtered modal table rows
  const filteredModalTableData = useMemo(() => {
    if (!viewingForm) return [];
    if (!formSearchText.trim()) return viewingForm.tableData;
    const q = formSearchText.toLowerCase().trim();
    return viewingForm.tableData.filter((row) =>
      Object.values(row).some((val) => String(val).toLowerCase().includes(q))
    );
  }, [viewingForm, formSearchText]);

  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Flex vertical gap={4}>
            <GTitle level={3} style={{ margin: 0 }}>
              Báo cáo Thống kê EMIS (Bộ GD&ĐT)
            </GTitle>
            <GText type="secondary">
              Hệ thống kết nối Cơ sở dữ liệu Toàn ngành Giáo dục Mầm non & Phổ thông theo chuẩn quy định Bộ Giáo dục và Đào tạo
            </GText>
          </Flex>
        </Col>
        <Col>
          <GText italic type="secondary">
            Cập nhật đồng bộ: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
          </GText>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* Filter Parameters */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Row gutter={[20, 16]} align="middle">
          <Col xs={24} sm={10} md={6}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Năm học thống kê
              </GText>
              <Select
                style={{ width: "100%" }}
                value={selectedYear}
                onChange={(val) => {
                  setSelectedYear(val);
                  message.info(`Đã chuyển sang số liệu thống kê EMIS năm học ${val}`);
                }}
                options={[
                  { value: "2026-2027", label: "Năm học 2026 - 2027 (Hiện tại)" },
                  { value: "2025-2026", label: "Năm học 2025 - 2026" },
                  { value: "2024-2025", label: "Năm học 2024 - 2025" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={14} md={18}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Kỳ báo cáo EMIS
              </GText>
              <Radio.Group
                style={{ whiteSpace: "nowrap", width: "100%" }}
                value={selectedPeriod}
                onChange={(e) => {
                  setSelectedPeriod(e.target.value);
                  message.info(`Đã chọn kỳ báo cáo: ${periodMap[e.target.value]}`);
                }}
                buttonStyle="solid"
              >
                <Radio.Button value={1}>Đầu năm học</Radio.Button>
                <Radio.Button value={2}>Giữa kỳ I</Radio.Button>
                <Radio.Button value={3}>Cuối kỳ I</Radio.Button>
                <Radio.Button value={4}>Giữa kỳ II</Radio.Button>
                <Radio.Button value={5}>Cuối năm học</Radio.Button>
              </Radio.Group>
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* Grid of 4 EMIS Forms */}
      <Flex vertical gap={12}>
        <Flex align="center" gap={8}>
          <DatabaseOutlined style={{ color: "#1a73e8", fontSize: 18 }} />
          <GTitle level={4} style={{ margin: 0 }}>
            Biểu mẫu Thống kê Cơ sở Dữ liệu Giáo dục Mầm non & Phổ thông (CSDL MNPT)
          </GTitle>
        </Flex>

        <Row gutter={[16, 16]}>
          {formsConfig.map((item) => {
            const isAggregating = aggregatingId === item.code;
            return (
              <Col xs={24} lg={12} key={item.id}>
                <Card
                  hoverable
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    borderRadius: 8,
                    borderTop: `4px solid ${
                      item.status === 3 ? "#137333" : item.status === 2 ? "#1a73e8" : "#d9d9d9"
                    }`,
                  }}
                  styles={{
                    body: {
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                      gap: 12,
                      padding: 18,
                    },
                  }}
                >
                  <Flex gap={16} align="flex-start">
                    {svg_degree(48)}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <Flex justify="space-between" align="center" wrap gap={8}>
                        <GText strong style={{ fontSize: 16 }}>
                          {item.title}
                        </GText>
                        <Tag color="blue" style={{ fontFamily: "monospace", margin: 0 }}>
                          {item.code}
                        </Tag>
                      </Flex>
                      <GText type="secondary" style={{ fontSize: 13, marginTop: 4, display: "block" }}>
                        {item.description}
                      </GText>
                    </div>
                  </Flex>

                  {/* Summary KPI Badges */}
                  <div
                    style={{
                      backgroundColor: "#f8fafc",
                      padding: "10px 14px",
                      borderRadius: 6,
                      border: "1px solid #eef2f6",
                    }}
                  >
                    <Row gutter={12}>
                      {item.summaryKpis.map((kpi, ki) => (
                        <Col span={8} key={ki}>
                          <GText type="secondary" style={{ fontSize: 11, display: "block", whiteSpace: "nowrap" }}>
                            {kpi.label}
                          </GText>
                          <GText strong style={{ fontSize: 14, color: kpi.color || "#1a73e8" }}>
                            {kpi.value}
                          </GText>
                        </Col>
                      ))}
                    </Row>
                  </div>

                  {/* Status & Last Updated */}
                  <Flex justify="space-between" align="center" style={{ paddingTop: 4 }}>
                    <Flex align="center" gap={8}>
                      <GText type="secondary" style={{ fontSize: 12 }}>
                        Trạng thái:
                      </GText>
                      <ReportReadyStatusTag status={item.status} />
                    </Flex>
                    <GText type="secondary" style={{ fontSize: 11 }}>
                      Cập nhật: {item.updatedAt}
                    </GText>
                  </Flex>

                  <Divider style={{ margin: "4px 0" }} />

                  {/* Action Buttons */}
                  <Flex gap={10} wrap align="center">
                    <Button
                      type="primary"
                      icon={<ArrowRightOutlined />}
                      onClick={() => setViewingForm(item)}
                    >
                      Xem báo cáo
                    </Button>

                    <Button
                      icon={<DownloadOutlined />}
                      onClick={() => handleExportExcel(item)}
                    >
                      Xuất Excel
                    </Button>

                    {item.status === 3 ? (
                      <Button
                        icon={<SyncOutlined spin={isAggregating} />}
                        loading={isAggregating}
                        onClick={() => handleAggregate(item.code, item.title)}
                      >
                        Tổng hợp lại
                      </Button>
                    ) : item.status === 2 ? (
                      <Button
                        danger
                        icon={<CloseOutlined />}
                        onClick={() => {
                          setFormsState((p) => ({
                            ...p,
                            [item.code]: { ...p[item.code], status: 1 },
                          }));
                          message.info(`Đã tạm dừng tổng hợp dữ liệu cho biểu mẫu "${item.title}"`);
                        }}
                      >
                        Hủy bỏ
                      </Button>
                    ) : (
                      <Button
                        type="dashed"
                        icon={<SyncOutlined spin={isAggregating} />}
                        loading={isAggregating}
                        onClick={() => handleAggregate(item.code, item.title)}
                      >
                        Tổng hợp dữ liệu
                      </Button>
                    )}
                  </Flex>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Flex>

      {/* Modal View Detailed Official EMIS Report */}
      <Modal
        title={
          <Flex align="center" gap={10}>
            <DatabaseOutlined style={{ color: "#1a73e8", fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              {viewingForm?.code} - {viewingForm?.title.toUpperCase()}
            </span>
          </Flex>
        }
        open={Boolean(viewingForm)}
        onCancel={() => {
          setViewingForm(null);
          setFormSearchText("");
        }}
        width={1000}
        footer={[
          <Button key="print" icon={<PrinterOutlined />} onClick={() => window.print()}>
            In biểu mẫu
          </Button>,
          <Button
            key="excel"
            type="primary"
            icon={<FileExcelOutlined />}
            onClick={() => viewingForm && handleExportExcel(viewingForm)}
          >
            Xuất Excel (.xlsx)
          </Button>,
          <Button
            key="close"
            onClick={() => {
              setViewingForm(null);
              setFormSearchText("");
            }}
          >
            Đóng
          </Button>,
        ]}
      >
        {viewingForm && (
          <Flex vertical gap={16} style={{ marginTop: 8 }}>
            {/* Formal Header */}
            <div
              style={{
                textAlign: "center",
                borderBottom: "2px solid #1a73e8",
                paddingBottom: 12,
                backgroundColor: "#f8fafc",
                padding: "16px",
                borderRadius: 8,
              }}
            >
              <GText strong style={{ fontSize: 13, letterSpacing: 0.5, display: "block" }}>
                BỘ GIÁO DỤC VÀ ĐÀO TẠO • HỆ THỐNG CƠ SỞ DỮ LIỆU TOÀN NGÀNH (EMIS)
              </GText>
              <GTitle level={3} style={{ margin: "6px 0 2px 0", color: "#1a73e8" }}>
                {viewingForm.title.toUpperCase()}
              </GTitle>
              <GText style={{ fontSize: 13, display: "block" }}>
                Mã số biểu mẫu: <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 700 }}>{viewingForm.code}</Tag>
              </GText>
              <GText italic type="secondary" style={{ fontSize: 12 }}>
                Năm học: {selectedYear} • Kỳ báo cáo: {periodMap[selectedPeriod]} • Đơn vị tổng hợp: Sở Giáo dục và Đào tạo
              </GText>
            </div>

            {/* Summary Statistics */}
            <Row gutter={[16, 16]}>
              {viewingForm.summaryKpis.map((k, i) => (
                <Col span={8} key={i}>
                  <Card size="small" style={{ backgroundColor: "#f8fafc", textAlign: "center" }}>
                    <Statistic
                      title={<span style={{ fontSize: 12 }}>{k.label}</span>}
                      value={k.value}
                      valueStyle={{ color: k.color || "#1a73e8", fontSize: 18, fontWeight: 700 }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Search Filter inside Modal */}
            <Flex justify="space-between" align="center">
              <GText strong style={{ fontSize: 14 }}>
                BẢNG TỔNG HỢP CHI TIẾT THEO CÁC ĐƠN VỊ TRƯỜNG THPT ({filteredModalTableData.length} TRƯỜNG):
              </GText>
              <Input
                placeholder="Tìm theo tên trường, mã trường..."
                prefix={<SearchOutlined />}
                style={{ width: 280 }}
                allowClear
                value={formSearchText}
                onChange={(e) => setFormSearchText(e.target.value)}
              />
            </Flex>

            {/* Table of schools in modal */}
            <Table
              dataSource={filteredModalTableData}
              pagination={false}
              size="small"
              bordered
              rowKey="stt"
              scroll={{ x: 800 }}
              columns={viewingForm.tableHeaders.map((headerText, index) => {
                const keys = Object.keys(viewingForm.tableData[0] || {});
                const key = keys[index] || `col_${index}`;
                return {
                  title: headerText,
                  dataIndex: key,
                  key: key,
                  align: index === 0 ? "center" : undefined,
                  width: index === 0 ? 55 : index === 1 ? 110 : undefined,
                  render: (val: any) => {
                    if (index === 1) {
                      return <Tag color="geekblue">{val}</Tag>;
                    }
                    if (key === "standard" || key === "devRate") {
                      return <Tag color="success">{val}</Tag>;
                    }
                    return val;
                  },
                };
              })}
            />
          </Flex>
        )}
      </Modal>
    </ContentCover>
  );
}
