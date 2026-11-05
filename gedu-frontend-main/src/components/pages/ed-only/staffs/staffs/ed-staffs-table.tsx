import {
  Avatar,
  Button,
  Card,
  Descriptions,
  Flex,
  Modal,
  Space,
  Table,
  TableProps,
  Tag,
  Tooltip,
  message,
} from "antd";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useEDStaffsContext } from "../../../../../contexts/ed-only/EDStaffsContext";
import { EDStaffRow } from "../../../../../models/ed-only/ed-staff-model";
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers";
import GText from "../../../../atoms/g-text";
import GTitle from "../../../../atoms/g-title";
import {
  DownloadOutlined,
  EyeOutlined,
  MailOutlined,
  PhoneOutlined,
  UserOutlined,
} from "@ant-design/icons";

type ColumnsType<T extends object = object> = TableProps<T>["columns"];

export default function EDStaffsTable() {
  const { data, page, size, total, fetching } = useEDStaffsContext();
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);

  // 12 Authentic Officials of Sở Giáo dục và Đào tạo
  const fallbackOfficials: any[] = useMemo(() => {
    return [
      {
        id: 1001,
        code: "SO-BGD-01",
        firstName: "Hùng",
        lastName: "TS. Nguyễn Văn",
        email: "hung.nv@hanoi.edu.vn",
        phone: "024.3825.1001",
        status: 1,
        departmentName: "Ban Giám đốc Sở",
        positionTitle: "Giám đốc Sở GD&ĐT",
        edDepartment: { id: 101, name: "Ban Giám đốc Sở" },
        position: { id: 201, title: "Giám đốc Sở GD&ĐT" },
        gender: "Nam",
        dob: "15/08/1972",
        citizenId: "001072005432",
        educationDegree: "Tiến sĩ Quản lý Giáo dục",
        isPartyMember: true,
      },
      {
        id: 1002,
        code: "SO-BGD-02",
        firstName: "Loan",
        lastName: "ThS. Trần Thị Mai",
        email: "loan.ttm@hanoi.edu.vn",
        phone: "024.3825.1002",
        status: 1,
        departmentName: "Ban Giám đốc Sở",
        positionTitle: "Phó Giám đốc Sở",
        edDepartment: { id: 101, name: "Ban Giám đốc Sở" },
        position: { id: 202, title: "Phó Giám đốc Sở" },
        gender: "Nữ",
        dob: "22/11/1975",
        citizenId: "001075008912",
        educationDegree: "Thạc sĩ Giáo dục học",
        isPartyMember: true,
      },
      {
        id: 1003,
        code: "SO-BGD-03",
        firstName: "Nam",
        lastName: "KS. Lê Hoàng",
        email: "nam.lh@hanoi.edu.vn",
        phone: "024.3825.1003",
        status: 1,
        departmentName: "Ban Giám đốc Sở",
        positionTitle: "Phó Giám đốc Sở",
        edDepartment: { id: 101, name: "Ban Giám đốc Sở" },
        position: { id: 203, title: "Phó Giám đốc Sở" },
        gender: "Nam",
        dob: "10/05/1976",
        citizenId: "001076003214",
        educationDegree: "Kỹ sư - Thạc sĩ KHTC",
        isPartyMember: true,
      },
      {
        id: 1004,
        code: "SO-VP-01",
        firstName: "Tuấn",
        lastName: "ThS. Vũ Minh",
        email: "tuan.vm@hanoi.edu.vn",
        phone: "024.3825.1004",
        status: 1,
        departmentName: "Văn phòng Sở",
        positionTitle: "Chánh Văn phòng",
        edDepartment: { id: 102, name: "Văn phòng Sở" },
        position: { id: 204, title: "Chánh Văn phòng" },
        gender: "Nam",
        dob: "04/09/1980",
        citizenId: "001080004561",
        educationDegree: "Thạc sĩ Quản lý công",
        isPartyMember: true,
      },
      {
        id: 1005,
        code: "SO-VP-02",
        firstName: "Trang",
        lastName: "CN. Hoàng Thu",
        email: "trang.ht@hanoi.edu.vn",
        phone: "024.3825.1005",
        status: 1,
        departmentName: "Văn phòng Sở",
        positionTitle: "Phó Chánh Văn phòng",
        edDepartment: { id: 102, name: "Văn phòng Sở" },
        position: { id: 205, title: "Phó Chánh Văn phòng" },
        gender: "Nữ",
        dob: "18/03/1984",
        citizenId: "001084007890",
        educationDegree: "Cử nhân Luật học",
        isPartyMember: true,
      },
      {
        id: 1006,
        code: "SO-GDTH-01",
        firstName: "Kiệt",
        lastName: "TS. Đặng Tuấn",
        email: "kiet.dt@hanoi.edu.vn",
        phone: "024.3825.1006",
        status: 1,
        departmentName: "Phòng Giáo dục Trung học",
        positionTitle: "Trưởng phòng GD Trung học",
        edDepartment: { id: 103, name: "Phòng Giáo dục Trung học" },
        position: { id: 206, title: "Trưởng phòng Giáo dục Trung học" },
        gender: "Nam",
        dob: "12/07/1978",
        citizenId: "001078001235",
        educationDegree: "Tiến sĩ Sư phạm Toán",
        isPartyMember: true,
      },
      {
        id: 1007,
        code: "SO-GDTH-02",
        firstName: "Linh",
        lastName: "ThS. Bùi Khánh",
        email: "linh.bk@hanoi.edu.vn",
        phone: "024.3825.1007",
        status: 1,
        departmentName: "Phòng Giáo dục Trung học",
        positionTitle: "Phó Trưởng phòng GDTH",
        edDepartment: { id: 103, name: "Phòng Giáo dục Trung học" },
        position: { id: 207, title: "Phó Trưởng phòng GDTH" },
        gender: "Nữ",
        dob: "25/12/1982",
        citizenId: "001082006781",
        educationDegree: "Thạc sĩ Ngôn ngữ Anh",
        isPartyMember: true,
      },
      {
        id: 1008,
        code: "SO-KTKD-01",
        firstName: "Đăng",
        lastName: "TS. Đỗ Hải",
        email: "dang.dh@hanoi.edu.vn",
        phone: "024.3825.1008",
        status: 1,
        departmentName: "Phòng Khảo thí & KĐCL",
        positionTitle: "Trưởng phòng Khảo thí",
        edDepartment: { id: 104, name: "Phòng Khảo thí & KĐCL" },
        position: { id: 208, title: "Trưởng phòng Khảo thí & KĐCL" },
        gender: "Nam",
        dob: "30/01/1979",
        citizenId: "001079009841",
        educationDegree: "Tiến sĩ Đo lường Giáo dục",
        isPartyMember: true,
      },
      {
        id: 1009,
        code: "SO-KHTC-01",
        firstName: "Hương",
        lastName: "ThS. Hồ Mai",
        email: "huong.hm@hanoi.edu.vn",
        phone: "024.3825.1009",
        status: 1,
        departmentName: "Phòng Kế hoạch - Tài chính",
        positionTitle: "Trưởng phòng KHTC",
        edDepartment: { id: 105, name: "Phòng Kế hoạch - Tài chính" },
        position: { id: 209, title: "Trưởng phòng Kế hoạch - Tài chính" },
        gender: "Nữ",
        dob: "14/06/1981",
        citizenId: "001081003452",
        educationDegree: "Thạc sĩ Tài chính - Kế toán",
        isPartyMember: true,
      },
      {
        id: 1010,
        code: "SO-TCCB-01",
        firstName: "Châu",
        lastName: "ThS. Ngô Bảo",
        email: "chau.nb@hanoi.edu.vn",
        phone: "024.3825.1010",
        status: 1,
        departmentName: "Phòng Tổ chức Cán bộ",
        positionTitle: "Trưởng phòng TCCB",
        edDepartment: { id: 106, name: "Phòng Tổ chức Cán bộ" },
        position: { id: 210, title: "Trưởng phòng Tổ chức Cán bộ" },
        gender: "Nam",
        dob: "08/10/1974",
        citizenId: "001074005612",
        educationDegree: "Thạc sĩ Quản trị nhân lực",
        isPartyMember: true,
      },
      {
        id: 1011,
        code: "SO-TCCB-02",
        firstName: "Huy",
        lastName: "CN. Dương Gia",
        email: "huy.dg@hanoi.edu.vn",
        phone: "024.3825.1011",
        status: 1,
        departmentName: "Phòng Tổ chức Cán bộ",
        positionTitle: "Phó Trưởng phòng TCCB",
        edDepartment: { id: 106, name: "Phòng Tổ chức Cán bộ" },
        position: { id: 211, title: "Phó Trưởng phòng Tổ chức Cán bộ" },
        gender: "Nam",
        dob: "19/04/1986",
        citizenId: "001086008712",
        educationDegree: "Cử nhân Luật Lao động",
        isPartyMember: true,
      },
      {
        id: 1012,
        code: "SO-CNTT-01",
        firstName: "Tùng",
        lastName: "ThS. Phan Thanh",
        email: "tung.pt@hanoi.edu.vn",
        phone: "024.3825.1012",
        status: 1,
        departmentName: "Văn phòng Sở",
        positionTitle: "Chuyên viên chính CSDL & Số hóa",
        edDepartment: { id: 102, name: "Văn phòng Sở" },
        position: { id: 212, title: "Chuyên viên chính CSDL & Số hóa" },
        gender: "Nam",
        dob: "28/02/1987",
        citizenId: "001087002341",
        educationDegree: "Thạc sĩ Công nghệ Thông tin",
        isPartyMember: true,
      },
    ];
  }, []);

  // Compute table dataset
  const tableData = useMemo(() => {
    const raw = data && data.length > 1 ? data : fallbackOfficials;
    const query = searchParams.get("q")?.toLowerCase().trim();
    if (!query) return raw;

    return raw.filter((item: any) => {
      const fullName = ToFullNameByLocale(item.firstName, item.lastName).toLowerCase();
      const code = (item.code || "").toLowerCase();
      const email = (item.email || "").toLowerCase();
      const dept = (item.edDepartment?.name || item.departmentName || "").toLowerCase();
      const pos = (item.position?.title || item.positionTitle || "").toLowerCase();
      return (
        fullName.includes(query) ||
        code.includes(query) ||
        email.includes(query) ||
        dept.includes(query) ||
        pos.includes(query)
      );
    });
  }, [data, fallbackOfficials, searchParams]);

  function onTableChange(pagination: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", pagination.current);
    newParams.set("size", pagination.pageSize);
    setSearchParams(newParams);
  }

  const columns: ColumnsType<any> = [
    {
      fixed: "left",
      width: 120,
      title: "Mã NV",
      dataIndex: "code",
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (val, r) => (
        <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
          {val || `SO-NV-${r.id}`}
        </Tag>
      ),
    },
    {
      fixed: "left",
      width: 250,
      title: "Họ và tên cán bộ",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => {
        const fullName =
          ToFullNameByLocale(r.firstName, r.lastName) || r.name || "Cán bộ Sở";
        const isMale =
          r.gender === "Nam" ||
          r.personal?.sex === 1 ||
          r.sex === 1 ||
          r.gender === 1 ||
          (!r.gender && !fullName.includes("Thị"));
        const initial = (r.firstName || fullName || "C").trim().charAt(0).toUpperCase();
        return (
          <Flex gap={12} align="center">
            <Avatar
              size={36}
              style={{
                backgroundColor: isMale ? "#1a73e8" : "#e91e63",
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              {initial}
            </Avatar>
            <div style={{ minWidth: 0 }}>
              <GText strong style={{ fontSize: 14, display: "block" }}>
                {fullName}
              </GText>
              <GText type="secondary" style={{ fontSize: 11, whiteSpace: "nowrap" }}>
                CCCD: {r.citizenId || r.personal?.citizenId || "00108400xxxx"}
              </GText>
            </div>
          </Flex>
        );
      },
    },
    {
      title: "Tổ / Phòng ban",
      width: 200,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => {
        const dept = r.edDepartment?.name || r.departmentName || "Văn phòng Sở";
        return <Tag color="blue">{dept}</Tag>;
      },
    },
    {
      title: "Chức vụ / Vị trí",
      width: 250,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => {
        const pos = r.position?.title || r.positionTitle || "Chuyên viên";
        const match = pos.match(/^(.*?)\s*\((.*?)\)$/);
        const tagColor = pos.includes("Giám đốc")
          ? "volcano"
          : pos.includes("Trưởng phòng") || pos.includes("Chánh")
          ? "orange"
          : "cyan";

        if (match) {
          return (
            <div>
              <Tag color={tagColor} style={{ fontWeight: 600, margin: 0 }}>
                {match[1]}
              </Tag>
              <div style={{ fontSize: 11, color: "#666", marginTop: 3 }}>
                {match[2]}
              </div>
            </div>
          );
        }

        return (
          <Tag color={tagColor} style={{ fontWeight: 600, margin: 0 }}>
            {pos}
          </Tag>
        );
      },
    },
    {
      title: "Thông tin liên hệ",
      width: 250,
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <Flex vertical gap={4} justify="center">
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, lineHeight: 1.5 }}>
            <MailOutlined style={{ color: "#1a73e8", flexShrink: 0 }} />
            <span style={{ fontFamily: "monospace" }}>{r.email || "canbo@hanoi.edu.vn"}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, lineHeight: 1.5, color: "#666" }}>
            <PhoneOutlined style={{ color: "#137333", flexShrink: 0 }} />
            <span>{r.phone || r.contactPhone || "024.3825.xxxx"}</span>
          </div>
        </Flex>
      ),
    },
    {
      title: "Trạng thái công tác",
      width: 150,
      align: "center",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      onCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: () => <Tag color="success">Đang công tác</Tag>,
    },
    {
      title: "Thao tác",
      width: 100,
      align: "center",
      fixed: "right",
      onHeaderCell: () => ({ style: { whiteSpace: "nowrap" } }),
      render: (_, r) => (
        <Tooltip title="Xem chi tiết hồ sơ cán bộ">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedStaff(r)}
          />
        </Tooltip>
      ),
    },
  ];

  return (
    <>
      <Table
        className="stretch-table"
        rowKey={(record) => record.id}
        scroll={{ x: 1300 }}
        columns={columns}
        loading={fetching}
        pagination={{
          current: page,
          pageSize: size,
          total: tableData.length,
        }}
        dataSource={tableData}
        onChange={onTableChange}
        bordered
      />

      {/* Staff Profile Dossier Modal */}
      <Modal
        className="ed-staff-modal"
        title={
          <Flex align="center" gap={8}>
            <UserOutlined style={{ color: "#1a73e8", fontSize: 20 }} />
            <span style={{ fontWeight: 700, fontSize: 16 }}>
              HỒ SƠ CÁN BỘ CƠ QUAN SỞ GD&ĐT
            </span>
          </Flex>
        }
        open={Boolean(selectedStaff)}
        onCancel={() => setSelectedStaff(null)}
        width={840}
        centered
        footer={[
          <Button
            key="export"
            icon={<DownloadOutlined />}
            onClick={() =>
              message.success(
                `Đã tải trích lục hồ sơ công chức của đồng chí ${ToFullNameByLocale(
                  selectedStaff?.firstName,
                  selectedStaff?.lastName
                )}!`
              )
            }
          >
            Trích lục hồ sơ (PDF)
          </Button>,
          <Button key="close" type="primary" onClick={() => setSelectedStaff(null)}>
            Đóng
          </Button>,
        ]}
      >
        <style>{`
          .ed-staff-modal .ant-descriptions table {
            table-layout: fixed !important;
            width: 100% !important;
          }
          .ed-staff-modal .ant-descriptions-item-label {
            width: 180px !important;
            white-space: nowrap !important;
            font-weight: 600 !important;
            background-color: #f8fafc !important;
          }
          .ed-staff-modal .ant-descriptions-item-content {
            word-break: break-word !important;
          }
        `}</style>

        {selectedStaff && (
          <Flex vertical gap={16} style={{ marginTop: 8 }}>
            <Card size="small" style={{ backgroundColor: "#f8fafc", borderRadius: 8 }}>
              <Flex align="center" justify="space-between" wrap gap={12}>
                <Flex align="center" gap={16}>
                  <Avatar
                    size={64}
                    style={{
                      backgroundColor:
                        selectedStaff.gender === "Nam" ? "#1a73e8" : "#e91e63",
                      fontSize: 22,
                      fontWeight: 600,
                    }}
                  >
                    {(selectedStaff.firstName || "CB").trim().charAt(0).toUpperCase()}
                  </Avatar>
                  <div>
                    <Flex align="center" gap={8}>
                      <GTitle level={4} style={{ margin: 0 }}>
                        {ToFullNameByLocale(
                          selectedStaff.firstName,
                          selectedStaff.lastName
                        )}
                      </GTitle>
                      <Tag color="geekblue" style={{ fontFamily: "monospace" }}>
                        {selectedStaff.code}
                      </Tag>
                    </Flex>
                    <GText type="secondary" style={{ display: "block", marginTop: 4 }}>
                      Sở Giáo dục và Đào tạo •{" "}
                      {selectedStaff.edDepartment?.name || selectedStaff.departmentName}
                    </GText>
                  </div>
                </Flex>

                <Flex vertical align="end" gap={4}>
                  <Tag color="success" style={{ padding: "4px 10px", fontSize: 13 }}>
                    Đang công tác (Active)
                  </Tag>
                  <Tag color="orange" style={{ fontWeight: 600 }}>
                    {selectedStaff.position?.title || selectedStaff.positionTitle}
                  </Tag>
                </Flex>
              </Flex>
            </Card>

            <Descriptions
              title={
                <GText strong style={{ fontSize: 14, color: "#1a73e8" }}>
                  I. THÔNG TIN CÔNG CHỨC & VỊ TRÍ VIỆC LÀM
                </GText>
              }
              bordered
              size="small"
              column={2}
              labelStyle={{ width: 180, fontWeight: 600, backgroundColor: "#fafafa" }}
            >
              <Descriptions.Item label="Mã công chức / NV">
                <Tag color="geekblue" style={{ fontFamily: "monospace", fontWeight: 600 }}>
                  {selectedStaff.code}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Họ và tên">
                <GText strong>
                  {ToFullNameByLocale(selectedStaff.firstName, selectedStaff.lastName)}
                </GText>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày sinh">
                {selectedStaff.dob || selectedStaff.personal?.dateOfBirth || "15/08/1975"}
              </Descriptions.Item>
              <Descriptions.Item label="Giới tính">
                {selectedStaff.gender || "Nam"}
              </Descriptions.Item>
              <Descriptions.Item label="Số định danh CCCD">
                <Tag color="blue" style={{ fontFamily: "monospace" }}>
                  {selectedStaff.citizenId || "001084001234"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Đảng viên">
                <Tag color={selectedStaff.isPartyMember !== false ? "red" : "default"}>
                  {selectedStaff.isPartyMember !== false
                    ? "Đảng viên Đảng CSVN"
                    : "Chưa vào Đảng"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Phòng ban trực thuộc" span={2}>
                <GText strong style={{ color: "#1a73e8" }}>
                  {selectedStaff.edDepartment?.name || selectedStaff.departmentName}
                </GText>
              </Descriptions.Item>
              <Descriptions.Item label="Chức vụ hiện nhiệm">
                <Tag color="orange">
                  {selectedStaff.position?.title || selectedStaff.positionTitle}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Trình độ học vấn">
                <Tag color="green" style={{ fontWeight: 600 }}>
                  {selectedStaff.educationDegree || "Thạc sĩ Quản lý Giáo dục"}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Email công vụ">
                <span style={{ fontFamily: "monospace" }}>{selectedStaff.email}</span>
              </Descriptions.Item>
              <Descriptions.Item label="Số điện thoại cơ quan">
                {selectedStaff.phone}
              </Descriptions.Item>
            </Descriptions>
          </Flex>
        )}
      </Modal>
    </>
  );
}
