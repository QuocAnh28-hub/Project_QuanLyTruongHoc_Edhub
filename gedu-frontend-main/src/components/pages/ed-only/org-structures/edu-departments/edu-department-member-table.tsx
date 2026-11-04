import { Avatar, Flex, Table, TableProps } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEduDepartmentDetailContext } from "../../../../../contexts/ed-only/edu-departments/EduDepartmentDetailContext";
import { EDStaffRow } from "../../../../../models/ed-only/ed-staff-model";
import { ToFullNameByLocale, ToUsername } from "../../../../../utils/locale-helpers";
import { UserOutlined } from "../../../../atoms/svg/outlined-icons";
import EmptyState from "../../../../molecules/empty-state";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function EduDepartmentMembersTable() {
  const { members, page, size, total, members_fetching } = useEduDepartmentDetailContext()
  const [searchParams, setSearchParams] = useSearchParams();

  function onTableChange(pagination: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pagination.current);
    newParams.set('size', pagination.pageSize);
    setSearchParams(newParams);
  }
  const columns: ColumnsType<EDStaffRow> = [
    {
      fixed: 'left',
      width: 103,
      title: 'Mã NV',
      dataIndex: 'code',
      render: (_value, _record) => ToUsername('staff', _value, _record.email, _record.phone),
    },
    {
      fixed: 'left',
      width: 184,
      title: 'Họ tên',
      render: (_value, _record) =>
        <Flex gap={12} align='center'>
          <Avatar icon={<UserOutlined />} style={{ minWidth: 32 }} />
          {ToFullNameByLocale(_record.firstName, _record.lastName)}
        </Flex>
    },
    {
      title: 'Tổ/Phòng ban',
      dataIndex: 'schoolDepartment',
      render: (_value) => <div>{_value?.name}</div>,
    },
    {
      title: 'Chức danh',
      dataIndex: 'position',
      render: (_value) => <div>{_value?.title}</div>,
    },
    {
      title: 'Liên hệ',
      render: (_value, _record) => <div>{_record.email || '-'}<br />{_record.phone}</div>,
    },
  ];
  if (members && !members.length && page === 1) return <EmptyState />
  return <Table<EDStaffRow>
    className="stretch-table"
    rowKey={(record) => record.id}
    scroll={{ x: 'max-content' }}
    columns={columns}
    loading={members_fetching}
    pagination={{
      current: page,
      pageSize: size,
      total: total
    }}
    dataSource={members ? members : undefined}
    onChange={onTableChange}
  />
}