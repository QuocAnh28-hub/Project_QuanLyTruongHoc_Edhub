import { Flex, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useSearchParams } from "react-router-dom";
import { useClassDetailStudentsContext } from "../../../../../../contexts/school-only/classes/class-detail/ClassDetailStudentsContext";
import { ToFullNameByLocale } from "../../../../../../utils/locale-helpers";
import { nav_links } from "../../../../../../utils/routes";
import GText from "../../../../../atoms/g-text";
import StudentStatusTag from "../../../../../atoms/student-status";
import EmptyState from "../../../../../molecules/empty-state";
import NameCardSimple from "../../../../../molecules/name-card-simple";

export default function StudentsTable() {
  const { students, page, size, total, fetching } = useClassDetailStudentsContext()
  const [searchParams, setSearchParams] = useSearchParams();

  function onTableChange(pagination: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pagination.current);
    newParams.set('size', pagination.pageSize);
    setSearchParams(newParams);
  }
  const columns: ColumnsType<any> = [
    {
      fixed: 'left',
      width: 310,
      title: 'Họ tên & Mã học sinh',
      dataIndex: 'studentCode',
      render: (_value, _record) =>
        <NameCardSimple
          firstName={_record.firstName}
          lastName={_record.lastName}
          link={nav_links.student_detail.route.replace(':id', _record.id + '')}
          code={_value}
        />,
    },
    {
      title: 'Người liên hệ chính',
      dataIndex: 'mainStudentContactPhone',
      render: (_value, _record) =>
        <Flex vertical>
          <GText>{ToFullNameByLocale(_record.mainStudentContactFirstName, _record.mainStudentContactLastName)}</GText>
          {_value ? <GText>{_value}</GText> : null}
        </Flex>
    },
    {
      title: 'Tình trạng học tập',
      dataIndex: 'status',
      render: (_value) => <StudentStatusTag status={_value} />,
    },
  ];
  if (students && !students.length && page === 1 && !fetching) return <EmptyState />
  return <Table<any>
    className="stretch-table"
    rowKey={(record) => record.id}
    scroll={{ x: 'max-content' }}
    columns={columns}
    loading={fetching}
    pagination={{
      current: page,
      pageSize: size,
      total: total
    }}
    dataSource={students ? students : undefined}
    onChange={onTableChange}
  />
}