import { Button, Flex, Skeleton } from "antd";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../contexts/AppContext";
import GradeLevelDetailProvider, { useGradeLevelDetailContext } from "../../../../contexts/school-only/grade-levels/GradeLevelDetailContext";
import { useGradeLevelsContext } from "../../../../contexts/school-only/grade-levels/GradeLevelsContext";
import { StudentGradeModel } from "../../../../models/enums";
import { nav_links } from "../../../../utils/routes";
import { PlusOutlined } from "../../../atoms/svg/outlined-icons";
import EmptyState from "../../../molecules/empty-state";
import ClassesTable from "./classes/classes-table";

export default function GradeLevelDetail() {
  return <GradeLevelDetailProvider>
    <Content />
  </GradeLevelDetailProvider>
}
function Content() {
  const { authority } = useAppContext()
  const { grade, school_year } = useGradeLevelsContext()
  const { data, fetching, page, query, curr } = useGradeLevelDetailContext()
  if (fetching) return <Skeleton />
  if (data && !data.length && page === 1 && !query && !curr)
    return <EmptyPanel grade={grade || undefined} school_year={school_year} can_create={authority?.can_touch_grade || false} />
  return <Flex vertical gap={16}>
    {authority?.can_touch_grade &&
      <Flex justify="flex-end"><Button type='primary'>Tạo nhanh</Button></Flex>
    }
    <ClassesTable />
  </Flex>
}
function EmptyPanel({ grade, school_year, can_create }: { grade?: StudentGradeModel, school_year?: number | null, can_create: boolean }) {
  return <Flex vertical>
    <EmptyState icon="class-table" title='Chưa có lớp nào' desc='Hãy bắt đầu bằng cách tạo lớp mới.' />
    {can_create && <Flex gap={12} justify="center" style={{ marginTop: 24 }}>
      <Link
        to={nav_links.classes_new.route}
        state={{ grade, school_year }}
      >
        <Button type='primary' icon={<PlusOutlined />}>Tạo lớp học cho Khối này</Button>
      </Link>
    </Flex>
    }
  </Flex>
}