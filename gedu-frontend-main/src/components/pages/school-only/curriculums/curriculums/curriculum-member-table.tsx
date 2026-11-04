import { Button, Flex, Table, TableProps } from "antd";
import { Fragment } from "react";
import { Link } from "react-router-dom";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useCurriculumDetailContext } from "../../../../../contexts/school-only/curriculums/CurriculumDetailContext";
import { subjectType } from "../../../../../models/curriculum-model";
import { ToGradeLevelList } from "../../../../../utils/locale-helpers";
import { nav_links } from "../../../../../utils/routes";
import GText from "../../../../atoms/g-text";
import { FormOutlined } from "../../../../atoms/svg/outlined-icons";
import EmptyState from "../../../../molecules/empty-state";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function CurriculumMembersTable() {
  const { authority } = useAppContext()
  const { subjects, page } = useCurriculumDetailContext()

  if (subjects && !subjects.length && page === 1) return <EmptyState />
  const columns: ColumnsType<any> = [
    {
      fixed: 'left',
      width: 183,
      title: 'Mã môn học',
      dataIndex: 'code',
      render: (_value, _record) =>
        <Link to={nav_links.subject_detail.route.replace(':id', _record.id + '')}>
          {_value}
        </Link>,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
      render: (_value, _record) => <GText>{_value}</GText>
    },
    {
      title: 'Loại môn học',
      dataIndex: 'type',
      render: (_value) => <GText>{subjectType.find(t => t.value == _value)?.text}</GText>
    },
    {
      title: 'Các Khối lớp áp dụng',
      dataIndex: 'gradeLevels',
      render: (_value) => ToGradeLevelList(_value)
    },
    {
      fixed: 'right',
      width: 48,
      dataIndex: 'id',
      hidden: !authority?.can_touch_curriculum,
      render: (_value, _record) => <Flex gap={8}>
        <Button size='small'
          icon={<FormOutlined />}
        />
      </Flex>,
    },
  ];
  return <Fragment>
    <Table<any>
      style={{ margin: 0 }}
      rowKey={(record) => record.id + ''}
      scroll={{ x: 'max-content' }}
      columns={columns}
      pagination={false}
      dataSource={subjects ? subjects : undefined}
    />
  </Fragment>
}
