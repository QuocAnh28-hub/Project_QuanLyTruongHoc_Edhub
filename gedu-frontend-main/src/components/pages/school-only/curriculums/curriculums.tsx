import { Flex } from "antd";
import CurriculumsProvider from "../../../../contexts/school-only/curriculums/CurriculumsContext";
import GTitle from "../../../atoms/g-title";
import CurriculumsTable from "./curriculums/curriculums-table";


const Curriculums = () => <CurriculumsProvider><Content /></CurriculumsProvider>
export default Curriculums

function Content() {
  return <Flex vertical gap={24}>
    <Flex><GTitle level={4}>Danh sách Chương trình học</GTitle></Flex>
    <CurriculumsTable />
  </Flex>
}