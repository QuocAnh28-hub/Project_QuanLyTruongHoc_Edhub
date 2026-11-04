import { Flex } from "antd";
import SchoolPositionsProvider from "../../../../contexts/school-only/school-departments/SchoolPositionsContext";
import GTitle from "../../../atoms/g-title";
import SchoolPositionsTable from "./school-positions/school-positions-table";


const SchoolPositions = () => <SchoolPositionsProvider><Content /></SchoolPositionsProvider>
export default SchoolPositions

function Content() {
  return <Flex vertical gap={24}>
    <Flex><GTitle level={4}>Chức danh & Phân quyền</GTitle></Flex>
    <SchoolPositionsTable />
  </Flex>
}