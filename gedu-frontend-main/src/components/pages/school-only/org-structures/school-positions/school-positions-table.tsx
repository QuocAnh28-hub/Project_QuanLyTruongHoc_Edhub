import { Table, TableProps } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useSchoolPositionsContext } from "../../../../../contexts/school-only/school-departments/SchoolPositionsContext";
import { SchoolPositionRow } from "../../../../../models/school-position-model";
import { nav_links } from "../../../../../utils/routes";
import EmptyState from "../../../../molecules/empty-state";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function SchoolPositionsTable() {
  const { data, page, size, total, fetching } = useSchoolPositionsContext()
  const [searchParams, setSearchParams] = useSearchParams();
  function onTableChange(_pagination: any, _filters: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', _pagination.current);
    newParams.set('size', _pagination.pageSize);

    setSearchParams(newParams);
  }
  const columns: ColumnsType<SchoolPositionRow> = [
    {
      fixed: 'left',
      minWidth: 115,
      title: 'Mã',
      dataIndex: 'code',
      render: (_value, _record) => _record.id ?
        <Link to={nav_links.school_position_detail.route.replace(':id', _record.id + '')}>
          {_value || _record.id}
        </Link> :
        _value || _record.id,
    }, {
      title: 'Chức danh',
      dataIndex: 'title',
      render: (_value) => _value,
    }, {
      title: 'Phòng ban / Tổ trực thuộc',
      dataIndex: 'departmentName',
      render: (_value) => _value
    },
    {
      title: 'Số lượng thành viên',
      dataIndex: 'memberCount',
      render: (_value) => _value
    },
  ];
  if (!data) return null
  if (data && !data.length) return <EmptyState />
  return <Table<SchoolPositionRow>
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
    dataSource={data || undefined}
    onChange={onTableChange}
  />
}