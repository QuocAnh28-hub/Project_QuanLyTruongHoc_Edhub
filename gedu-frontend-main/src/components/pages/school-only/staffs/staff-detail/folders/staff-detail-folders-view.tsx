import { Button, Flex, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useStaffDetailFoldersContext } from "../../../../../../contexts/school-only/staffs/detail/StaffDetailFoldersContext";
import GText from "../../../../../atoms/g-text";
import GTitle from "../../../../../atoms/g-title";
import { DeleteOutlined, FormOutlined } from "../../../../../atoms/svg/outlined-icons";

export default function StaffDetailFoldersView() {
  const { data } = useStaffDetailFoldersContext()
  if (!data) return null
  const columns: ColumnsType<any> = [
    {
      title: 'Tên văn bản',
      render: (_value, _record) => <GText>{_value}</GText>,
    }, {
      title: 'Ngày tải lên',
      render: (_value, _record) => <GText>{_value}</GText>,
    }, {
      title: 'Đính kèm',
      render: (_value, _record) => <GText>{_value}</GText>,
    },
    {
      fixed: 'right',
      width: 88,
      render: (_value, _record) => <Flex gap={8}>
        <Button size='small' icon={<FormOutlined />} />
        <Button size='small' icon={<DeleteOutlined />} />
      </Flex>,
    },
  ];
  return <Flex vertical gap={32}>
    {/* Giấy tờ tuỳ thân */}
    <Flex vertical gap={12}>
      <GTitle level={5}>Giấy tờ tuỳ thân</GTitle>
      <Table<any>
        className="stretch-table"
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={undefined}
      />
    </Flex>

    {/* Bằng cấp & Chứng chỉ */}
    <Flex vertical gap={12}>
      <GTitle level={5}>Bằng cấp & Chứng chỉ</GTitle>
      <Table<any>
        className="stretch-table"
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={undefined}
      />
    </Flex>

    {/* Hợp đồng & Quyết định Nhân sự */}
    <Flex vertical gap={12}>
      <GTitle level={5}>Hợp đồng & Quyết định Nhân sự</GTitle>
      <Table<any>
        className="stretch-table"
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={undefined}
      />
    </Flex>

    {/* Hồ sơ khác */}
    <Flex vertical gap={12}>
      <GTitle level={5}>Hồ sơ khác</GTitle>
      <Table<any>
        className="stretch-table"
        rowKey={(record) => record.id}
        scroll={{ x: 'max-content' }}
        columns={columns}
        dataSource={undefined}
      />
    </Flex>
  </Flex>
}