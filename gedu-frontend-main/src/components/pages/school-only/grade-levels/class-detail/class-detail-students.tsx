import { Button, Flex, message } from "antd";
import { useState } from "react";
import ClassDetailStudentsProvider, {
  useClassDetailStudentsContext,
} from "../../../../../contexts/school-only/classes/class-detail/ClassDetailStudentsContext";
import { useClassDetailContext } from "../../../../../contexts/school-only/classes/ClassDetailContext";
import {
  downloadAuthenticatedFile,
  fetching_apis,
} from "../../../../../utils/api-helpers";
import { DownloadOutlined } from "../../../../atoms/svg/outlined-icons";
import EmptyState from "../../../../molecules/empty-state";
import StudentsTable from "./students/students-table";

export default function ClassDetailStudents() {
  return (
    <ClassDetailStudentsProvider>
      <Content />
    </ClassDetailStudentsProvider>
  );
}

function Content() {
  const { data: classData } = useClassDetailContext();
  const { students, fetching } = useClassDetailStudentsContext();
  const [exporting, setExporting] = useState<boolean>(false);

  const handleExportStudents = async () => {
    if (!classData?.id) return;
    setExporting(true);
    try {
      const path = fetching_apis.exports_class_students.replace(
        "{classId}",
        classData.id + ""
      );
      await downloadAuthenticatedFile(
        path,
        `DanhSach_HocSinh_Lop_${classData.name || classData.id}.csv`
      );
      message.success("Xuất danh sách học sinh thành công!");
    } catch (err: any) {
      message.error(err.message || "Xuất danh sách thất bại");
    } finally {
      setExporting(false);
    }
  };

  if (fetching) return null;
  if (!fetching && students && !students.length)
    return (
      <Flex vertical style={{ padding: 40 }}>
        <EmptyState
          icon="school-bag"
          title="Lớp học này chưa có học sinh."
          desc="Hãy bắt đầu bằng cách thêm học sinh vào lớp để quản lý hồ sơ, điểm danh và kết quả học tập."
        />
      </Flex>
    );

  return (
    <Flex vertical gap={16}>
      <Flex justify="end">
        <Button
          icon={<DownloadOutlined />}
          loading={exporting}
          onClick={handleExportStudents}
        >
          Xuất danh sách học sinh (Excel)
        </Button>
      </Flex>
      <StudentsTable />
    </Flex>
  );
}
