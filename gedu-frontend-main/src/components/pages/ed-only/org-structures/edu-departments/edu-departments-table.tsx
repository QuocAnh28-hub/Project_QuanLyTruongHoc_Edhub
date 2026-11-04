import { Flex, Table, TableProps } from "antd";
import { useMemo } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useEduDepartmentsContext } from "../../../../../contexts/ed-only/edu-departments/EduDepartmentsContext";
import { EduDepartmentRow } from "../../../../../models/ed-only/edu-department-model";
import { nav_links } from "../../../../../utils/routes";
import { DownOutlined, RightOutlined } from "../../../../atoms/svg/outlined-icons";
import EmptyState from "../../../../molecules/empty-state";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function EduDepartmentsTable() {
  const { account } = useAppContext()
  const { data, counted_data, fetching } = useEduDepartmentsContext()
  const { departments } = useMemo(() => {
    const departments = [{
      id: 0, name: 'Sở giáo dục tỉnh An Giang', children: [] as EduDepartmentRow[]
    }] as EduDepartmentRow[]
    const parents = data?.filter(d => !d.parentId)
    parents?.map(parent => {
      const childs = data?.filter(d => d.parentId == parent.id)
      if (counted_data?.length) {
        parent.count = counted_data.find(c => c.id == parent.id)?.count
        childs?.map(child => { child.count = counted_data.find(c => c.id == child.id)?.count })
      }
      if (childs?.length) parent.children = childs
      departments[0].children?.push(parent)
    })
    return { departments }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, counted_data])

  const columns: ColumnsType<EduDepartmentRow> = [
    {
      minWidth: 135,
      title: 'Tên Phòng ban / Tổ chuyên môn',
      dataIndex: 'name',
      render: (_value, _record) => _record.id ?
        <><Link to={nav_links.edu_department_detail.route.replace(':id', _record.id + '')}>{_record.code}</Link> - {_value}</>
        : _value,
    },
    {
      title: 'Số lượng nhân viên',
      dataIndex: 'count',
      minWidth: 169,
      render: (_value) => <Flex gap={12} align="center">{_value}</Flex>
    },
  ];
  if (!data) return null
  if (data && !data.length) return <EmptyState />
  return <Table<EduDepartmentRow>
    className="stretch-table"
    rowKey={(record) => record.id}
    scroll={{ x: 'max-content' }}
    expandable={{
      indentSize: 36,
      expandIcon: (_v) => {
        if (_v.record.children)
          return _v.expanded ?
            <DownOutlined onClick={(e: any) => _v.onExpand(_v.record, e)} style={{ marginRight: 8 }} /> :
            <RightOutlined onClick={(e: any) => _v.onExpand(_v.record, e)} style={{ marginRight: 8 }} />
        else
          return <DownOutlined style={{ visibility: 'hidden', marginRight: 8 }} />
      },
      defaultExpandAllRows: true
    }}
    columns={columns}
    loading={fetching}
    pagination={false}
    dataSource={departments}
  />
}