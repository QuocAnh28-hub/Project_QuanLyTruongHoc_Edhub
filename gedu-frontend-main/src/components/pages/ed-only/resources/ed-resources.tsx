import {
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Pagination,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Table,
  Tag,
  Tooltip,
  Upload,
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
  AlertOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  DownloadOutlined,
  EyeOutlined,
  FileDoneOutlined,
  FilePdfOutlined,
  FileTextOutlined,
  InboxOutlined,
  PlusOutlined,
  SearchOutlined,
  SendOutlined,
  WarningOutlined,
} from "@ant-design/icons";

interface OfficialDocument {
  id: number;
  docNumber: string;
  title: string;
  docType: "QUYET_DINH" | "CONG_VAN" | "KE_HOACH" | "CHI_THI" | "THONG_TU";
  docTypeLabel: string;
  issuingDept: string;
  signDate: string;
  effectiveDate: string;
  deadlineDate?: string;
  urgency: "NORMAL" | "URGENT" | "EXPRESS";
  status: "ACTIVE" | "COMPLETED" | "PENDING_REPORT";
  recipientsCount: number;
  confirmedCount: number;
  fileName: string;
  fileSize: string;
  signerName: string;
}

export default function EdResources() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_resources.title },
      ],
      nav_links.ed_resources.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Content />;
}

function Content() {
  const [selectedType, setSelectedType] = useState<string | "ALL">("ALL");
  const [selectedDept, setSelectedDept] = useState<string | "ALL">("ALL");
  const [selectedUrgency, setSelectedUrgency] = useState<string | "ALL">("ALL");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Modals state
  const [selectedDoc, setSelectedDoc] = useState<OfficialDocument | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [createForm] = Form.useForm();

  // Mock list of realistic directives from Sở GD&ĐT
  const documentsList: OfficialDocument[] = useMemo(() => {
    return [
      {
        id: 1,
        docNumber: "1425/SGDĐT-GDTrH",
        title: "Hướng dẫn thực hiện nhiệm vụ Giáo dục Trung học năm học 2026 - 2027 đối với các trường THPT",
        docType: "CONG_VAN",
        docTypeLabel: "Công văn Hướng dẫn",
        issuingDept: "Phòng Giáo dục Trung học",
        signDate: "28/08/2026",
        effectiveDate: "01/09/2026",
        deadlineDate: "31/05/2027",
        urgency: "NORMAL",
        status: "ACTIVE",
        recipientsCount: 24,
        confirmedCount: 24,
        fileName: "1425_SGDDT_HD_NV_GDTrH_2026_2027.pdf",
        fileSize: "2.4 MB",
        signerName: "Giám đốc Sở GD&ĐT Trần Thế Cương",
      },
      {
        id: 2,
        docNumber: "289/QĐ-SGDĐT",
        title: "Quyết định phê duyệt Kế hoạch Khảo sát chất lượng học sinh lớp 12 THPT toàn thành phố",
        docType: "QUYET_DINH",
        docTypeLabel: "Quyết định",
        issuingDept: "Phòng Khảo thí & KĐCLGD",
        signDate: "15/09/2026",
        effectiveDate: "15/09/2026",
        deadlineDate: "15/11/2026",
        urgency: "URGENT",
        status: "ACTIVE",
        recipientsCount: 24,
        confirmedCount: 24,
        fileName: "QD_289_KhaoSatChatLuong_Lop12.pdf",
        fileSize: "1.8 MB",
        signerName: "Phó Giám đốc Sở GD&ĐT",
      },
      {
        id: 3,
        docNumber: "105/CT-UBND",
        title: "Chỉ thị Hỏa tốc về việc chủ động phòng chống thiên tai bão lũ và đảm bảo an toàn tuyệt đối cho học sinh",
        docType: "CHI_THI",
        docTypeLabel: "Chỉ thị Hỏa tốc",
        issuingDept: "Văn phòng Sở GD&ĐT",
        signDate: "06/09/2026",
        effectiveDate: "06/09/2026",
        deadlineDate: "10/09/2026",
        urgency: "EXPRESS",
        status: "COMPLETED",
        recipientsCount: 24,
        confirmedCount: 24,
        fileName: "ChiThi_105_HoaToc_PhongChongBaoLu.pdf",
        fileSize: "950 KB",
        signerName: "Giám đốc Sở GD&ĐT",
      },
      {
        id: 4,
        docNumber: "2156/SGDĐT-CNTT",
        title: "Triển khai thí điểm Học bạ số và đồng bộ dữ liệu kết quả học tập kỳ 1 lên CSDL Quốc gia",
        docType: "CONG_VAN",
        docTypeLabel: "Công văn Triển khai",
        issuingDept: "Phòng Kế hoạch - Tài chính & CNTT",
        signDate: "10/10/2026",
        effectiveDate: "15/10/2026",
        deadlineDate: "30/11/2026",
        urgency: "NORMAL",
        status: "ACTIVE",
        recipientsCount: 24,
        confirmedCount: 24,
        fileName: "2156_TrienKhai_HocBaSo_CSDL.pdf",
        fileSize: "3.2 MB",
        signerName: "Phó Giám đốc Sở GD&ĐT",
      },
      {
        id: 5,
        docNumber: "88/KH-SGDĐT",
        title: "Kế hoạch tổ chức Hội thi Giáo viên dạy giỏi Cấp Thành phố năm học 2026 - 2027",
        docType: "KE_HOACH",
        docTypeLabel: "Kế hoạch",
        issuingDept: "Phòng Giáo dục Trung học",
        signDate: "20/09/2026",
        effectiveDate: "01/10/2026",
        deadlineDate: "25/12/2026",
        urgency: "NORMAL",
        status: "ACTIVE",
        recipientsCount: 24,
        confirmedCount: 24,
        fileName: "KeHoach_88_HoiThiGVDG_2026.pdf",
        fileSize: "4.1 MB",
        signerName: "Phó Giám đốc Sở GD&ĐT",
      },
      {
        id: 6,
        docNumber: "32/2020/TT-BGDĐT",
        title: "Thông tư ban hành Điều lệ trường trung học cơ sở, trường trung học phổ thông và trường phổ thông có nhiều cấp học",
        docType: "THONG_TU",
        docTypeLabel: "Thông tư Bộ GD&ĐT",
        issuingDept: "Bộ Giáo dục & Đào tạo",
        signDate: "15/09/2020",
        effectiveDate: "01/11/2020",
        urgency: "NORMAL",
        status: "ACTIVE",
        recipientsCount: 24,
        confirmedCount: 24,
        fileName: "ThongTu_32_DieuLeTruongTHPT.pdf",
        fileSize: "5.6 MB",
        signerName: "Bộ trưởng Bộ GD&ĐT",
      },
      {
        id: 7,
        docNumber: "5512/BGDĐT-GDTrH",
        title: "Công văn hướng dẫn xây dựng và tổ chức thực hiện kế hoạch giáo dục của nhà trường",
        docType: "CONG_VAN",
        docTypeLabel: "Công văn Bộ GD&ĐT",
        issuingDept: "Bộ Giáo dục & Đào tạo",
        signDate: "18/12/2020",
        effectiveDate: "18/12/2020",
        urgency: "NORMAL",
        status: "ACTIVE",
        recipientsCount: 24,
        confirmedCount: 24,
        fileName: "CV_5512_KeHoachBaiDay_KHBD.pdf",
        fileSize: "4.8 MB",
        signerName: "Thứ trưởng Bộ GD&ĐT",
      },
      {
        id: 8,
        docNumber: "348/SGDĐT-TCCB",
        title: "Rà soát quy hoạch, đào tạo bồi dưỡng nâng chuẩn trình độ cán bộ quản lý và giáo viên năm 2026",
        docType: "CONG_VAN",
        docTypeLabel: "Công văn Tổ chức",
        issuingDept: "Phòng Tổ chức Cán bộ",
        signDate: "12/09/2026",
        effectiveDate: "15/09/2026",
        deadlineDate: "30/10/2026",
        urgency: "URGENT",
        status: "PENDING_REPORT",
        recipientsCount: 24,
        confirmedCount: 22,
        fileName: "CV_348_TCCB_RaSoatQuyHoach.pdf",
        fileSize: "2.1 MB",
        signerName: "Trưởng phòng TCCB",
      },
    ];
  }, []);

  // Filter documents
  const filteredDocs = useMemo(() => {
    return documentsList.filter((doc) => {
      if (selectedType !== "ALL" && doc.docType !== selectedType) return false;
      if (selectedDept !== "ALL" && !doc.issuingDept.includes(selectedDept))
        return false;
      if (selectedUrgency !== "ALL" && doc.urgency !== selectedUrgency)
        return false;
      if (searchText.trim()) {
        const q = searchText.toLowerCase().trim();
        const matchNumber = doc.docNumber.toLowerCase().includes(q);
        const matchTitle = doc.title.toLowerCase().includes(q);
        const matchDept = doc.issuingDept.toLowerCase().includes(q);
        if (!matchNumber && !matchTitle && !matchDept) return false;
      }
      return true;
    });
  }, [documentsList, selectedType, selectedDept, selectedUrgency, searchText]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredDocs.slice(start, start + pageSize);
  }, [filteredDocs, currentPage]);

  const handleCreateSubmit = (values: any) => {
    message.success(
      `Đã phát hành văn bản "${values.docNumber} - ${values.title}" thành công tới toàn bộ các trường trực thuộc!`
    );
    setIsCreateModalOpen(false);
    createForm.resetFields();
  };

  const getUrgencyTag = (urgency: string) => {
    switch (urgency) {
      case "EXPRESS":
        return <Tag color="error" icon={<WarningOutlined />}>HỎA TỐC</Tag>;
      case "URGENT":
        return <Tag color="warning" icon={<AlertOutlined />}>KHẨN</Tag>;
      default:
        return <Tag color="default">Bình thường</Tag>;
    }
  };

  const columns: ColumnsType<OfficialDocument> = [
    {
      title: "Số / Ký hiệu",
      dataIndex: "docNumber",
      key: "docNumber",
      width: 155,
      render: (num) => (
        <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {num}
        </Tag>
      ),
    },
    {
      title: "Trích yếu Văn bản Chỉ đạo",
      key: "title",
      width: 320,
      render: (_, r) => (
        <div>
          <GText strong style={{ fontSize: 14 }}>
            {r.title}
          </GText>
          <Flex gap={8} align="center" style={{ marginTop: 4 }}>
            <Tag color="cyan">{r.docTypeLabel}</Tag>
            <GText type="secondary" style={{ fontSize: 12 }}>
              Người ký: {r.signerName}
            </GText>
          </Flex>
        </div>
      ),
    },
    {
      title: "Cơ quan ban hành",
      dataIndex: "issuingDept",
      key: "issuingDept",
      width: 190,
    },
    {
      title: "Thời gian",
      key: "dates",
      width: 140,
      render: (_, r) => (
        <div>
          <GText style={{ fontSize: 12, display: "block" }}>
            Ban hành: {r.signDate}
          </GText>
          {r.deadlineDate && (
            <GText type="secondary" style={{ fontSize: 12 }}>
              Hạn: {r.deadlineDate}
            </GText>
          )}
        </div>
      ),
    },
    {
      title: "Mức độ khẩn",
      dataIndex: "urgency",
      key: "urgency",
      width: 125,
      align: "center",
      render: (u) => getUrgencyTag(u),
    },
    {
      title: "Tiếp nhận",
      key: "recipients",
      width: 140,
      render: (_, r) => (
        <div>
          <Flex justify="space-between" style={{ fontSize: 12, marginBottom: 2 }}>
            <span>{r.confirmedCount}/{r.recipientsCount} trường</span>
            <span style={{ fontWeight: 600, color: "#137333" }}>
              {Math.round((r.confirmedCount / r.recipientsCount) * 100)}%
            </span>
          </Flex>
          <Progress
            percent={Math.round((r.confirmedCount / r.recipientsCount) * 100)}
            size="small"
            showInfo={false}
            strokeColor="#137333"
          />
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 110,
      align: "center",
      render: (_, r) => (
        <Space size={6}>
          <Tooltip title="Xem toàn văn văn bản">
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => {
                setSelectedDoc(r);
                setIsDetailModalOpen(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Tải tệp văn bản có chữ ký số (.pdf)">
            <Button
              size="small"
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success(`Đang tải văn bản ${r.docNumber} (${r.fileSize})...`)
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Flex vertical gap={4}>
            <GTitle level={3} style={{ margin: 0 }}>
              Quản lý Văn bản Chỉ đạo & Điều hành Cấp Sở
            </GTitle>
            <GText type="secondary">
              Ban hành, lưu trữ, điều phối và giám sát xác nhận tiếp nhận văn bản chỉ đạo tới 100% các đơn vị trường học
            </GText>
          </Flex>
        </Col>
        <Col>
          <Flex gap={12} wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success("Đang xuất sổ đăng ký văn bản chỉ đạo cấp Sở (.xlsx)...")
              }
            >
              Sổ theo dõi văn bản (.xlsx)
            </Button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsCreateModalOpen(true)}
            >
              Phát hành Văn bản / Chỉ đạo mới
            </Button>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* Stat Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #1a73e8" }}>
            <Statistic
              title="Văn bản Ban hành Năm 2026"
              value={156}
              suffix="văn bản"
              prefix={<FileTextOutlined style={{ color: "#1a73e8" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Chỉ thị, Quyết định, Công văn hướng dẫn
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #d93025" }}>
            <Statistic
              title="Văn bản Hỏa tốc / Khẩn"
              value={8}
              suffix="văn bản"
              valueStyle={{ color: "#d93025" }}
              prefix={<WarningOutlined style={{ color: "#d93025" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Xử lý và phản hồi ngay lập tức
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #137333" }}>
            <Statistic
              title="Tỷ lệ Đơn vị Đã Tiếp nhận"
              value={100}
              suffix="%"
              valueStyle={{ color: "#137333" }}
              prefix={<CheckCircleOutlined style={{ color: "#137333" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              24/24 trường THPT xác nhận tiếp nhận
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #f2994a" }}>
            <Statistic
              title="Nhiệm vụ Trọng tâm Ngành"
              value={12}
              suffix="nhiệm vụ"
              prefix={<FileDoneOutlined style={{ color: "#f2994a" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Đang trong lộ trình triển khai năm học
            </GText>
          </GCard>
        </Col>
      </Row>

      {/* Filter Bar */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Row gutter={[12, 12]} align="middle">
          <Col xs={12} sm={6} md={4}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Loại văn bản
              </GText>
              <Select
                value={selectedType}
                onChange={(val) => {
                  setSelectedType(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả loại VB" },
                  { value: "CONG_VAN", label: "Công văn" },
                  { value: "QUYET_DINH", label: "Quyết định" },
                  { value: "CHI_THI", label: "Chỉ thị" },
                  { value: "KE_HOACH", label: "Kế hoạch" },
                  { value: "THONG_TU", label: "Thông tư" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={5}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Phòng ban ban hành
              </GText>
              <Select
                value={selectedDept}
                onChange={(val) => {
                  setSelectedDept(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả phòng ban" },
                  { value: "Giáo dục Trung học", label: "Phòng GD Trung học" },
                  { value: "Khảo thí", label: "Phòng Khảo thí & KĐCL" },
                  { value: "Tổ chức Cán bộ", label: "Phòng TCCB" },
                  { value: "Văn phòng", label: "Văn phòng Sở" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={12} sm={6} md={3}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Mức độ khẩn
              </GText>
              <Select
                value={selectedUrgency}
                onChange={(val) => {
                  setSelectedUrgency(val);
                  setCurrentPage(1);
                }}
                style={{ width: "100%" }}
                options={[
                  { value: "ALL", label: "Tất cả mức độ" },
                  { value: "NORMAL", label: "Bình thường" },
                  { value: "URGENT", label: "Khẩn" },
                  { value: "EXPRESS", label: "Hỏa tốc" },
                ]}
              />
            </Flex>
          </Col>

          <Col xs={24} sm={12} md={12}>
            <Flex vertical gap={4}>
              <GText strong style={{ fontSize: 13 }}>
                Tìm kiếm văn bản
              </GText>
              <Input
                placeholder="Nhập số/ký hiệu văn bản, trích yếu, phòng ban..."
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
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
          <GText strong style={{ fontSize: 16 }}>
            Danh sách Văn bản Chỉ đạo & Điều hành ({filteredDocs.length} kết quả)
          </GText>
        </Flex>

        <Table
          columns={columns}
          dataSource={paginatedData}
          pagination={false}
          size="middle"
          scroll={{ x: 1400 }}
          bordered
          rowKey="id"
        />

        <Flex justify="end" style={{ marginTop: 16 }}>
          <Pagination
            current={currentPage}
            total={filteredDocs.length}
            pageSize={pageSize}
            onChange={(p) => setCurrentPage(p)}
            showSizeChanger={false}
            showTotal={(total, range) =>
              `${range[0]}-${range[1]} của ${total} văn bản`
            }
          />
        </Flex>
      </Card>

      {/* View Detail Modal */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <FilePdfOutlined style={{ color: "#d93025", fontSize: 18 }} />
            <span>CHI TIẾT VĂN BẢN CHỈ ĐẠO CẤP SỞ</span>
          </Flex>
        }
        open={isDetailModalOpen}
        onCancel={() => setIsDetailModalOpen(false)}
        width={780}
        footer={[
          <Button
            key="dl"
            type="primary"
            icon={<DownloadOutlined />}
            onClick={() => {
              message.success(
                `Đã tải văn bản ký số "${selectedDoc?.fileName}"!`
              );
              setIsDetailModalOpen(false);
            }}
          >
            Tải văn bản có ký số CA ({selectedDoc?.fileSize})
          </Button>,
          <Button key="close" onClick={() => setIsDetailModalOpen(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedDoc && (
          <Descriptions bordered size="small" column={{ xs: 1, sm: 2 }}>
            <Descriptions.Item label="Số / Ký hiệu">
              <Tag color="geekblue" style={{ fontWeight: 600 }}>
                {selectedDoc.docNumber}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Mức độ khẩn cấp">
              {getUrgencyTag(selectedDoc.urgency)}
            </Descriptions.Item>
            <Descriptions.Item label="Trích yếu văn bản" span={2}>
              <GText strong style={{ fontSize: 14 }}>
                {selectedDoc.title}
              </GText>
            </Descriptions.Item>
            <Descriptions.Item label="Cơ quan / Phòng ban ban hành">
              {selectedDoc.issuingDept}
            </Descriptions.Item>
            <Descriptions.Item label="Người ký duyệt">
              <GText strong>{selectedDoc.signerName}</GText>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày ký ban hành">
              {selectedDoc.signDate}
            </Descriptions.Item>
            <Descriptions.Item label="Ngày có hiệu lực">
              {selectedDoc.effectiveDate}
            </Descriptions.Item>
            {selectedDoc.deadlineDate && (
              <Descriptions.Item label="Thời hạn hoàn thành / Báo cáo" span={2}>
                <Tag color="volcano">{selectedDoc.deadlineDate}</Tag>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="Đơn vị tiếp nhận" span={2}>
              Đã chuyển tới toàn bộ 24/24 trường THPT toàn tỉnh (100% đã xác nhận tiếp nhận trên hệ thống EduHub)
            </Descriptions.Item>
            <Descriptions.Item label="Chữ ký số cơ quan" span={2}>
              <Tag color="success" icon={<CheckCircleOutlined />}>
                Chữ ký số điện tử CA Sở GD&ĐT Hà Nội hợp lệ
              </Tag>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>

      {/* Dispatch New Document Modal */}
      <Modal
        title="Phát hành Văn bản Chỉ đạo / Điều hành Mới"
        open={isCreateModalOpen}
        onCancel={() => setIsCreateModalOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateSubmit}
          initialValues={{
            docType: "CONG_VAN",
            issuingDept: "Phòng Giáo dục Trung học",
            urgency: "NORMAL",
            recipients: "ALL_SCHOOLS",
          }}
        >
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item
                label="Số / Ký hiệu văn bản"
                name="docNumber"
                rules={[{ required: true, message: "Vui lòng nhập số ký hiệu" }]}
              >
                <Input placeholder="VD: 1560/SGDĐT-GDTrH" />
              </Form.Item>
            </Col>
            <Col span={14}>
              <Form.Item label="Phòng ban tham mưu ban hành" name="issuingDept">
                <Select
                  options={[
                    { value: "Phòng Giáo dục Trung học", label: "Phòng Giáo dục Trung học" },
                    { value: "Phòng Khảo thí & KĐCLGD", label: "Phòng Khảo thí & KĐCLGD" },
                    { value: "Phòng Tổ chức Cán bộ", label: "Phòng Tổ chức Cán bộ" },
                    { value: "Phòng Kế hoạch - Tài chính", label: "Phòng Kế hoạch - Tài chính" },
                    { value: "Văn phòng Sở", label: "Văn phòng Sở" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item
            label="Trích yếu nội dung văn bản"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập trích yếu văn bản" }]}
          >
            <Input.TextArea rows={2} placeholder="Nhập tóm tắt nội dung chỉ đạo, điều hành..." />
          </Form.Item>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Loại văn bản" name="docType">
                <Select
                  options={[
                    { value: "CONG_VAN", label: "Công văn" },
                    { value: "QUYET_DINH", label: "Quyết định" },
                    { value: "CHI_THI", label: "Chỉ thị" },
                    { value: "KE_HOACH", label: "Kế hoạch" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Mức độ khẩn" name="urgency">
                <Select
                  options={[
                    { value: "NORMAL", label: "Bình thường" },
                    { value: "URGENT", label: "Khẩn" },
                    { value: "EXPRESS", label: "Hỏa tốc" },
                  ]}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Đối tượng tiếp nhận" name="recipients">
                <Select
                  options={[
                    { value: "ALL_SCHOOLS", label: "Tất cả 24 trường THPT" },
                    { value: "PUBLIC_ONLY", label: "Chỉ các trường công lập" },
                  ]}
                />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Tệp văn bản toàn văn (.pdf có ký số)">
            <Upload.Dragger multiple={false} beforeUpload={() => false}>
              <p className="ant-upload-drag-icon">
                <InboxOutlined style={{ fontSize: 36, color: "#1a73e8" }} />
              </p>
              <p className="ant-upload-text">
                Kéo thả file PDF văn bản có ký số hoặc bấm để tải lên
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Flex justify="end" gap={12}>
            <Button onClick={() => setIsCreateModalOpen(false)}>Hủy bỏ</Button>
            <Button type="primary" htmlType="submit" icon={<SendOutlined />}>
              Phát hành ngay
            </Button>
          </Flex>
        </Form>
      </Modal>
    </ContentCover>
  );
}
