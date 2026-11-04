import { Button, Flex, Modal, Table, TableProps } from "antd";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useSchoolYearsContext } from "../../../../../contexts/school-only/school-years/SchoolYearsContext";
import { SchoolYearStatusEnum } from "../../../../../models/enums";
import { SchoolYearRow } from "../../../../../models/school-year-model";
import { ToFormatedDate } from "../../../../../utils/locale-helpers";
import { nav_links } from "../../../../../utils/routes";
import GText from "../../../../atoms/g-text";
import SchoolYearStatusTag from "../../../../atoms/school-year-status";
import { CheckOutlined } from "../../../../atoms/svg/outlined-icons";
type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function SchoolYearsTable() {
  const { authority } = useAppContext()
  const { data, page, size, total, fetching, startSchoolYear, loading } = useSchoolYearsContext()
  const [open, setOpen] = useState<boolean>(false)
  async function handleStart(_school_year_id: number) {
    const results = await startSchoolYear(_school_year_id)
    if (!results?.status) {
      Modal.error({
        okText: 'Đóng',
        title: 'Chưa đủ điều kiện để bắt đầu năm học',
        content: <Flex vertical style={{ marginTop: 8, marginBottom: 8 }}>
          <GText>Để bắt đầu năm học, vui lòng hoàn thành các thiết lập sau:</GText>
          <ul style={{ margin: 0, paddingLeft: 24 }}>
            <li>Đã tạo ít nhất một Lớp học.</li>
            <li>Đã có ít nhất một Học sinh được xếp vào một Lớp học.</li>
            <li>Đã có ít nhất một Giáo viên được phân công giảng dạy.</li>
          </ul>
        </Flex>
      });
    }
  }
  const columns: ColumnsType<SchoolYearRow> = [
    {
      fixed: 'left',
      width: 121,
      title: 'Năm học',
      dataIndex: 'title',
      render: (_value, _record) =>
        <Link to={nav_links.school_year_detail.route.replace(':id', _record.id + '')}>
          {_value}
        </Link>,
    },
    {
      title: 'Khung Thời gian Năm học',
      render: (_, _record) =>
        <Flex gap={16} align="center">
          <Flex>{ToFormatedDate(_record.fromDate)}&nbsp;→&nbsp;{ToFormatedDate(_record.toDate)}</Flex>
        </Flex>
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semesterCount',
      render: (_value) => <div>{_value}</div>,
    },
    {
      title: 'Kỳ thi',
      dataIndex: 'examCount',
      render: (_value) => <div>{_value}</div>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      render: (_value) => <SchoolYearStatusTag status={_value} />,
    },
    {
      fixed: 'right',
      width: 120,
      dataIndex: 'status',
      hidden: !authority?.can_touch_schoolyear,
      render: (_value, _record) => <Flex gap={8}>
        {_value == SchoolYearStatusEnum.MoiTao.enum ?
          <Button loading={loading}
            icon={<CheckOutlined />}
            onClick={() => handleStart(_record.id)}
          >Bắt đầu năm học</Button> : null}
      </Flex>,
    },
  ];
  return <Fragment>
    <Table<SchoolYearRow>
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
      dataSource={data ? data : undefined}
    />

  </Fragment>
}