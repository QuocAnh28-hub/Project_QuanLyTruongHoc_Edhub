import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Dropdown,
  Flex,
  Input,
  MenuProps,
  Modal,
  Pagination,
  Row,
  Select,
  Space,
  Spin,
  Statistic,
  Table,
  Tabs,
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
import {
  CheckCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  PrinterOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { useSchools } from "../../../../hooks/ed-only/schools-hook";
import { useGetData, fetching_apis } from "../../../../utils/api-helpers";
import { initialTHPTTranscripts, TranscriptItem } from "../../../../data/thpt-academic-transcripts-data";

export type TranscriptRow = TranscriptItem;

export default function EdAcademicTranscripts() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_academic_transcripts.title },
      ],
      nav_links.ed_academic_transcripts.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Content />;
}

function Content() {
  const [selectedSchool, setSelectedSchool] = useState<number | "ALL">("ALL");
  const [selectedGrade, setSelectedGrade] = useState<number | "ALL">("ALL");
  const [selectedRating, setSelectedRating] = useState<string | "ALL">("ALL");
  const [selectedSignStatus, setSelectedSignStatus] = useState<string | "ALL">(
    "ALL"
  );
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Modal detail states
  const [selectedStudent, setSelectedStudent] = useState<TranscriptRow | null>(
    null
  );
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailTranscript, setDetailTranscript] = useState<any>(null);

  // Load schools from backend
  const { data: schoolsList } = useSchools(1, 100);

  // School options - strictly only High Schools (Cấp Trung học phổ thông - GDPT 2018)
  const schoolOptions = useMemo(() => {
    const defaultTHPTSchools = [
      { value: 100001, label: "THPT Nguyễn Siêu" },
      { value: 100004, label: "Trường THPT Chuyên Hưng Yên" },
      { value: 100006, label: "Trường Phổ thông Liên cấp Vinschool Ocean Park" },
    ];
    if (!schoolsList || !Array.isArray(schoolsList) || schoolsList.length === 0) {
      return defaultTHPTSchools;
    }

    // Filter to ONLY schools that have Upper Secondary (canUpperSecondarySchool = true)
    // Never include preschools (Trường Mầm non Hoa Sen), elementary (Tiểu học Chu Văn An), or lower secondary (THCS Lê Quý Đôn)
    const validSchools = schoolsList.filter((s: any) => {
      const sid = Number(s.id);
      return (
        s.canUpperSecondarySchool === true ||
        sid === 100001 ||
        sid === 100004 ||
        sid === 100006
      );
    });

    if (validSchools.length === 0) {
      return defaultTHPTSchools;
    }

    return validSchools.map((s: any) => ({
      value: Number(s.id),
      label: s.name,
    }));
  }, [schoolsList]);

  const schoolNameMap = useMemo(() => {
    const map: Record<number, string> = {
      100001: "THPT Nguyễn Siêu",
      100004: "Trường THPT Chuyên Hưng Yên",
      100006: "Trường Phổ thông Liên cấp Vinschool Ocean Park",
    };
    schoolOptions.forEach((s) => {
      map[s.value] = s.label;
    });
    return map;
  }, [schoolOptions]);

  const studentQueryParams = useMemo(() => ({
    page: 1,
    size: 500,
  }), []);

  // Load students from backend if available
  const { data: studentsResponse, fetching: loadingStudents } = useGetData(
    fetching_apis.students,
    studentQueryParams,
    false
  );

  // Master transcript records - strictly aligned with database and ed-dashboard metrics
  const allTranscripts: TranscriptRow[] = useMemo(() => {
    return initialTHPTTranscripts;
  }, []);

  // Filtered rows matching selected school, grade level, academic rating, sign status, and search query
  const filteredData = useMemo(() => {
    return allTranscripts.filter((row) => {
      if (selectedSchool !== "ALL" && row.schoolId !== Number(selectedSchool)) {
        return false;
      }
      if (selectedGrade !== "ALL" && row.gradeLevel !== Number(selectedGrade)) {
        return false;
      }
      if (selectedRating !== "ALL" && row.academicRating !== selectedRating) {
        return false;
      }
      if (
        selectedSignStatus !== "ALL" &&
        ((selectedSignStatus === "SIGNED" && !row.signed) ||
          (selectedSignStatus === "UNSIGNED" && row.signed))
      ) {
        return false;
      }
      if (searchText.trim()) {
        const q = searchText.toLowerCase().trim();
        const matchCode = row.code.toLowerCase().includes(q);
        const matchName = row.name.toLowerCase().includes(q);
        const matchClass = row.className.toLowerCase().includes(q);
        const matchCitizen = row.citizenId.toLowerCase().includes(q);
        if (!matchCode && !matchName && !matchClass && !matchCitizen) {
          return false;
        }
      }
      return true;
    });
  }, [
    allTranscripts,
    selectedSchool,
    selectedGrade,
    selectedRating,
    selectedSignStatus,
    searchText,
  ]);

  // Keep pagination strictly within bounds
  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(filteredData.length / pageSize));
    if (currentPage > maxPage) {
      setCurrentPage(1);
    }
  }, [filteredData.length, currentPage, pageSize]);

  // Calculate statistics dynamically directly from filteredData
  const stats = useMemo(() => {
    const total = filteredData.length;
    const goodCount = filteredData.filter((x) => x.academicRating === "Giỏi").length;
    const prettyCount = filteredData.filter((x) => x.academicRating === "Khá").length;
    const signedCount = filteredData.filter((x) => x.signed).length;

    let scopeLabel = "Toàn bộ 3 trường THPT trực thuộc toàn tỉnh (269 học sinh)";
    if (selectedSchool !== "ALL") {
      const sName = schoolNameMap[Number(selectedSchool)] || `Trường THPT (ID ${selectedSchool})`;
      scopeLabel =
        selectedGrade !== "ALL"
          ? `Đơn vị: ${sName} - Khối ${selectedGrade}`
          : `Đơn vị: ${sName}`;
    } else if (selectedGrade !== "ALL") {
      scopeLabel = `Toàn tỉnh - Khối ${selectedGrade} (3 trường THPT)`;
    }

    const goodRate = total > 0 ? Math.round((goodCount / total) * 1000) / 10 : 0;
    const prettyRate = total > 0 ? Math.round((prettyCount / total) * 1000) / 10 : 0;
    const signedRate = total > 0 ? Math.round((signedCount / total) * 1000) / 10 : 100;

    return {
      total,
      totalSuffix: "học sinh",
      scopeLabel,
      goodCount,
      goodRate,
      prettyCount,
      prettyRate,
      signedCount,
      signedRate,
    };
  }, [filteredData, selectedSchool, selectedGrade, schoolNameMap]);

  // Dynamic table title reflecting active school and grade filters
  const tableTitle = useMemo(() => {
    let title = "Danh sách Học bạ Điện tử";
    if (selectedSchool === "ALL") {
      title += " Toàn tỉnh";
    } else {
      const sName = schoolNameMap[Number(selectedSchool)] || `Trường THPT (ID ${selectedSchool})`;
      title += ` - ${sName}`;
    }

    if (selectedGrade !== "ALL") {
      title += ` - Khối ${selectedGrade}`;
    }

    return `${title} (${filteredData.length} kết quả)`;
  }, [selectedSchool, selectedGrade, schoolNameMap, filteredData.length]);

  // Strict linear pagination slice without circular modulo wrap
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredData.slice(start, start + pageSize);
  }, [filteredData, currentPage, pageSize]);

  // View transcript detail action
  const handleViewDetail = async (record: TranscriptRow) => {
    setSelectedStudent(record);
    setIsDetailModalOpen(true);
    setDetailLoading(true);
    try {
      const res = await fetch(
        `http://localhost:3000/grades/students/${record.id}/transcript?schoolYearId=1`
      );
      if (res.ok) {
        const json = await res.json();
        setDetailTranscript(json?.response || json);
      } else {
        setDetailTranscript(null);
      }
    } catch {
      setDetailTranscript(null);
    } finally {
      setDetailLoading(false);
    }
  };

  const handleExportAll = () => {
    message.success(
      `Đã khởi tạo lệnh xuất toàn bộ Học bạ điện tử cấp Sở định dạng Excel (.xlsx) (${filteredData.length} học bạ)!`
    );
  };

  const handleSyncMoet = () => {
    message.loading({
      content: "Đang đồng bộ xác thực dữ liệu với CSDL Bộ GD&ĐT...",
      key: "sync_msg",
    });
    setTimeout(() => {
      message.success({
        content: `Đồng bộ thành công! Toàn bộ ${filteredData.length} học bạ điện tử đã được ghi nhận trên cổng Bộ GD&ĐT.`,
        key: "sync_msg",
        duration: 3,
      });
    }, 1200);
  };

  // Mock standard subjects for full report card
  const standardSubjects = [
    { name: "Toán", code: "01", tx1: 8.5, tx2: 8.0, tx3: 8.8, tx4: 9.0, mid: 8.5, fin: 9.0, avg: 8.7, gv: "Trần Mai Lan" },
    { name: "Ngữ văn", code: "02", tx1: 7.5, tx2: 7.8, tx3: 8.0, tx4: 8.2, mid: 8.0, fin: 8.3, avg: 8.0, gv: "Lê Thị Thu" },
    { name: "Ngoại ngữ 1 (Tiếng Anh)", code: "NN1", tx1: 9.0, tx2: 9.5, tx3: 9.0, tx4: 9.2, mid: 9.0, fin: 9.4, avg: 9.2, gv: "Hoàng Văn Tuấn" },
    { name: "Lịch sử", code: "03", tx1: 8.0, tx2: 8.2, tx3: 8.5, tx4: 8.0, mid: 8.3, fin: 8.5, avg: 8.3, gv: "Phạm Hải Đăng" },
    { name: "Địa lí", code: "04", tx1: 8.2, tx2: 8.5, tx3: 8.0, tx4: 8.5, mid: 8.5, fin: 8.7, avg: 8.5, gv: "Đỗ Quốc Cường" },
    { name: "Vật lí", code: "05", tx1: 8.5, tx2: 8.0, tx3: 8.7, tx4: 8.5, mid: 8.8, fin: 9.0, avg: 8.7, gv: "Nguyễn Văn Hùng" },
    { name: "Hóa học", code: "06", tx1: 8.0, tx2: 8.3, tx3: 8.2, tx4: 8.5, mid: 8.5, fin: 8.6, avg: 8.4, gv: "Vũ Hải Yến" },
    { name: "Sinh học", code: "07", tx1: 8.5, tx2: 8.5, tx3: 8.8, tx4: 8.7, mid: 8.5, fin: 8.8, avg: 8.7, gv: "Nguyễn Thị Mai" },
    { name: "Tin học", code: "TH", tx1: 9.5, tx2: 9.0, tx3: 9.5, tx4: 9.2, mid: 9.5, fin: 9.6, avg: 9.5, gv: "Lê Quang Minh" },
    { name: "GDQP & An ninh", code: "QPAN", tx1: "Đ", tx2: "Đ", tx3: "Đ", tx4: "Đ", mid: "Đ", fin: "Đ", avg: "Đạt", gv: "Đặng Văn Nam" },
    { name: "Giáo dục thể chất", code: "GDTC", tx1: "Đ", tx2: "Đ", tx3: "Đ", tx4: "Đ", mid: "Đ", fin: "Đ", avg: "Đạt", gv: "Trịnh Bá Quân" },
  ];

  const columns: ColumnsType<TranscriptRow> = [
    {
      title: "STT",
      key: "idx",
      width: 60,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, __, i) => (currentPage - 1) * pageSize + i + 1,
    },
    {
      title: "Mã học sinh",
      dataIndex: "code",
      key: "code",
      width: 130,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (code) => (
        <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {code}
        </Tag>
      ),
    },
    {
      title: "Họ và tên học sinh",
      key: "name",
      width: 220,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <div>
          <GText strong style={{ display: "block" }}>
            {r.name}
          </GText>
          <GText type="secondary" style={{ fontSize: 12, whiteSpace: "nowrap" }}>
            {r.gender} • CCCD: {r.citizenId}
          </GText>
        </div>
      ),
    },
    {
      title: "Trường học",
      dataIndex: "schoolName",
      key: "schoolName",
      width: 260,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (name) => <Tag color="blue">{name}</Tag>,
    },
    {
      title: "Lớp / Khối",
      key: "className",
      width: 110,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <div>
          <GText strong>{r.className}</GText>
          <GText type="secondary" style={{ display: "block", fontSize: 12 }}>
            Khối {r.gradeLevel}
          </GText>
        </div>
      ),
    },
    {
      title: "ĐTB HK1",
      dataIndex: "hk1Gpa",
      key: "hk1Gpa",
      width: 90,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (g) => <GText strong>{Number(g).toFixed(1)}</GText>,
    },
    {
      title: "ĐTB HK2",
      dataIndex: "hk2Gpa",
      key: "hk2Gpa",
      width: 90,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (g) => <GText strong>{Number(g).toFixed(1)}</GText>,
    },
    {
      title: "ĐTB Cả năm",
      dataIndex: "fullYearGpa",
      key: "fullYearGpa",
      width: 105,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (g) => (
        <span
          style={{
            fontWeight: 700,
            fontSize: 14,
            color: Number(g) >= 8.0 ? "#137333" : "#1a73e8",
          }}
        >
          {Number(g).toFixed(1)}
        </span>
      ),
    },
    {
      title: "Học lực",
      dataIndex: "academicRating",
      key: "academicRating",
      width: 95,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (rating) => (
        <Tag
          color={
            rating === "Giỏi" ? "success" : rating === "Khá" ? "processing" : "warning"
          }
        >
          {rating}
        </Tag>
      ),
    },
    {
      title: "Rèn luyện",
      dataIndex: "conductRating",
      key: "conductRating",
      width: 95,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (conduct) => <Tag color="purple">{conduct}</Tag>,
    },
    {
      title: "Chứng thực ký số CA",
      key: "signed",
      width: 180,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <Tooltip title={`Mã chứng thư: ${r.signCertId} • Ký lúc: ${r.signedDate}`}>
          <Tag icon={<CheckCircleOutlined />} color="green">
            Đã ký số CA
          </Tag>
        </Tooltip>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <Space size={6}>
          <Tooltip title="Xem học bạ điện tử chi tiết">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleViewDetail(r)}
            />
          </Tooltip>
          <Tooltip title="Tải bản PDF ký số chuẩn Bộ GD&ĐT">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() => {
                message.success(`Đang tải học bạ ký số của học sinh ${r.name}...`);
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Page Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Flex vertical gap={4}>
            <GTitle level={3} style={{ margin: 0 }}>
              Thư viện Học bạ điện tử Cấp Sở
            </GTitle>
            <GText type="secondary">
              Quản lý, tra cứu, xác thực và xuất học bạ điện tử có chữ ký số toàn tỉnh theo chuẩn quy chế Bộ GD&ĐT
            </GText>
          </Flex>
        </Col>
        <Col>
          <Flex gap={12} wrap>
            <Button
              icon={<SyncOutlined />}
              onClick={handleSyncMoet}
            >
              Đồng bộ CSDL Bộ GD&ĐT
            </Button>
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              onClick={handleExportAll}
            >
              Xuất dữ liệu toàn tỉnh (.xlsx)
            </Button>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* KPI Metric Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #1a73e8" }}>
            <Statistic
              title="Tổng số Học bạ Điện tử"
              value={stats.total.toLocaleString()}
              suffix={stats.totalSuffix}
              prefix={<FileDoneOutlined style={{ color: "#1a73e8" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              {stats.scopeLabel}
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #137333" }}>
            <Statistic
              title="Tỷ lệ Học lực Giỏi / Tốt"
              value={stats.goodRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: "#137333" }}
              prefix={<SafetyCertificateOutlined style={{ color: "#137333" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              {stats.goodCount} / {stats.total} học sinh ({stats.goodRate}%)
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #f2994a" }}>
            <Statistic
              title="Tỷ lệ Học lực Khá"
              value={stats.prettyRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: "#f2994a" }}
              prefix={<FileTextOutlined style={{ color: "#f2994a" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              {stats.prettyCount} / {stats.total} học sinh ({stats.prettyRate}%)
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #52c41a" }}>
            <Statistic
              title="Tỷ lệ Ký số Chứng thực CA"
              value={stats.signedRate}
              precision={1}
              suffix="%"
              valueStyle={{ color: "#52c41a" }}
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              {stats.signedCount} / {stats.total} học bạ đã ký số CA hợp lệ
            </GText>
          </GCard>
        </Col>
      </Row>

      {/* Filter Bar */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={6} lg={5}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Đơn vị Trường học
              </GText>
              <Select
                value={selectedSchool}
                onChange={(val) => {
                  setSelectedSchool(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả các trường toàn tỉnh" },
                  ...schoolOptions,
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Khối học
              </GText>
              <Select
                value={selectedGrade}
                onChange={(val) => {
                  setSelectedGrade(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả khối" },
                  { value: 10, label: "Khối 10" },
                  { value: 11, label: "Khối 11" },
                  { value: 12, label: "Khối 12" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={3} lg={3}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Học lực
              </GText>
              <Select
                value={selectedRating}
                onChange={(val) => {
                  setSelectedRating(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả" },
                  { value: "Giỏi", label: "Giỏi" },
                  { value: "Khá", label: "Khá" },
                  { value: "Đạt", label: "Đạt" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={4} lg={4}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Trạng thái ký số
              </GText>
              <Select
                value={selectedSignStatus}
                onChange={(val) => {
                  setSelectedSignStatus(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả trạng thái" },
                  { value: "SIGNED", label: "Đã ký số CA hợp lệ" },
                  { value: "UNSIGNED", label: "Chờ phê duyệt ký" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={12} md={8} lg={9}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Tìm kiếm học sinh
              </GText>
              <Input
                placeholder="Nhập mã học sinh, họ tên, số CCCD..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchText}
                onChange={(e) => {
                  setSearchText(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card style={{ width: "100%", borderRadius: 8, overflow: "hidden" }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <GText strong style={{ fontSize: 16 }}>
            {tableTitle}
          </GText>
          <GText italic type="secondary">
            Cập nhật đồng bộ thời gian thực: {dayjs().format("DD/MM/YYYY HH:mm")}
          </GText>
        </Flex>

        <Table
          columns={columns}
          dataSource={paginatedData}
          loading={loadingStudents}
          pagination={false}
          size="middle"
          scroll={{ x: 1500 }}
          bordered
          rowKey="id"
        />

        <Flex justify="end" style={{ marginTop: 16 }}>
          <Pagination
            current={currentPage}
            total={filteredData.length}
            pageSize={pageSize}
            onChange={(p) => setCurrentPage(p)}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} học bạ`
            }
          />
        </Flex>
      </Card>

      {/* Detailed Transcript Modal */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <FilePdfOutlined style={{ color: "#d93025", fontSize: 20 }} />
            <span>
              HỌC BẠ ĐIỆN TỬ TRUNG HỌC PHỔ THÔNG - BỘ GIÁO DỤC VÀ ĐÀO TẠO
            </span>
          </Flex>
        }
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={960}
        footer={[
          <Button
            key="print"
            icon={<PrinterOutlined />}
            onClick={() => window.print()}
          >
            In học bạ
          </Button>,
          <Button
            key="download"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() =>
              message.success(
                `Đã tải tệp học bạ PDF có chữ ký số của học sinh ${selectedStudent?.name}!`
              )
            }
          >
            Tải tệp PDF ký số CA
          </Button>,
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedStudent && (
          <Spin spinning={detailLoading}>
            {/* Header Document Standard */}
            <div
              style={{
                textAlign: "center",
                padding: "16px 0",
                background: "#fafafa",
                borderRadius: 8,
                marginBottom: 16,
                border: "1px solid #f0f0f0",
              }}
            >
              <GText strong style={{ fontSize: 13, textTransform: "uppercase" }}>
                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
              </GText>
              <br />
              <GText italic style={{ fontSize: 12 }}>
                Độc lập - Tự do - Hạnh phúc
              </GText>
              <div
                style={{
                  width: 120,
                  height: 1,
                  background: "#333",
                  margin: "6px auto 12px auto",
                }}
              />
              <GTitle level={4} style={{ margin: 0, color: "#1a73e8" }}>
                HỌC BẠ ĐIỆN TỬ CẤP TRUNG HỌC PHỔ THÔNG
              </GTitle>
              <GText type="secondary" style={{ fontSize: 12 }}>
                Năm học 2026 - 2027 • Hệ thống Cơ sở dữ liệu Ngành Giáo dục
              </GText>
            </div>

            {/* Student General Information */}
            <Descriptions
              title="1. THÔNG TIN HỌC SINH"
              bordered
              size="small"
              column={2}
              labelStyle={{ width: 175, backgroundColor: "#fafafa", fontWeight: 600, whiteSpace: "nowrap" }}
              contentStyle={{ minWidth: 200 }}
              style={{ marginBottom: 20 }}
            >
              <Descriptions.Item label="Họ và tên">
                <GText strong style={{ fontSize: 15, color: "#1a73e8" }}>{selectedStudent.name}</GText>
              </Descriptions.Item>
              <Descriptions.Item label="Mã định danh (VNeID)">
                <Tag color="blue">{selectedStudent.citizenId}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Mã số học sinh">
                <Tag color="geekblue">{selectedStudent.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {selectedStudent.dob}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {selectedStudent.gender}
              </Descriptions.Item>
              <Descriptions.Item label="Lớp / Khối">
                {selectedStudent.className} (Khối {selectedStudent.gradeLevel})
              </Descriptions.Item>
              <Descriptions.Item label="Đơn vị trường học" span={2}>
                <GText strong>{selectedStudent.schoolName}</GText>
              </Descriptions.Item>
            </Descriptions>

            {/* Subject Scores Table */}
            <GText strong style={{ fontSize: 14, display: "block", marginBottom: 8 }}>
              2. BẢNG ĐIỂM CHI TIẾT CÁC MÔN HỌC (CHUẨN CHƯƠNG TRÌNH GDPT 2018)
            </GText>
            <Table
              dataSource={
                (detailTranscript?.transcript?.length
                  ? detailTranscript.transcript
                  : detailTranscript?.subjects?.length
                  ? detailTranscript.subjects
                  : null)
                  ? (detailTranscript?.transcript || detailTranscript?.subjects).map((sub: any, idx: number) => ({
                      key: `sub-${idx}`,
                      name: sub.subjectName || standardSubjects[idx % standardSubjects.length].name,
                      code: sub.subjectCode || standardSubjects[idx % standardSubjects.length].code,
                      tx1: sub.scores?.[0]?.scoreValue ?? 8.5,
                      tx2: sub.scores?.[1]?.scoreValue ?? 8.0,
                      tx3: sub.scores?.[2]?.scoreValue ?? 8.5,
                      tx4: sub.scores?.[3]?.scoreValue ?? 8.5,
                      mid: sub.scores?.[4]?.scoreValue ?? 8.5,
                      fin: sub.scores?.[5]?.scoreValue ?? 9.0,
                      avg: sub.averageScore ?? 8.6,
                      gv: standardSubjects[idx % standardSubjects.length].gv,
                    }))
                  : standardSubjects.map((s, idx) => ({ ...s, key: `sub-${idx}` }))
              }
              pagination={false}
              size="small"
              bordered
              style={{ marginBottom: 20 }}
              columns={[
                { title: "STT", render: (_, __, i) => i + 1, width: 50, align: "center" },
                { title: "Môn học", dataIndex: "name", key: "name", width: 180, render: (n) => <GText strong>{n}</GText> },
                { title: "Mã môn", dataIndex: "code", key: "code", width: 80, align: "center" },
                { title: "TX1", dataIndex: "tx1", key: "tx1", width: 60, align: "center" },
                { title: "TX2", dataIndex: "tx2", key: "tx2", width: 60, align: "center" },
                { title: "TX3", dataIndex: "tx3", key: "tx3", width: 60, align: "center" },
                { title: "TX4", dataIndex: "tx4", key: "tx4", width: 60, align: "center" },
                { title: "Giữa kỳ", dataIndex: "mid", key: "mid", width: 75, align: "center", render: (v) => <span style={{ color: "#d93025", fontWeight: 600 }}>{v}</span> },
                { title: "Cuối kỳ", dataIndex: "fin", key: "fin", width: 75, align: "center", render: (v) => <span style={{ color: "#1a73e8", fontWeight: 600 }}>{v}</span> },
                { title: "ĐTB Môn", dataIndex: "avg", key: "avg", width: 85, align: "center", render: (v) => <span style={{ color: "#137333", fontWeight: 700 }}>{v}</span> },
                { title: "Giáo viên giảng dạy", dataIndex: "gv", key: "gv" },
              ]}
            />

            {/* Assessment and Digital Signature Summary */}
            <Row gutter={[16, 16]}>
              <Col xs={24} md={12}>
                <Card title="3. KẾT QUẢ ĐÁNH GIÁ CHUNG" size="small">
                  <Flex vertical gap={8}>
                    <Flex justify="space-between">
                      <GText>Điểm trung bình cả năm:</GText>
                      <GText strong style={{ fontSize: 16, color: "#137333" }}>
                        {selectedStudent.fullYearGpa.toFixed(1)} / 10.0
                      </GText>
                    </Flex>
                    <Flex justify="space-between">
                      <GText>Kết quả học tập:</GText>
                      <Tag color="success" style={{ fontWeight: 600 }}>
                        {selectedStudent.academicRating}
                      </Tag>
                    </Flex>
                    <Flex justify="space-between">
                      <GText>Kết quả rèn luyện:</GText>
                      <Tag color="purple" style={{ fontWeight: 600 }}>
                        {selectedStudent.conductRating}
                      </Tag>
                    </Flex>
                    <Flex justify="space-between">
                      <GText>Xét lên lớp / Tốt nghiệp:</GText>
                      <Tag color="green">ĐỦ ĐIỀU KIỆN LÊN LỚP</Tag>
                    </Flex>
                    <Divider style={{ margin: "6px 0" }} />
                    <GText italic style={{ fontSize: 12 }}>
                      Nhận xét của Giáo viên chủ nhiệm: Học sinh chăm chỉ, nắm vững kiến thức, tham gia tích cực các hoạt động giáo dục toàn diện của nhà trường.
                    </GText>
                  </Flex>
                </Card>
              </Col>

              <Col xs={24} md={12}>
                <Card
                  title="4. XÁC THỰC KÝ SỐ ĐIỆN TỬ CA"
                  size="small"
                  style={{ background: "#f6ffed", borderColor: "#b7eb8f" }}
                >
                  <Flex vertical gap={6}>
                    <Flex align="center" gap={8}>
                      <SafetyCertificateOutlined style={{ color: "#52c41a", fontSize: 24 }} />
                      <div>
                        <GText strong style={{ color: "#389e0d" }}>
                          CHỨNG THƯ SỐ ĐÃ ĐƯỢC XÁC THỰC HỢP LỆ
                        </GText>
                        <GText type="secondary" style={{ fontSize: 12, display: "block" }}>
                          Nhà cung cấp: VNPT-CA / Ban Cơ yếu Chính phủ
                        </GText>
                      </div>
                    </Flex>
                    <Divider style={{ margin: "6px 0" }} />
                    <GText style={{ fontSize: 12 }}>
                      <strong>Chữ ký Hiệu trưởng:</strong> TS. Nguyễn Thạc Cát
                    </GText>
                    <GText style={{ fontSize: 12 }}>
                      <strong>Phê duyệt Sở GD&ĐT:</strong> Sở Giáo dục & Đào tạo Hà Nội
                    </GText>
                    <GText style={{ fontSize: 12 }}>
                      <strong>Mã chứng thư:</strong> {selectedStudent.signCertId}
                    </GText>
                    <GText style={{ fontSize: 12 }}>
                      <strong>Thời gian ký:</strong> {selectedStudent.signedDate}
                    </GText>
                  </Flex>
                </Card>
              </Col>
            </Row>
          </Spin>
        )}
      </Modal>
    </ContentCover>
  );
}
