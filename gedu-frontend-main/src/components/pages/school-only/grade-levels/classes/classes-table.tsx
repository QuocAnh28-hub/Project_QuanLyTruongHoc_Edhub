import { Avatar, Button, Flex, MenuProps, Table, TableProps } from "antd";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useGradeLevelDetailContext } from "../../../../../contexts/school-only/grade-levels/GradeLevelDetailContext";
import { ClassRow } from "../../../../../models/class-model";
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers";
import { nav_links } from "../../../../../utils/routes";
import { DeleteOutlined, FormOutlined, UserOutlined } from "../../../../atoms/svg/outlined-icons";
import DeleteClassModal from "./delete-class-modal";
import UpdateClassModal from "./update-class-modal";

type ColumnsType<T extends object = object> = TableProps<T>['columns']
export default function ClassesTable() {
  const { authority } = useAppContext()
  const { data, page, size, total, fetching, refreshing, mutate } = useGradeLevelDetailContext()
  const [searchParams, setSearchParams] = useSearchParams()
  const [selected, setSelected] = useState<ClassRow | null>(null)
  const [open_update, setOpenUpdate] = useState<boolean>(false)
  const [open_delete, setOpenDelete] = useState<boolean>(false)

  function onTableChange(pagination: any) {
    const newParams = new URLSearchParams(searchParams)
    newParams.set('page', pagination.current)
    newParams.set('size', pagination.pageSize)
    setSearchParams(newParams)
  }
  function handleClose() {
    setSelected(null)
    setOpenUpdate(false)
    setOpenDelete(false)
  }
  function handleOk() {
    handleClose()
    mutate()
  }
  const columns: ColumnsType<ClassRow> = [
    {
      fixed: 'left',
      minWidth: 110,
      title: 'Tên lớp học',
      dataIndex: 'name',
      render: (_value, _record) =>
        <Link to={nav_links.class_detail.route.replace(':id', _record.id + '')}>
          {_value || _record.id}
        </Link>
    },
    {
      title: 'Giáo viên Chủ nhiệm (GVCN)',
      dataIndex: 'homeroomTeacher',
      render: (_value) => _value ? <Flex gap={12} align="center">
        <Avatar icon={<UserOutlined />} style={{ minWidth: 32 }} />
        {ToFullNameByLocale(_value.firstName, _value.lastName)}
      </Flex> : '-',
    },
    {
      title: 'Sĩ số',
      dataIndex: 'classSize',
      render: (_value, _record) => (_value || 0) + ' / ' + (_record.maxClassSize || 0),
    },
    {
      title: 'Chương trình học',
      dataIndex: 'curriculumName',
      render: (_value) => _value,
    },
    {
      fixed: 'right',
      width: 48,
      dataIndex: 'id',
      hidden: !authority?.can_touch_grade,
      render: (_value, _record) => <Flex gap={8}>
        <Button icon={<FormOutlined />}
          onClick={() => {
            setSelected(_record)
            setOpenUpdate(true)
          }}
        />
        {/* <Dropdown placement="bottomRight"
          menu={{
            items, onClick: (e: any) => {
              if (e.key === 'delete') {
                setSelected(_record)
                setOpenDelete(true)
              }
            }
          }}>
          <Button icon={<EllipsisOutlined />} />
        </Dropdown> */}
      </Flex>,
    },
  ];
  return <Fragment>
    <Table<ClassRow>
      loading={fetching || refreshing}
      className="stretch-table"
      rowKey={(record) => record.id}
      scroll={{ x: 'max-content' }}
      columns={columns}
      pagination={{
        current: page,
        pageSize: size,
        total: total
      }}
      dataSource={data ? data : undefined}
      onChange={onTableChange}
    />
    {open_update && selected ? <UpdateClassModal close={handleClose} ok={handleOk} record={selected} /> : null}
    {open_delete && selected ? <DeleteClassModal close={handleClose} ok={handleOk} record={selected} /> : null}
  </Fragment>
}
const items: MenuProps['items'] = [
  {
    key: 'delete',
    label: 'Xoá lớp học',
    danger: true,
    icon: <DeleteOutlined />,
  },
];