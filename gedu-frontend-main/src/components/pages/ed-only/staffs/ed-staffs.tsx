import {
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Input,
  Row,
  Select,
  Statistic,
  message,
} from "antd";
import { useEffect, useState } from "react";
import EDStaffsProvider, {
  useEDStaffsContext,
} from "../../../../contexts/ed-only/EDStaffsContext";
import { useLayoutContext } from "../../../../contexts/EDLayoutContext";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import SearchTextBox from "../../../atoms/search-textbox";
import EDStaffsTable from "./staffs/ed-staffs-table";
import {
  CheckCircleOutlined,
  DownloadOutlined,
  IdcardOutlined,
  PlusOutlined,
  SearchOutlined,
  TeamOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

export default function SchoolEDStaffs() {
  const { setPageInfo } = useLayoutContext();
  useEffect(() => {
    setPageInfo(
      [
        {
          path: nav_links.ed_dashboard.route,
          title: nav_links.ed_dashboard.title,
        },
        { title: nav_links.ed_staffs.title },
      ],
      nav_links.ed_staffs.title
    );
    return () => {
      setPageInfo();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <EDStaffsProvider>
      <Content />
    </EDStaffsProvider>
  );
}

function Content() {
  return (
    <ContentCover vertical size="stretch" gap={16} style={{ paddingBottom: 40 }}>
      {/* Page Header */}
      <Row gutter={[16, 16]} align="middle" justify="space-between">
        <Col>
          <Flex vertical gap={4}>
            <GTitle level={3} style={{ margin: 0 }}>
              Quản lý Nhân sự Cơ quan Sở Giáo dục & Đào tạo
            </GTitle>
            <GText type="secondary">
              Quản lý danh sách, hồ sơ công chức, viên chức, ban giám đốc và chuyên viên các phòng ban chuyên môn trực thuộc Sở
            </GText>
          </Flex>
        </Col>
        <Col>
          <Flex gap={12} wrap>
            <Button
              icon={<DownloadOutlined />}
              onClick={() =>
                message.success("Đang kết xuất danh sách nhân sự cơ quan Sở (.xlsx)...")
              }
            >
              Xuất danh sách (.xlsx)
            </Button>
            <Button
              type="primary"
              icon={<UserAddOutlined />}
              onClick={() =>
                message.info("Khởi tạo biểu mẫu tiếp nhận / điều động cán bộ về Cơ quan Sở.")
              }
            >
              Thêm mới Cán bộ Sở
            </Button>
          </Flex>
        </Col>
      </Row>

      <Divider style={{ margin: "4px 0 12px 0" }} />

      {/* KPI Statistic Cards */}
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #1a73e8" }}>
            <Statistic
              title="Tổng số Cán bộ Cơ quan Sở"
              value={12}
              suffix="nhân sự"
              prefix={<TeamOutlined style={{ color: "#1a73e8" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Biên chế cơ quan Sở GD&ĐT
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #137333" }}>
            <Statistic
              title="Trình độ Thạc sĩ & Tiến sĩ"
              value={91.7}
              precision={1}
              suffix="%"
              valueStyle={{ color: "#137333" }}
              prefix={<CheckCircleOutlined style={{ color: "#137333" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              11/12 cán bộ đạt trên chuẩn
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #e91e63" }}>
            <Statistic
              title="Đảng viên Đang Sinh hoạt"
              value={11}
              suffix="đồng chí"
              valueStyle={{ color: "#e91e63" }}
              prefix={<IdcardOutlined style={{ color: "#e91e63" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Đảng bộ cơ quan Sở GD&ĐT
            </GText>
          </GCard>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <GCard vertical style={{ borderLeft: "4px solid #f2994a" }}>
            <Statistic
              title="Chuẩn hóa Vị trí Việc làm"
              value={100}
              suffix="%"
              valueStyle={{ color: "#f2994a" }}
              prefix={<CheckCircleOutlined style={{ color: "#f2994a" }} />}
            />
            <GText type="secondary" style={{ fontSize: 12, marginTop: 4, display: "block" }}>
              Bổ nhiệm theo đúng đề án
            </GText>
          </GCard>
        </Col>
      </Row>

      {/* Main Content Card */}
      <Card style={{ width: "100%", borderRadius: 8 }}>
        <Flex justify="space-between" align="center" style={{ marginBottom: 16 }} wrap gap={12}>
          <GText strong style={{ fontSize: 16 }}>
            Danh sách Công chức & Viên chức Cơ quan Sở
          </GText>
          <SearchTextBox placeholder="Tìm theo tên, mã cán bộ, phòng ban..." />
        </Flex>

        <div style={{ width: "100%", overflowX: "hidden" }}>
          <EDStaffsTable />
        </div>
      </Card>
    </ContentCover>
  );
}
