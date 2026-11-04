import { Flex } from "antd";
import SchoolDepartmentsProvider from "../../../../contexts/school-only/school-departments/SchoolDepartmentsContext";
import GTitle from "../../../atoms/g-title";
import SchoolDepartmentsTable from "./school-departments/school-departments-table";


const SchoolDepartments = () => <SchoolDepartmentsProvider><Content /></SchoolDepartmentsProvider>
export default SchoolDepartments

function Content() {
  return <Flex vertical gap={24}>
    <Flex><GTitle level={4}>Cấu trúc Phòng ban / Tổ chuyên môn</GTitle></Flex>
    <SchoolDepartmentsTable />
  </Flex>
}