import { Flex } from "antd";
import EDPositionsProvider from "../../../../contexts/ed-only/edu-departments/EDPositionsContext";
import GTitle from "../../../atoms/g-title";
import EDPositionsTable from "./ed-positions/ed-positions-table";


const EDPositions = () => <EDPositionsProvider><Content /></EDPositionsProvider>
export default EDPositions

function Content() {
  return <Flex vertical gap={24}>
    <Flex><GTitle level={4}>Chức danh & Phân quyền</GTitle></Flex>
    <EDPositionsTable />
  </Flex>
}