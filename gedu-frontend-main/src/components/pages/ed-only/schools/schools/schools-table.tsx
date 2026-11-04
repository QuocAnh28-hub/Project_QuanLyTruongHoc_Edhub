import { Flex, Table, TableProps } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { useSchoolsContext } from "../../../../../contexts/ed-only/SchoolsContext";
import { schoolLevel, SchoolRow, schoolStatus, schoolType } from "../../../../../models/ed-only/school-model";
import { getSchoolTypeEnum, SchoolLevelEnum, SchoolStaffStatusEnum, SchoolStatusEnum, SchoolTypeEnum } from "../../../../../models/enums";
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers";
import { nav_links } from "../../../../../utils/routes";
import SchoolStatusTag from "../../../../atoms/school-status";
import ActivateSchoolAdmin from "../../../../organisms/ed-only/activate-school-admin";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function SchoolsTable() {
  const { data, page, size, total, fetching } = useSchoolsContext()
  const [searchParams, setSearchParams] = useSearchParams();
  function onTableChange(pagination: any, filters: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pagination.current);
    newParams.set('size', pagination.pageSize);
    if (filters?.level && filters.level.length < 4)
      newParams.set('level', filters.level.toString())
    else
      newParams.delete('level')

    // const __status = filters?.status?.filter((t: number) => t != 0)
    if (filters?.status?.length && filters.status.length < Object.keys(SchoolStatusEnum).length - 1) {
      newParams.set('status', filters.status.toString())
    }
    else
      newParams.delete('status')

    // if (filters?.status?.some((t: number) => t === 0))
    //   newParams.set('status', '5')
    // else
    //   newParams.delete('status')

    const __type = filters?.type?.filter((t: number) => t != 4)
    if (__type?.length && __type.length < Object.keys(SchoolTypeEnum).length) {
      newParams.set('type', __type.toString())
    }
    else
      newParams.delete('type')

    if (filters?.type?.some((t: number) => t === 4))
      newParams.set('intl', '1')
    else
      newParams.delete('intl')

    setSearchParams(newParams);
  }
  const rowSelection: TableProps<SchoolRow>['rowSelection'] = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: SchoolRow[]) => {
      console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: (record: SchoolRow) => ({
      disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.name,
    }),
  };
  const columns: ColumnsType<SchoolRow> = [
    {
      title: 'Mã trường',
      dataIndex: 'code',
      render: (_value, record) => <Link to={nav_links.school_detail.route.replace(':id', record.id + '')}>{_value}</Link>,
    },
    {
      title: 'Tên trường',
      dataIndex: 'name',
    },
    {
      title: 'Loại hình',
      dataIndex: 'type',
      render: (_value) => <div>{getSchoolTypeEnum(_value)?.title}</div>,
      filters: schoolType,
    },
    {
      title: 'Cấp học',
      dataIndex: 'level',
      render: (_value, record) => <div>{getSchoolLevelString(record.canPreschool, record.canPrimarySchool, record.canLowerSecondarySchool, record.canUpperSecondarySchool)}</div>,
      filters: schoolLevel,
    },
    {
      title: 'Quản trị viên',
      dataIndex: 'admin',
      render: (_value) => _value?.length ?
        <Flex vertical>
          <div>{ToFullNameByLocale(_value[0].firstName, _value[0].lastName)}</div>
          <div>{_value[0].email}</div>
        </Flex> : <div>-</div>
    },
    {
      title: 'Tài khoản Gedu',
      dataIndex: 'status',
      filters: schoolStatus,
      render: (_value, _record) => getSchoolStatus(_value, _record.admin),
    },
    {
      fixed: 'right',
      width: 48,
      dataIndex: 'id',
      render: (_value, _record) => <Flex gap={8}>
        {_record?.admin?.length && Number(_record.admin[0].status) === SchoolStaffStatusEnum.MoiTao.enum && _record.admin[0].staffId ?
          <ActivateSchoolAdmin
            school_id={_value} school_code={_record.code} school_name={_record.name}
            admin_id={_record.admin[0].staffId} admin_name={ToFullNameByLocale(_record.admin[0].firstName, _record.admin[0].lastName)}
          />
          : null
        }
      </Flex>,
    },
  ];
  return <Table<SchoolRow>
    className="stretch-table"
    rowSelection={{ type: 'checkbox', ...rowSelection }}
    rowKey={(record) => record.id}
    scroll={{ x: 'max-content' }}
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
function getSchoolLevelString(canPreschool: boolean, canPrimarySchool: boolean, canLowerSecondarySchool: boolean, canUpperSecondarySchool: boolean) {
  let count = 0
  let title = ''
  if (canPreschool) {
    count++
    title = SchoolLevelEnum.MamNon.short
  }
  if (canPrimarySchool) {
    count++
    title = SchoolLevelEnum.TieuHoc.short
  }
  if (canLowerSecondarySchool) {
    count++
    title = SchoolLevelEnum.THCS.short
  }
  if (canUpperSecondarySchool) {
    count++
    title = SchoolLevelEnum.THPT.short
  }
  if (count > 1) title = SchoolLevelEnum.LienCap.short
  return title
}
function getSchoolStatus(_status: number, _admin: any[] | undefined) {
  if (!_admin?.length) return <SchoolStatusTag status={SchoolStatusEnum.ThieuQuanTriVien.enum} />
  return <SchoolStatusTag status={_status} />
}