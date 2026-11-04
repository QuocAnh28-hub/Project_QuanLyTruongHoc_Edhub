import { Flex } from "antd";
import SubjectsProvider from "../../../../contexts/school-only/curriculums/SubjectsContext";
import GText from "../../../atoms/g-text";
import GTitle from "../../../atoms/g-title";
import SubjectsTable from "./subjects/subjects-table";


const Subjects = () => <SubjectsProvider><Content /></SubjectsProvider>
export default Subjects

function Content() {
  return <Flex vertical gap={24}>
    <Flex vertical gap={4}>
      <GTitle level={4}>Danh sách Môn học</GTitle>
      <GText type="secondary">Quản lý danh sách tổng thể tất cả các môn học có thể được giảng dạy tại trường. Các môn học được tạo ở đây sẽ được sử dụng để gán vào các chương trình học cụ thể.</GText>
    </Flex>
    <SubjectsTable />
  </Flex>
}