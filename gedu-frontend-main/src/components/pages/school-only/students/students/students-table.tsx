import { Button, Dropdown, Flex, Table, TableProps, Typography } from "antd";
import { MenuProps } from "antd/lib";
import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useBulkActionContext } from "../../../../../contexts/BulkActionContext";
import { useStudentsContext } from "../../../../../contexts/school-only/students/StudentsContext";
import { useLayoutContext } from "../../../../../contexts/SchoolLayoutContext";
import { useMetaClasses } from "../../../../../hooks/school-only/shared-data-hook";
import { StudentRow } from "../../../../../models/student-model";
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers";
import { nav_links } from "../../../../../utils/routes";
import StudentStatusTag from "../../../../atoms/student-status";
import { ClassOutlined, EllipsisOutlined, LogoutOutlined } from "../../../../atoms/svg/outlined-icons";
import NameCardSimple from "../../../../molecules/name-card-simple";
import ArrangeStudentClass from "./arrange-students-class-modal";
import ChangeStudentClass from "./transfer-students-class-modal";

const { Text } = Typography
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function StudentsTable() {
  const { account, authority } = useAppContext()
  const { grade_levels } = useLayoutContext()
  const { data, page, size, total, fetching, refreshing, mutate } = useStudentsContext()
  const { setRecords } = useBulkActionContext()
  const { data: clss } = useMetaClasses(account?.additional.school_year_id)

  const [selected, setSelected] = useState<StudentRow | null>()
  const [open_update, setOpenUpdate] = useState<boolean>(false)
  const [open_change_class, setOpenChangeClass] = useState<boolean>(false)
  const [searchParams, setSearchParams] = useSearchParams();
  const { clss_list } = useMemo(() => {

    const clss_list = clss?.map((_d: { id: number; grade_level: number, name: string; }) => ({
      value: _d.id,
      text: _d.name
    }));
    return { clss_list }
  }, [clss])

  function handleClose() {
    setSelected(null)
    setOpenUpdate(false)
  }
  function handleOk() {
    handleClose()
    mutate()
  }


  function handleOkChangeClass() {
    setOpenChangeClass(false)
    handleOk()
  }

  function handleCloseChangeClass() {
    setOpenChangeClass(false)
    setSelected(null)
  }


  function onTableChange(pagination: any, filters: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pagination.current);
    newParams.set('size', pagination.pageSize);
    if (filters?.gradeLevel && filters?.gradeLevel.length < grade_levels.length)
      newParams.set('grd', filters.gradeLevel.toString())
    else
      newParams.delete('grd')

    setSearchParams(newParams);
  }
  const rowSelection: TableProps<StudentRow>['rowSelection'] = {
    onChange: (_, _selectedRows: StudentRow[]) => {
      setRecords(_selectedRows)
    },
  };
  const columns: ColumnsType<StudentRow> = [

    {
      fixed: 'left',
      width: 310,
      title: 'Họ tên & Mã học sinh',
      dataIndex: 'code',
      render: (_value, _record) =>
        <NameCardSimple
          firstName={_record.firstName}
          lastName={_record.lastName}
          link={nav_links.student_detail.route.replace(':id', _record.id + '')}
          code={_value}
        />
    },
    {
      title: 'Khối',
      dataIndex: 'gradeLevel',
      render: (_value) => {
        if (!_value) return
        return <div>{grade_levels.find(s => s.enum == _value)?.title}</div>
      },
      filters: grade_levels.map((item) => ({
        text: item.title,
        value: item.enum
      })
      ),
      filterSearch: true,
    },
    {
      title: 'Lớp',
      dataIndex: 'classNames',
      render: (_value) => <div>{_value}</div>,
      // filters: clss_list,
      // filterSearch: true,
    },
    {
      title: 'Người liên hệ chính',
      dataIndex: 'mainStudentContact',
      render: (_value) => _value ? <Flex vertical>
        <Text>{ToFullNameByLocale(_value.firstName, _value.lastName)}</Text>
        <Text>{_value.phone}</Text>
      </Flex> : '-',
    },
    {
      title: 'Tình trạng học tập',
      dataIndex: 'status',
      render: (_value) => <StudentStatusTag status={_value} />,
    },
    {
      fixed: 'right',
      width: 48,
      dataIndex: 'id',
      hidden: !authority?.can_touch_student,
      render: (_value, _record) =>
        <Flex gap={8} justify="end" align="center">
          {!_record.classId?.length ?
            <Button
              size="small"
              icon={<ClassOutlined />}
              onClick={() => {
                setSelected(_record)
                setOpenUpdate(true)
              }}
            >Xếp lớp</Button>
            : null}
          <Flex>
            <Popup
              record={_record}
              setOpenChangeClass={setOpenChangeClass}
              setSelected={setSelected}
            />
          </Flex>
        </Flex>
    },
  ];
  return <Fragment>
    <Table<StudentRow>
      className="stretch-table"
      rowKey={(record) => record.id}
      scroll={{ x: 'max-content' }}
      rowSelection={authority?.can_touch_student ? { type: 'checkbox', ...rowSelection } : undefined}
      columns={columns}
      loading={fetching || refreshing}
      pagination={{
        current: page,
        pageSize: size,
        total: total
      }}
      dataSource={data ? data : undefined}
      onChange={onTableChange}
    />
    {open_update && selected ? <ArrangeStudentClass open={open_update} close={handleClose} ok={handleOk} record={selected} /> : null}
    {open_change_class && selected ? <ChangeStudentClass close={handleCloseChangeClass} ok={handleOkChangeClass} record={selected} /> : null}
  </Fragment>
}

function Popup({ record, setOpenChangeClass, setSelected }: { record?: StudentRow, setOpenChangeClass: (open: boolean) => void, setSelected: (record: StudentRow | null) => void }) {
  const items: MenuProps['items'] = [
    {
      key: 'account',
      label: 'Chuyển lớp',
      disabled: !record?.classId?.length,
      icon: <LogoutOutlined />,
      onClick: () => {
        if (!record) return
        setOpenChangeClass(true)
        setSelected(record)
      }
    },
  ];

  return <Fragment>
    <Dropdown
      menu={{
        items,
      }}
    >
      <Button icon={<EllipsisOutlined />} size="small" />
    </Dropdown>
  </Fragment>
}