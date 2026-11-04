import { Flex, Table, TableProps } from "antd";
import { useMemo } from "react";
import { useSchoolPositionDetailContext } from "../../../../../contexts/school-only/school-departments/SchoolPositionDetailContext";
import { ToAuthoritiesShow } from "../../../../../utils/utils";
import GText from "../../../../atoms/g-text";
import { CheckOutlined, DoubleCheckOutlined } from "../../../../atoms/svg/outlined-icons";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
const columns: ColumnsType = [
  {
    dataIndex: 'group',
    rowScope: 'row',
    onCell: (_record: any) => {
      return { rowSpan: _record.span }; // Merge with the next row
    },
  },
  {
    dataIndex: 'title'
  },
  {
    dataIndex: 'authority',
    render: (_value: any) => _value == 'all' ?
      <Flex gap={8}><DoubleCheckOutlined size={16} /><GText>Toàn quyền</GText></Flex> : _value == 'read' ?
        <Flex gap={8}><CheckOutlined size={16} /><GText>Quyền xem</GText></Flex> :
        <GText type="secondary" italic>Không có quyền</GText>
  },
  // ... other columns
];
export default function SchoolPositionAuthorities() {
  const { authorities, authorities_fetching } = useSchoolPositionDetailContext()
  const _authorities = useMemo(() => {
    if (!authorities) return null
    return ToAuthoritiesShow(authorities)
  }, [authorities])
  return <Flex vertical>
    <Table<any> bordered
      rowKey={(record) => record.code}
      loading={authorities_fetching}
      dataSource={_authorities || undefined}
      columns={columns} showHeader={false}
      pagination={false} />
  </Flex>
}