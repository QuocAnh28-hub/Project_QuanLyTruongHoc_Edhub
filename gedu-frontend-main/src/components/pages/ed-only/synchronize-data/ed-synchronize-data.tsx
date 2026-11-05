import {
  Alert,
  Badge,
  Button,
  Card,
  Col,
  Descriptions,
  Divider,
  Flex,
  Form,
  Modal,
  Pagination,
  Progress,
  Row,
  Select,
  Space,
  Statistic,
  Switch,
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
  ApiOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloudSyncOutlined,
  DatabaseOutlined,
  DesktopOutlined,
  DownloadOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
  SettingOutlined,
  SyncOutlined,
} from "@ant-design/icons";

interface SyncLogItem {
  id: string;
  targetSystem: string;
  dataType: string;
  recordsCount: number;
  triggerType: "SCHEDULED" | "MANUAL";
  triggeredBy: string;
  startedAt: string;
  duration: string;
  status: "SUCCESS" | "WARNING" | "FAILED";
  details: string;
}

export default function EdSynchronizeData() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_synchronize_data.title },
      ],
      nav_links.ed_synchronize_data.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <Content />;
}

function Content() {
  const [isManualSyncModalOpen, setIsManualSyncModalOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncProgress, setSyncProgress] = useState(0);
  const [syncStepText, setSyncStepText] = useState("");
  const [autoSyncEnabled, setAutoSyncEnabled] = useState(true);
  const [syncInterval, setSyncInterval] = useState("30");

  // Sync logs data
  const logsList: SyncLogItem[] = useMemo(() => {
    return [
      {
        id: "SYNC-20261104-1530",
        targetSystem: "Bộ GD&ĐT (csdl.moet.gov.vn)",
        dataType: "Điểm số & Học bạ điện tử",
        recordsCount: 55420,
        triggerType: "SCHEDULED",
        triggeredBy: "Cron Scheduler",
        startedAt: "04/11/2026 15:30:00",
        duration: "4.2s",
        status: "SUCCESS",
        details: "Đồng bộ thành công 55,420 bản ghi điểm học kỳ 1 & 2 lên CSDL Bộ GD&ĐT",
      },
      {
        id: "SYNC-20261104-1400",
        targetSystem: "Bộ GD&ĐT (csdl.moet.gov.vn)",
        dataType: "Chuyên cần & Điểm danh ngày",
        recordsCount: 1356,
        triggerType: "SCHEDULED",
        triggeredBy: "Cron Scheduler",
        startedAt: "04/11/2026 14:00:00",
        duration: "1.1s",
        status: "SUCCESS",
        details: "Ghi nhận 1,356 lượt điểm danh ca sáng & ca chiều ngày 04/11/2026",
      },
      {
        id: "SYNC-20261104-1130",
        targetSystem: "VNeID / Đề án 06 (Bộ Công an)",
        dataType: "Xác thực định danh CCCD học sinh",
        recordsCount: 678,
        triggerType: "MANUAL",
        triggeredBy: "admin.sogd@local.test",
        startedAt: "04/11/2026 11:30:15",
        duration: "2.8s",
        status: "SUCCESS",
        details: "100% hồ sơ học sinh khớp đúng số định danh cá nhân trên CSDL Dân cư",
      },
      {
        id: "SYNC-20261104-0900",
        targetSystem: "Cổng Dịch vụ công Quốc gia",
        dataType: "Tuyển sinh đầu cấp & Xác nhận nhập học",
        recordsCount: 1250,
        triggerType: "SCHEDULED",
        triggeredBy: "Cron Scheduler",
        startedAt: "04/11/2026 09:00:00",
        duration: "3.5s",
        status: "SUCCESS",
        details: "Đồng bộ danh sách trúng tuyển lớp 10 năm học 2026 - 2027",
      },
      {
        id: "SYNC-20261104-0600",
        targetSystem: "EduHub School Sync Agent (24 trường)",
        dataType: "Thời khóa biểu & Phân công giảng dạy",
        recordsCount: 1840,
        triggerType: "SCHEDULED",
        triggeredBy: "Cron Scheduler",
        startedAt: "04/11/2026 06:00:00",
        duration: "1.9s",
        status: "SUCCESS",
        details: "Cập nhật lịch báo giảng tuần 10 cho 24 trường THPT trực thuộc",
      },
      {
        id: "SYNC-20261103-2300",
        targetSystem: "Bộ GD&ĐT (csdl.moet.gov.vn)",
        dataType: "Biên chế & Trình độ Cán bộ Giáo viên",
        recordsCount: 120,
        triggerType: "SCHEDULED",
        triggeredBy: "Cron Scheduler",
        startedAt: "03/11/2026 23:00:00",
        duration: "0.8s",
        status: "SUCCESS",
        details: "Cập nhật chuẩn chức danh nghề nghiệp giáo viên toàn ngành",
      },
    ];
  }, []);

  const handleStartManualSync = () => {
    setIsSyncing(true);
    setSyncProgress(10);
    setSyncStepText("Đang kết nối cổng an toàn TSLCD Bộ GD&ĐT (csdl.moet.gov.vn)...");

    setTimeout(() => {
      setSyncProgress(35);
      setSyncStepText("Đang xác thực chữ ký số chứng thư CA Sở GD&ĐT Hà Nội...");
    }, 800);

    setTimeout(() => {
      setSyncProgress(65);
      setSyncStepText("Đang mã hóa và đẩy 55,420 bản ghi điểm & 1,356 lượt chuyên cần...");
    }, 1800);

    setTimeout(() => {
      setSyncProgress(90);
      setSyncStepText("Đang đối soát mã checksum và nhận mã biên nhận từ Bộ GD&ĐT...");
    }, 2800);

    setTimeout(() => {
      setSyncProgress(100);
      setSyncStepText("Hoàn tất! Dữ liệu đã đồng bộ 100% thành công.");
      setIsSyncing(false);
      message.success("Đồng bộ dữ liệu ngành lên Cổng CSDL Quốc gia thành công!");
    }, 3600);
  };

  const columns: ColumnsType<SyncLogItem> = [
    {
      title: "Mã phiên Sync",
      dataIndex: "id",
      key: "id",
      width: 200,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (id) => (
        <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {id}
        </Tag>
      ),
    },
    {
      title: "Hệ thống đích / Cổng kết nối",
      dataIndex: "targetSystem",
      key: "targetSystem",
      width: 280,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (sys) => (
        <Flex align="center" gap={6} style={{ whiteSpace: "nowrap" }}>
          <DatabaseOutlined style={{ color: "#1a73e8" }} />
          <GText strong>{sys}</GText>
        </Flex>
      ),
    },
    {
      title: "Loại dữ liệu",
      dataIndex: "dataType",
      key: "dataType",
      width: 260,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (type) => <Tag color="blue" style={{ whiteSpace: "nowrap" }}>{type}</Tag>,
    },
    {
      title: "Số bản ghi",
      dataIndex: "recordsCount",
      key: "recordsCount",
      width: 130,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (c) => <GText strong>{c.toLocaleString()}</GText>,
    },
    {
      title: "Thời gian bắt đầu",
      dataIndex: "startedAt",
      key: "startedAt",
      width: 180,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
    },
    {
      title: "Thời lượng",
      dataIndex: "duration",
      key: "duration",
      width: 120,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (d) => <Tag color="purple">{d}</Tag>,
    },
    {
      title: "Hình thức",
      dataIndex: "triggerType",
      key: "triggerType",
      width: 130,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (t) => (
        <Tag color={t === "SCHEDULED" ? "cyan" : "gold"}>
          {t === "SCHEDULED" ? "Tự động" : "Thủ công"}
        </Tag>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      width: 140,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: () => (
        <Tag color="success" icon={<CheckCircleOutlined />}>
          Thành công
        </Tag>
      ),
    },
    {
      title: "Nội dung phản hồi",
      dataIndex: "details",
      key: "details",
      width: 380,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (d) => <span style={{ color: "#555" }}>{d}</span>,
    },
  ];

  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Flex vertical gap={4}>
            <GTitle level={3} style={{ margin: 0 }}>
              Cài đặt & Giám sát Đồng bộ Dữ liệu Ngành GD&ĐT
            </GTitle>
            <GText type="secondary">
              Kết nối liên thông hai chiều thời gian thực giữa EduHub với CSDL Quốc gia Bộ GD&ĐT, VNeID Đề án 06 và Cổng Dịch vụ công
            </GText>
          </Flex>
        </Col>
        <Col>
          <Flex gap={12} wrap>
            <Button
              icon={<SettingOutlined />}
              onClick={() =>
                message.info("Mở module Cấu hình nâng cao API Gateway & Chứng thư số.")
              }
            >
              Cấu hình Cổng API
            </Button>
            <Button
              type="primary"
              icon={<CloudSyncOutlined />}
              onClick={() => {
                setSyncProgress(0);
                setSyncStepText("");
                setIsManualSyncModalOpen(true);
              }}
            >
              Đồng bộ Toàn ngành Ngay
            </Button>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* Integration Nodes Status Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <GlobalOutlined style={{ color: "#1a73e8" }} />
                <span>CSDL Bộ GD&ĐT (EMIS)</span>
              </Flex>
            }
            size="small"
            style={{ borderTop: "4px solid #1a73e8" }}
          >
            <Flex vertical gap={6}>
              <Flex justify="space-between" align="center">
                <GText type="secondary">Trạng thái cổng:</GText>
                <Tag color="success">Đang trực tuyến (Active)</Tag>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Endpoint:</GText>
                <GText style={{ fontSize: 12, fontFamily: "monospace" }}>
                  api.csdl.moet.gov.vn
                </GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Đồng bộ gần nhất:</GText>
                <GText strong style={{ fontSize: 12 }}>15 phút trước</GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Bản ghi hợp lệ:</GText>
                <GText strong style={{ color: "#137333" }}>100% (55,420/55,420)</GText>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <SafetyCertificateOutlined style={{ color: "#52c41a" }} />
                <span>VNeID / Đề án 06 (BCA)</span>
              </Flex>
            }
            size="small"
            style={{ borderTop: "4px solid #52c41a" }}
          >
            <Flex vertical gap={6}>
              <Flex justify="space-between" align="center">
                <GText type="secondary">Trạng thái kết nối:</GText>
                <Tag color="success">TSLCD An toàn</Tag>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Kênh truyền:</GText>
                <GText style={{ fontSize: 12, fontFamily: "monospace" }}>
                  TSLCD Cấp 3 (Mật)
                </GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Độ trễ trung bình:</GText>
                <GText strong style={{ fontSize: 12 }}>85 ms</GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Định danh CCCD:</GText>
                <GText strong style={{ color: "#137333" }}>100% Khớp đúng</GText>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <ApiOutlined style={{ color: "#f2994a" }} />
                <span>Cổng Dịch vụ công Quốc gia</span>
              </Flex>
            }
            size="small"
            style={{ borderTop: "4px solid #f2994a" }}
          >
            <Flex vertical gap={6}>
              <Flex justify="space-between" align="center">
                <GText type="secondary">Uptime hệ thống:</GText>
                <Tag color="success">99.98% Trực tuyến</Tag>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Giao thức:</GText>
                <GText style={{ fontSize: 12, fontFamily: "monospace" }}>
                  HTTPS / OAuth2 / CA
                </GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Hồ sơ tiếp nhận:</GText>
                <GText strong style={{ fontSize: 12 }}>1,250 hồ sơ</GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Xác thực CA:</GText>
                <GText strong style={{ color: "#137333" }}>Hợp lệ 100%</GText>
              </Flex>
            </Flex>
          </Card>
        </Col>

        <Col xs={24} md={12} lg={6}>
          <Card
            title={
              <Flex align="center" gap={8}>
                <DesktopOutlined style={{ color: "#9c27b0" }} />
                <span>EduHub Sync Agent (24 trường)</span>
              </Flex>
            }
            size="small"
            style={{ borderTop: "4px solid #9c27b0" }}
          >
            <Flex vertical gap={6}>
              <Flex justify="space-between" align="center">
                <GText type="secondary">Trực tuyến:</GText>
                <Tag color="success">24 / 24 trường</Tag>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Gói tin hôm nay:</GText>
                <GText style={{ fontSize: 12, fontFamily: "monospace" }}>
                  45,820 events
                </GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Đồng bộ tức thời:</GText>
                <GText strong style={{ fontSize: 12 }}>Realtime &lt; 150ms</GText>
              </Flex>
              <Flex justify="space-between">
                <GText type="secondary">Xung đột dữ liệu:</GText>
                <GText strong style={{ color: "#137333" }}>0 lỗi (Clean)</GText>
              </Flex>
            </Flex>
          </Card>
        </Col>
      </Row>

      {/* Auto-sync configuration Card */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Flex justify="space-between" align="center" wrap gap={16}>
          <Flex align="center" gap={12}>
            <ClockCircleOutlined style={{ fontSize: 24, color: "#1a73e8" }} />
            <div>
              <GText strong style={{ fontSize: 14 }}>
                Lập lịch Đồng bộ Tự động (Cron Scheduler)
              </GText>
              <GText type="secondary" style={{ display: "block", fontSize: 12 }}>
                Tự động kiểm tra thay đổi và đồng bộ dữ liệu điểm số, chuyên cần và học bạ điện tử
              </GText>
            </div>
          </Flex>

          <Flex align="center" gap={16}>
            <Flex align="center" gap={8}>
              <GText>Tần suất đồng bộ:</GText>
              <Select
                value={syncInterval}
                onChange={(val) => {
                  setSyncInterval(val);
                  message.success(`Đã cập nhật chu kỳ đồng bộ tự động thành ${val} phút/lần!`);
                }}
                style={{ width: 140 }}
                options={[
                  { value: "15", label: "Mỗi 15 phút" },
                  { value: "30", label: "Mỗi 30 phút" },
                  { value: "60", label: "Mỗi 1 giờ" },
                  { value: "360", label: "Mỗi 6 giờ" },
                  { value: "1440", label: "Hàng ngày (00:00)" },
                ]}
              />
            </Flex>

            <Flex align="center" gap={8}>
              <GText>Kích hoạt tự động:</GText>
              <Switch
                checked={autoSyncEnabled}
                onChange={(chk) => {
                  setAutoSyncEnabled(chk);
                  message.info(
                    chk
                      ? "Đã kích hoạt tiến trình đồng bộ tự động theo lịch!"
                      : "Đã tạm dừng tiến trình đồng bộ tự động."
                  );
                }}
              />
            </Flex>
          </Flex>
        </Flex>
      </Card>

      {/* Sync History Table */}
      <Card
        title={
          <GText strong style={{ fontSize: 16 }}>
            Nhật ký Lịch sử Đồng bộ Dữ liệu Toàn ngành ({logsList.length} phiên)
          </GText>
        }
        extra={
          <GText italic type="secondary">
            Cập nhật lần cuối: {dayjs().format("DD/MM/YYYY HH:mm:ss")}
          </GText>
        }
        style={{ width: "100%", borderRadius: 8 }}
      >
        <Table
          columns={columns}
          dataSource={logsList}
          pagination={false}
          size="middle"
          scroll={{ x: 1600 }}
          bordered
          rowKey="id"
        />
      </Card>

      {/* Manual Sync Modal */}
      <Modal
        title={
          <Flex align="center" gap={8}>
            <SyncOutlined spin={isSyncing} style={{ color: "#1a73e8" }} />
            <span>KÍCH HOẠT TIẾN TRÌNH ĐỒNG BỘ TOÀN NGÀNH</span>
          </Flex>
        }
        open={isManualSyncModalOpen}
        onCancel={() => !isSyncing && setIsManualSyncModalOpen(false)}
        footer={[
          <Button
            key="cancel"
            disabled={isSyncing}
            onClick={() => setIsManualSyncModalOpen(false)}
          >
            Đóng
          </Button>,
          <Button
            key="start"
            type="primary"
            disabled={isSyncing || syncProgress === 100}
            loading={isSyncing}
            icon={<CloudSyncOutlined />}
            onClick={handleStartManualSync}
          >
            {syncProgress === 100 ? "Đã đồng bộ xong" : "Bắt đầu Đồng bộ"}
          </Button>,
        ]}
        width={650}
      >
        <Flex vertical gap={16} style={{ padding: "12px 0" }}>
          <Alert
            type="info"
            showIcon
            message="Xác nhận dữ liệu đồng bộ"
            description="Tiến trình này sẽ kiểm tra toàn bộ 678 hồ sơ học sinh, 120 giáo viên, 55,420 bản ghi điểm số và 1,356 lượt chuyên cần để đẩy lên Cổng CSDL Quốc gia Bộ GD&ĐT."
          />

          <Descriptions bordered size="small" column={1}>
            <Descriptions.Item label="Đơn vị gửi">
              Sở Giáo dục & Đào tạo Hà Nội (Org ID: 1)
            </Descriptions.Item>
            <Descriptions.Item label="Hệ thống nhận">
              Cổng CSDL Quốc gia Ngành Giáo dục (Bộ GD&ĐT) & VNeID
            </Descriptions.Item>
            <Descriptions.Item label="Chứng thư số CA">
              VNPT-CA / Chữ ký số điện tử công vụ Sở GD&ĐT
            </Descriptions.Item>
          </Descriptions>

          {syncProgress > 0 && (
            <div style={{ marginTop: 8 }}>
              <Flex justify="space-between" style={{ marginBottom: 4 }}>
                <GText strong>{syncStepText}</GText>
                <GText strong style={{ color: "#1a73e8" }}>
                  {syncProgress}%
                </GText>
              </Flex>
              <Progress
                percent={syncProgress}
                status={syncProgress === 100 ? "success" : "active"}
                strokeColor={syncProgress === 100 ? "#52c41a" : "#1a73e8"}
              />
            </div>
          )}
        </Flex>
      </Modal>
    </ContentCover>
  );
}
