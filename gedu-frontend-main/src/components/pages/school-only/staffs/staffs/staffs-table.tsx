import { Button, Flex, Modal, Table, TableProps, Tag } from "antd";
import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useStaffsContext } from "../../../../../contexts/school-only/staffs/StaffsContext";
import { useLayoutContext } from "../../../../../contexts/SchoolLayoutContext";
import { useMetaSchoolDepartments, useMetaSchoolPositions } from "../../../../../hooks/school-only/shared-data-hook";
import { callActivateASchoolStaff } from "../../../../../hooks/school-only/staffs-hook";
import { SchoolStaffStatusEnum } from "../../../../../models/enums";
import { StaffRow } from "../../../../../models/staff-model";
import { nav_links } from "../../../../../utils/routes";
import SchoolStaffStatusTag from "../../../../atoms/school-staff-status";
import { ThunderboltOutlined } from "../../../../atoms/svg/outlined-icons";
import NameCardSimple from "../../../../molecules/name-card-simple";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function StaffsTable() {
  const { authority } = useAppContext()
  const { data, page, size, total, fetching, mutate } = useStaffsContext()
  const { callMessage } = useLayoutContext()
  const { data: dept } = useMetaSchoolDepartments()
  const { data: pos } = useMetaSchoolPositions(null)
  const [searchParams, setSearchParams] = useSearchParams();

  async function handleActivate(record: StaffRow) {
    Modal.confirm({
      title: 'Xác nhận Kích hoạt Cán bộ & Giáo viên',
      content: (
        <Flex vertical gap={8}>
          <div>Bạn có chắc chắn muốn kích hoạt tài khoản cho:</div>
          <div>
            <strong>{record.lastName} {record.firstName}</strong> (Mã: {record.code || record.email})
          </div>
          <div>Sau khi kích hoạt, trạng thái công tác sẽ chuyển thành &quot;Đang làm việc&quot; và giáo viên có thể đăng nhập vào hệ thống.</div>
        </Flex>
      ),
      okText: 'Kích hoạt',
      cancelText: 'Huỷ bỏ',
      onOk: async () => {
        const res = await callActivateASchoolStaff(record.id)
        if (res?.error?.message) {
          callMessage(res.error.message, 'error')
        } else {
          callMessage('Kích hoạt tài khoản thành công', 'success')
          mutate?.()
        }
      },
    })
  }
  const { dept_list, pos_list } = useMemo(() => {
    const dept_list = dept?.map((_d: { id: number; name: string; }) => ({
      value: _d.id,
      text: _d.name
    }));
    const pos_list = pos?.map((_d: { id: number; title: string; }) => ({
      value: _d.id,
      text: _d.title
    }));
    return { dept_list, pos_list }
  }, [dept, pos])

  function onTableChange(pagination: any, filters: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pagination.current);
    newParams.set('size', pagination.pageSize);
    if (filters?.schoolDepartment && filters?.schoolDepartment.length < dept_list.length)
      newParams.set('dept', filters.schoolDepartment.toString())
    else
      newParams.delete('dept')

    if (filters?.position)
      newParams.set('pos', filters.position.toString())
    else
      newParams.delete('pos')

    setSearchParams(newParams);
  }
  const rowSelection: TableProps<StaffRow>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: StaffRow[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
  };
  const columns: ColumnsType<StaffRow> = [
    {
      fixed: 'left',
      width: 310,
      title: 'Họ tên & Mã nhân viên',
      dataIndex: 'code',
      render: (_value, _record) =>
        <NameCardSimple
          firstName={_record.firstName}
          lastName={_record.lastName}
          link={nav_links.staff_detail.route.replace(':id', _record.id + '')}
          code={_value || _record.email}
        />,
    },
    {
      title: 'Tổ/Phòng ban',
      dataIndex: 'schoolDepartment',
      render: (_value) => <div>{_value?.name}</div>,
      filters: dept_list,
      filterSearch: true,
    },
    {
      title: 'Chức danh',
      dataIndex: 'position',
      render: (_value) => <div>{_value?.title}</div>,
      filters: pos_list,
      filterSearch: true,
    },
    {
      title: 'Kiêm nhiệm',
      dataIndex: 'schoolPositions',
      render: (_value) => (_value?.length | 1) > 1 ? <Tag>{_value.length - 1} chức vụ</Tag> : <div>-</div>
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
    {
      fixed: 'right',
      width: 110,
      dataIndex: 'status',
      hidden: !authority?.can_touch_staff,
      render: (_value, _record) => <Flex gap={8}>
        {_value == SchoolStaffStatusEnum.MoiTao.enum ?
          <Button size='small'
            icon={<ThunderboltOutlined />}
            onClick={() => handleActivate(_record)}
          >Kích hoạt</Button> : null}
      </Flex>,
    },
  ];
  return <Table<StaffRow>
    className="stretch-table"
    rowKey={(record) => record.id}
    scroll={{ x: 'max-content' }}
    rowSelection={authority?.can_touch_staff ? { type: 'checkbox', ...rowSelection } : undefined}
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