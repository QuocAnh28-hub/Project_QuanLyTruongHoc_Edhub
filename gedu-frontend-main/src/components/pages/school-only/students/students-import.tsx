import { Button, Divider, Flex } from "antd";
import { useEffect } from "react";
import StudentImportProvider from "../../../../contexts/school-only/students/StudentImportContext";
import { useLayoutContext } from "../../../../contexts/SchoolLayoutContext";
import { import_students } from "../../../../models/external-links";
import { nav_links } from "../../../../utils/routes";
import ContentCover from "../../../atoms/content-cover";
import GCard from "../../../atoms/g-card";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import { DownloadOutlined } from "../../../atoms/svg/outlined-icons";
import StudentImportDragger from "./student-import/student-import-dragger";

export default function StudentsImport() {
  const { setPageInfo } = useLayoutContext()
  useEffect(() => {
    setPageInfo([
      { path: nav_links.ed_dashboard.route, title: nav_links.ed_dashboard.title },
      { path: nav_links.students.route, title: nav_links.students.title },
      { title: nav_links.student_import.title },
    ], nav_links.student_import.title)
    return () => { setPageInfo() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return <StudentImportProvider>
    <ContentCover gap={20}>
      <Flex justify="space-between">
        <GTitle level={3}>Tải lên danh sách Học sinh</GTitle>
        <Flex gap={12}>
          {/* <Button icon={<QuestionCircleOutlined />}>Xem hướng dẫn</Button> */}
          <a href={import_students.link} download={import_students.file_name} target='_blank'>
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
          <StudentImportDragger />
        </Flex>
      </GCard>
    </ContentCover>
  </StudentImportProvider>
}