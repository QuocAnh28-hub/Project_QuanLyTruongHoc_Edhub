import { Avatar, Flex, Table, TableProps } from "antd";
import { useSearchParams } from "react-router-dom";
import { useEDStaffsContext } from "../../../../../contexts/ed-only/EDStaffsContext";
import { EDStaffRow } from "../../../../../models/ed-only/ed-staff-model";
import { ToFullNameByLocale, ToUsername } from "../../../../../utils/locale-helpers";
import SchoolStaffStatusTag from "../../../../atoms/school-staff-status";
import { UserOutlined } from "../../../../atoms/svg/outlined-icons";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function EDStaffsTable() {
  const { data, page, size, total, fetching } = useEDStaffsContext()
  const [searchParams, setSearchParams] = useSearchParams();
  // const { data: dept } = useMetaSchoolDepartments()
  // const { data: pos } = useMetaSchoolPositions(null)
  // const { dept_list, pos_list } = useMemo(() => {
  //   const dept_list = dept?.map((_d: { id: number; name: string; }) => ({
  //     value: _d.id,
  //     text: _d.name
  //   }));
  //   const pos_list = pos?.map((_d: { id: number; title: string; }) => ({
  //     value: _d.id,
  //     text: _d.title
  //   }));
  //   return { dept_list, pos_list }
  // }, [dept, pos])

  function onTableChange(pagination: any, filters: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pagination.current);
    newParams.set('size', pagination.pageSize);
    // if (filters?.schoolDepartment && filters?.schoolDepartment.length < dept_list.length)
    //   newParams.set('dept', filters.schoolDepartment.toString())
    // else
    //   newParams.delete('dept')

    // if (filters?.position)
    //   newParams.set('pos', filters.position.toString())
    // else
    //   newParams.delete('pos')

    setSearchParams(newParams);
  }
  const rowSelection: TableProps<EDStaffRow>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: EDStaffRow[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  const columns: ColumnsType<EDStaffRow> = [
    {
      fixed: 'left',
      width: 103,
      title: 'Mã NV',
      dataIndex: 'code',
      render: (_value, _record) => ToUsername('staff', _value, _record.email, _record.phone)
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
      dataIndex: 'edDepartment',
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
    {
      title: 'Trạng thái công tác',
      dataIndex: 'status',
      render: (_value) => <SchoolStaffStatusTag status={_value} />,
    },
  ];
  return <Table<EDStaffRow>
    className="stretch-table"
    rowKey={(record) => record.id}
    scroll={{ x: 'max-content' }}
    rowSelection={{ type: 'checkbox', ...rowSelection }}
    columns={columns}
    loading={fetching}
    pagination={{
      current: page,
      pageSize: size,
      total: total
    }}
    dataSource={data ? data : undefined}
    onChange={onTableChange}
  />
}