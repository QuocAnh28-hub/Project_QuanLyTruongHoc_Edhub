import { Flex } from "antd";
import EduDepartmentsProvider from "../../../../contexts/ed-only/edu-departments/EduDepartmentsContext";
import GTitle from "../../../atoms/g-title";
import EduDepartmentsTable from "./edu-departments/edu-departments-table";


const EduDepartments = () => <EduDepartmentsProvider><Content /></EduDepartmentsProvider>
export default EduDepartments

function Content() {
  return <Flex vertical gap={24}>
    <Flex><GTitle level={4}>Cấu trúc Phòng ban / Tổ chuyên môn</GTitle></Flex>
    <EduDepartmentsTable />
  </Flex>
}