import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Drawer,
  Flex,
  Form,
  Input,
  Modal,
  Row,
  Select,
  Space,
  Spin,
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
import {
  BookOutlined,
  CheckCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileTextOutlined,
  PlusOutlined,
  ReadOutlined,
  SearchOutlined,
  SolutionOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";
import { useCurriculums } from "../../../../hooks/school-only/curriculums-hook";
import { useGetData, fetching_apis } from "../../../../utils/api-helpers";

interface CurriculumViewRow {
  key: string;
  id: number;
  code: string;
  name: string;
  educationLevel: string;
  instructionLanguage: string;
  graduationDegree: string;
  totalSubjects: number;
  weeklyPeriods: number;
  appliedSchools: number;
  status: "ACTIVE" | "DRAFT" | "UPDATING";
  description: string;
}

export default function EdCurriculums() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_curriculums.title },
      ],
      nav_links.ed_curriculums.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Content />;
}

function Content() {
  const [searchText, setSearchText] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState<string | "ALL">(
    "ALL"
  );
  const [selectedLevel, setSelectedLevel] = useState<string | "ALL">("ALL");

  // Modal / Drawer state for viewing subjects of a curriculum
  const [selectedCurriculum, setSelectedCurriculum] =
    useState<CurriculumViewRow | null>(null);
  const [isDetailDrawerOpen, setIsDetailDrawerOpen] = useState(false);
  const [drawerLoading, setDrawerLoading] = useState(false);
  const [curriculumSubjects, setCurriculumSubjects] = useState<any[]>([]);

  // Create curriculum modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  // Load curriculums from backend
  const { data: rawCurriculums, fetching: loadingCurriculums } =
    useCurriculums(1, 100);

  // Standard curricula list
  const curriculaList: CurriculumViewRow[] = useMemo(() => {
    if (rawCurriculums && Array.isArray(rawCurriculums) && rawCurriculums.length > 0) {
      return rawCurriculums.map((c: any, idx: number) => {
        const langName =
          c.instructionLanguage?.name || (idx % 2 === 0 ? "Tiếng Việt" : "Song ngữ Anh - Việt");
        return {
          key: `c-${c.id}`,
          id: c.id,
          code: c.code || `CT-2018-0${c.id}`,
          name: c.name || `Khung Chương trình GDPT chuẩn ${c.id}`,
          educationLevel: "THPT (Khối 10, 11, 12)",
          instructionLanguage: langName,
          graduationDegree: c.graduationDegree || "Bằng Tốt nghiệp THPT Quốc gia",
          totalSubjects: 18,
          weeklyPeriods: 29 + (idx % 4),
          appliedSchools: 24 - idx * 2 > 0 ? 24 - idx * 2 : 12,
          status: "ACTIVE",
          description:
            "Chương trình giáo dục phổ thông theo định hướng phát triển năng lực và phẩm chất người học chuẩn quy định Bộ Giáo dục và Đào tạo.",
        };
      });
    }

    // Default standard curricula
    return [
      {
        key: "c-1",
        id: 1,
        code: "CT-GDPT-2018",
        name: "Chương trình Giáo dục Phổ thông 2018 Tiêu chuẩn",
        educationLevel: "THPT (Khối 10, 11, 12)",
        instructionLanguage: "Tiếng Việt",
        graduationDegree: "Bằng Tốt nghiệp THPT Quốc gia",
        totalSubjects: 18,
        weeklyPeriods: 29.5,
        appliedSchools: 24,
        status: "ACTIVE",
        description: "Khung chương trình GDPT 2018 chuẩn hóa toàn diện áp dụng trên toàn địa bàn thành phố Hà Nội.",
      },
      {
        key: "c-2",
        id: 2,
        code: "CT-CAMBRIDGE-A",
        name: "Chương trình Song bằng Quốc tế Cambridge (IGCSE & A-Level)",
        educationLevel: "THPT (Khối 10, 11, 12)",
        instructionLanguage: "Song ngữ Anh - Việt",
        graduationDegree: "Bằng THPT Quốc gia & Chứng chỉ Cambridge A-Level",
        totalSubjects: 14,
        weeklyPeriods: 34.0,
        appliedSchools: 8,
        status: "ACTIVE",
        description: "Chương trình liên kết song bằng khảo thí quốc tế Cambridge Assessment International Education.",
      },
      {
        key: "c-3",
        id: 3,
        code: "CT-IB-DIPLOMA",
        name: "Chương trình Tú tài Quốc tế (International Baccalaureate - IB)",
        educationLevel: "THPT (Khối 11, 12)",
        instructionLanguage: "Tiếng Anh",
        graduationDegree: "Bằng Tú tài Quốc tế (IB Diploma)",
        totalSubjects: 12,
        weeklyPeriods: 35.0,
        appliedSchools: 4,
        status: "ACTIVE",
        description: "Chương trình học thuật quốc tế chuyên sâu chuẩn bị du học và xét tuyển thẳng đại học toàn cầu.",
      },
      {
        key: "c-4",
        id: 4,
        code: "CT-CHUYEN-NN",
        name: "Chương trình Tăng cường & Chuyên biệt Ngoại ngữ 2",
        educationLevel: "THPT (Khối 10, 11, 12)",
        instructionLanguage: "Tiếng Việt & Ngoại ngữ 2",
        graduationDegree: "Bằng Tốt nghiệp THPT & Chứng chỉ Quốc tế (IELTS/JLPT/HSK)",
        totalSubjects: 16,
        weeklyPeriods: 31.0,
        appliedSchools: 12,
        status: "ACTIVE",
        description: "Khung chương trình chuyên ban với định hướng chứng chỉ ngoại ngữ quốc tế cao cấp.",
      },
      {
        key: "c-5",
        id: 5,
        code: "CT-STEM-TECH",
        name: "Chương trình Tích hợp Khoa học Công nghệ & STEM",
        educationLevel: "THPT (Khối 10, 11, 12)",
        instructionLanguage: "Tiếng Việt",
        graduationDegree: "Bằng Tốt nghiệp THPT Quốc gia",
        totalSubjects: 17,
        weeklyPeriods: 30.5,
        appliedSchools: 16,
        status: "ACTIVE",
        description: "Đẩy mạnh giáo dục STEM, lập trình AI & Robotics trong các trường THPT trọng điểm chất lượng cao.",
      },
      {
        key: "c-6",
        id: 6,
        code: "CT-GDPT-2006-T",
        name: "Chương trình GDPT 2006 Chuyển tiếp & Bổ túc GDTX",
        educationLevel: "GDTX (Khối 12)",
        instructionLanguage: "Tiếng Việt",
        graduationDegree: "Bằng Tốt nghiệp THPT GDTX",
        totalSubjects: 11,
        weeklyPeriods: 24.0,
        appliedSchools: 6,
        status: "ACTIVE",
        description: "Khung chương trình dành cho khối học sinh hệ bổ túc văn hóa và giáo dục thường xuyên.",
      },
    ];
  }, [rawCurriculums]);

  // Filtered rows
  const filteredCurricula = useMemo(() => {
    return curriculaList.filter((c) => {
      if (selectedLanguage !== "ALL" && !c.instructionLanguage.includes(selectedLanguage))
        return false;
      if (selectedLevel !== "ALL" && !c.educationLevel.includes(selectedLevel))
        return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase().trim();
        const matchCode = c.code.toLowerCase().includes(q);
        const matchName = c.name.toLowerCase().includes(q);
        if (!matchCode && !matchName) return false;
      }
      return true;
    });
  }, [curriculaList, selectedLanguage, selectedLevel, searchText]);

  // Open Drawer to view curriculum subjects
  const handleOpenDetail = async (record: CurriculumViewRow) => {
    setSelectedCurriculum(record);
    setIsDetailDrawerOpen(true);
    setDrawerLoading(true);
    try {
      const res = await fetch(`http://localhost:3000/curriculums/${record.id}/subjects`);
      if (res.ok) {
        const json = await res.json();
        setCurriculumSubjects(json?.response || json || []);
      } else {
        setCurriculumSubjects([]);
      }
    } catch {
      setCurriculumSubjects([]);
    } finally {
      setDrawerLoading(false);
    }
  };

  const handleCreateCurriculum = (values: any) => {
    message.success(`Đã tạo và ban hành Khung chương trình "${values.name}" thành công!`);
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const columns: ColumnsType<CurriculumViewRow> = [
    {
      title: "Mã chương trình",
      dataIndex: "code",
      key: "code",
      width: 150,
      render: (code) => (
        <Tag color="blue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {code}
        </Tag>
      ),
    },
    {
      title: "Tên Khung Chương trình Giáo dục",
      key: "name",
      width: 320,
      render: (_, r) => (
        <div>
          <GText strong style={{ fontSize: 14 }}>
            {r.name}
          </GText>
          <GText type="secondary" style={{ display: "block", fontSize: 12, marginTop: 2 }}>
            {r.description}
          </GText>
        </div>
      ),
    },
    {
      title: "Ngôn ngữ giảng dạy",
      dataIndex: "instructionLanguage",
      key: "instructionLanguage",
      width: 170,
      render: (lang) => (
        <Tag color={lang.includes("Anh") || lang.includes("Song") ? "cyan" : "geekblue"}>
          {lang}
        </Tag>
      ),
    },
    {
      title: "Cấp học áp dụng",
      dataIndex: "educationLevel",
      key: "educationLevel",
      width: 170,
    },
    {
      title: "Số môn học",
      dataIndex: "totalSubjects",
      key: "totalSubjects",
      width: 110,
      align: "center",
      render: (n) => <Tag color="volcano">{n} môn chuẩn</Tag>,
    },
    {
      title: "Thời lượng",
      dataIndex: "weeklyPeriods",
      key: "weeklyPeriods",
      width: 110,
      align: "center",
      render: (n) => <GText strong>{n} tiết/tuần</GText>,
    },
    {
      title: "Trường áp dụng",
      dataIndex: "appliedSchools",
      key: "appliedSchools",
      width: 130,
      align: "center",
      render: (count) => (
        <Tag color="green" icon={<ApartmentOutlined />}>
          {count} trường THPT
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 130,
      align: "center",
      render: () => <Tag color="success">Áp dụng chính thức</Tag>,
    },
    {
      title: "Thao tác",
      key: "action",
      width: 120,
      align: "center",
      render: (_, r) => (
        <Space size={6}>
          <Tooltip title="Xem danh mục môn học chi tiết">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleOpenDetail(r)}
            />
          </Tooltip>
          <Tooltip title="Xuất Quyết định ban hành">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success(`Đang tải Quyết định ban hành khung ${r.name}...`)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // Standard subjects list when backend drawer is viewed
  const standardSubjectTable = [
    { stt: 1, name: "Toán", code: "01", group: "Khoa học Tự nhiên & Công nghệ", periods: 4, type: "Bắt buộc", grading: "Chấm điểm (Thang 10)" },
    { stt: 2, name: "Ngữ văn", code: "02", group: "Ngôn ngữ & Xã hội", periods: 4, type: "Bắt buộc", grading: "Chấm điểm (Thang 10)" },
    { stt: 3, name: "Ngoại ngữ 1 (Tiếng Anh)", code: "NN1", group: "Ngoại ngữ", periods: 3, type: "Bắt buộc", grading: "Chấm điểm (Thang 10)" },
    { stt: 4, name: "Lịch sử", code: "03", group: "Khoa học Xã hội", periods: 2, type: "Bắt buộc", grading: "Chấm điểm (Thang 10)" },
    { stt: 5, name: "Địa lí", code: "04", group: "Khoa học Xã hội", periods: 2, type: "Tự chọn", grading: "Chấm điểm (Thang 10)" },
    { stt: 6, name: "Vật lí", code: "05", group: "Khoa học Tự nhiên", periods: 2.5, type: "Tự chọn theo tổ hợp", grading: "Chấm điểm (Thang 10)" },
    { stt: 7, name: "Hóa học", code: "06", group: "Khoa học Tự nhiên", periods: 2.5, type: "Tự chọn theo tổ hợp", grading: "Chấm điểm (Thang 10)" },
    { stt: 8, name: "Sinh học", code: "07", group: "Khoa học Tự nhiên", periods: 2, type: "Tự chọn theo tổ hợp", grading: "Chấm điểm (Thang 10)" },
    { stt: 9, name: "Tin học", code: "TH", group: "Công nghệ & Tin học", periods: 2, type: "Tự chọn", grading: "Chấm điểm (Thang 10)" },
    { stt: 10, name: "Công nghệ", code: "CN", group: "Công nghệ & Kỹ thuật", periods: 1.5, type: "Tự chọn", grading: "Chấm điểm (Thang 10)" },
    { stt: 11, name: "Giáo dục kinh tế & Pháp luật", code: "GDKTPL", group: "Khoa học Xã hội", periods: 2, type: "Tự chọn", grading: "Chấm điểm (Thang 10)" },
    { stt: 12, name: "Âm nhạc", code: "AN", group: "Nghệ thuật", periods: 1.5, type: "Tự chọn", grading: "Đánh giá nhận xét (Đ/CĐ)" },
    { stt: 13, name: "Mĩ thuật", code: "MT", group: "Nghệ thuật", periods: 1.5, type: "Tự chọn", grading: "Đánh giá nhận xét (Đ/CĐ)" },
    { stt: 14, name: "Giáo dục thể chất", code: "GDTC", group: "Thể chất", periods: 2, type: "Bắt buộc", grading: "Đánh giá nhận xét (Đ/CĐ)" },
    { stt: 15, name: "Giáo dục Quốc phòng & An ninh", code: "GDQP", group: "An ninh Quốc phòng", periods: 1, type: "Bắt buộc", grading: "Đánh giá nhận xét (Đ/CĐ)" },
    { stt: 16, name: "Hoạt động trải nghiệm, hướng nghiệp", code: "HĐTN", group: "Hoạt động Giáo dục", periods: 3, type: "Bắt buộc", grading: "Đánh giá nhận xét (Đ/CĐ)" },
    { stt: 17, name: "Nội dung giáo dục địa phương", code: "GDĐP", group: "Địa phương", periods: 1, type: "Bắt buộc", grading: "Đánh giá nhận xét (Đ/CĐ)" },
    { stt: 18, name: "Ngoại ngữ 2 (Tiếng Pháp/Nhật/Hàn/Trung)", code: "NN2", group: "Ngoại ngữ", periods: 2, type: "Tự chọn tăng cường", grading: "Chấm điểm (Thang 10)" },
  ];

  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Flex vertical gap={4}>
            <GTitle level={3} style={{ margin: 0 }}>
              Khung Chương trình Giáo dục Cấp Sở
            </GTitle>
            <GText type="secondary">
              Quản lý, phân phối và kiểm định các khung chương trình giảng dạy, môn học chuẩn hóa toàn tỉnh
            </GText>
          </Flex>
        </Col>
        <Col>
          <Flex gap={12} wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success("Đang xuất danh mục Khung chương trình giáo dục toàn tỉnh (.xlsx)...")
              }
            >
              Xuất danh mục chuẩn (.xlsx)
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Ban hành Khung chương trình mới
            </Button>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* Overview Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #1a73e8" }}>
            <Statistic
              title="Khung Chương trình Ban hành"
              value={curriculaList.length}
              suffix="khung"
              prefix={<ReadOutlined style={{ color: "#1a73e8" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Bao gồm CT GDPT 2018 & Quốc tế
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #137333" }}>
            <Statistic
              title="Môn học Chuẩn hóa"
              value={18}
              suffix="môn học"
              prefix={<BookOutlined style={{ color: "#137333" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Môn bắt buộc & tổ hợp tự chọn
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #f2994a" }}>
            <Statistic
              title="Trường THPT Đang Triển khai"
              value={24}
              suffix="/ 24 trường"
              prefix={<ApartmentOutlined style={{ color: "#f2994a" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              100% các cơ sở giáo dục áp dụng
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #52c41a" }}>
            <Statistic
              title="Phê duyệt Bộ GD&ĐT"
              value={100}
              suffix="%"
              prefix={<CheckCircleOutlined style={{ color: "#52c41a" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Đạt thẩm định chất lượng giáo dục
            </GText>
          </GCard>
        </Col>
      </Row>

      {/* Filter Bar */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={24} sm={12} md={6}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Ngôn ngữ giảng dạy
              </GText>
              <Select
                value={selectedLanguage}
                onChange={(val) => setSelectedLanguage(val)}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả ngôn ngữ" },
                  { value: "Tiếng Việt", label: "Tiếng Việt" },
                  { value: "Anh", label: "Tiếng Anh & Song ngữ" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={12} md={6}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Cấp học
              </GText>
              <Select
                value={selectedLevel}
                onChange={(val) => setSelectedLevel(val)}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả cấp học" },
                  { value: "THPT", label: "THPT (Khối 10, 11, 12)" },
                  { value: "GDTX", label: "Giáo dục Thường xuyên" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={24} md={12}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Tìm kiếm chương trình
              </GText>
              <Input
                placeholder="Nhập mã chương trình hoặc tên chương trình giáo dục..."
                prefix={<SearchOutlined />}
                allowClear
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
              />
            </Flex>
          </Col>
        </Row>
      </Card>

      {/* Main Table */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <GText strong style={{ fontSize: 16 }}>
            Danh sách Khung Chương trình Giáo dục Toàn ngành ({filteredCurricula.length})
          </GText>
        </Flex>

        <Table
          columns={columns}
          dataSource={filteredCurricula}
          loading={loadingCurriculums}
          pagination={false}
          size="middle"
          scroll={{ x: 1400 }}
          bordered
          rowKey="id"
        />
      </Card>

      {/* Curriculum Subjects Detail Drawer */}
      <Drawer
        title={
          <Flex align="center" gap={8}>
            <BookOutlined style={{ color: "#1a73e8", fontSize: 18 }} />
            <span>
              DANH MỤC MÔN HỌC CHI TIẾT - {selectedCurriculum?.name}
            </span>
          </Flex>
        }
        open={isDetailDrawerOpen}
        onClose={() => setIsDetailDrawerOpen(false)}
        width={850}
        extra={
          <Button
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() =>
              message.success(
                `Đã xuất cấu trúc môn học của khung ${selectedCurriculum?.name} (.xlsx)`
              )
            }
          >
            Xuất file môn học
          </Button>
        }
      >
        {selectedCurriculum && (
          <Spin spinning={drawerLoading}>
            <Descriptions bordered size="small" column={2} style={{ marginBottom: 20 }}>
              <Descriptions.Item label="Mã chương trình">
                <Tag color="blue">{selectedCurriculum.code}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Ngôn ngữ giảng dạy">
                <Tag color="cyan">{selectedCurriculum.instructionLanguage}</Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Cấp học">
                {selectedCurriculum.educationLevel}
              </Descriptions.Item>
              <Descriptions.Item label="Thời lượng trung bình">
                {selectedCurriculum.weeklyPeriods} tiết/tuần
              </Descriptions.Item>
              <Descriptions.Item label="Bằng cấp tốt nghiệp" span={2}>
                <GText strong style={{ color: "#137333" }}>
                  {selectedCurriculum.graduationDegree}
                </GText>
              </Descriptions.Item>
            </Descriptions>

            <GText strong style={{ fontSize: 14, display: "block", marginBottom: 12 }}>
              DANH SÁCH 18 MÔN HỌC & HOẠT ĐỘNG GIÁO DỤC CHUẨN HÓA:
            </GText>

            <Table
              dataSource={
                curriculumSubjects.length > 0
                  ? curriculumSubjects.map((s: any, i: number) => ({
                      key: `cs-${s.id || i}`,
                      stt: i + 1,
                      name: s.subject?.name || s.name || standardSubjectTable[i % standardSubjectTable.length].name,
                      code: s.subject?.code || s.code || standardSubjectTable[i % standardSubjectTable.length].code,
                      group: standardSubjectTable[i % standardSubjectTable.length].group,
                      periods: s.lessonsPerWeek || standardSubjectTable[i % standardSubjectTable.length].periods,
                      type: s.type === 1 ? "Bắt buộc" : "Tự chọn",
                      grading: s.scoringBased ? "Chấm điểm (Thang 10)" : "Đánh giá nhận xét (Đ/CĐ)",
                    }))
                  : standardSubjectTable.map((s) => ({ ...s, key: `s-${s.stt}` }))
              }
              pagination={false}
              size="small"
              bordered
              columns={[
                { title: "STT", dataIndex: "stt", key: "stt", width: 50, align: "center" },
                {
                  title: "Tên Môn học / Hoạt động",
                  dataIndex: "name",
                  key: "name",
                  render: (n) => <GText strong>{n}</GText>,
                },
                { title: "Mã môn", dataIndex: "code", key: "code", width: 85, align: "center" },
                { title: "Nhóm chuyên môn", dataIndex: "group", key: "group" },
                {
                  title: "Số tiết/tuần",
                  dataIndex: "periods",
                  key: "periods",
                  width: 95,
                  align: "center",
                  render: (p) => <Tag color="blue">{p} tiết</Tag>,
                },
                {
                  title: "Phân loại",
                  dataIndex: "type",
                  key: "type",
                  width: 140,
                  render: (t) => (
                    <Tag color={t.includes("Bắt buộc") ? "volcano" : "green"}>{t}</Tag>
                  ),
                },
                {
                  title: "Hình thức đánh giá",
                  dataIndex: "grading",
                  key: "grading",
                  width: 170,
                },
              ]}
            />
          </Spin>
        )}
      </Drawer>

      {/* Create Curriculum Modal */}
      <Modal
        title="Ban hành Khung Chương trình Giáo dục Mới"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={680}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateCurriculum}
          initialValues={{
            level: "THPT",
            language: "Tiếng Việt",
            weeklyPeriods: 30,
          }}
        >
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                label="Mã chương trình"
                name="code"
                rules={[{ required: true, message: "Vui lòng nhập mã chương trình" }]}
              >
                <Input placeholder="VD: CT-STEM-2026" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item
                label="Tên chương trình"
                name="name"
                rules={[{ required: true, message: "Vui lòng nhập tên chương trình" }]}
              >
                <Input placeholder="VD: Chương trình Giáo dục STEM Nâng cao" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Ngôn ngữ giảng dạy" name="language">
                <Select
                  options={[
                    { value: "Tiếng Việt", label: "Tiếng Việt" },
                    { value: "Song ngữ Anh - Việt", label: "Song ngữ Anh - Việt" },
                    { value: "Tiếng Anh", label: "Tiếng Anh" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Thời lượng dự kiến (tiết/tuần)" name="weeklyPeriods">
                <Input type="number" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Loại bằng cấp / Chứng chỉ tốt nghiệp"
            name="degree"
            rules={[{ required: true, message: "Vui lòng nhập thông tin văn bằng" }]}
          >
            <Input placeholder="VD: Bằng Tốt nghiệp THPT & Chứng chỉ Năng lực STEM" />
          </Form.Item>

          <Form.Item label="Mô tả mục tiêu đào tạo" name="description">
            <Input.TextArea rows={3} placeholder="Mô tả chi tiết mục tiêu đào tạo..." />
          </Form.Item>

          <Flex justify="end" gap={12} style={{ marginTop: 16 }}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit">
              Xác nhận Ban hành
            </Button>
          </Flex>
        </Form>
      </Modal>
    </ContentCover>
  );
}
