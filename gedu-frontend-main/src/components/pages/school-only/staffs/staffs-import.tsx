import { Button, Divider, Flex } from "antd";
import { useEffect } from "react";
import StaffImportProvider from "../../../../contexts/school-only/staffs/StaffImportContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { import_staffs } from "../../../../models/external-links";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import { DownloadOutlined } from "../../../atoms/svg/outlined-icons";
import StaffImportDragger from "./staffs-import/staff-import-dragger";

export default function StaffImport() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { path: nav_links.staffs.route, title: nav_links.staffs.title },
      { title: nav_links.staff_import.title },
    ], nav_links.staff_import.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StaffImportProvider>
    <ContentCover gap={20}>
      <Flex justify="space-between">
        <GTitle level={3}>Tải lên danh sách Cán bộ & Giáo viên</GTitle>
        <Flex gap={12}>
          {/* <Button icon={<QuestionCircleOutlined />}>Xem hướng dẫn</Button> */}
          <a href={import_staffs.link} download={import_staffs.file_name} target='_blank'>
            <Button type="primary" icon={<DownloadOutlined />} style={{ marginBottom: 4 }}>Tải về Tệp mẫu</Button>
          </a>
        </Flex>
      </Flex>
      <GCard vertical size="lg" flex={1} gap={16}>
        <Flex>
          <GText>Để tải lên thành công, tệp của bạn cần có <strong>đầy đủ các cột và định dạng dữ liệu khớp với tệp mẫu</strong> được cung cấp.</GText>
        </Flex>
        <Flex gap={4} align="center" wrap>
          <Flex gap={4} wrap>
            <GText>Định dạng:</GText>
            <GText strong>.CSV; .XLSX</GText>
          </Flex>
          <Divider type="vertical" />
          <Flex gap={4} wrap>
            <GText>Dung lượng tối đa:</GText>
            <GText strong>3MB hoặc 1000 dòng</GText>
          </Flex>
        </Flex>
        <Flex flex='auto' className="schl-mprt">
          <StaffImportDragger />
        </Flex>
      </GCard>
    </ContentCover>
  </StaffImportProvider>
}