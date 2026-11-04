import { Button, Flex, Switch, Table, TableProps } from "antd";
import { useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useSubjectsContext } from "../../../../../contexts/school-only/curriculums/SubjectsContext";
import { SubjectRow } from "../../../../../models/subject-model";
import { nav_links } from "../../../../../utils/routes";
import GText from "../../../../atoms/g-text";
import { FormOutlined } from "../../../../atoms/svg/outlined-icons";
import UpdateSubjectModal from "./update-subject-modal";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function SubjectsTable() {
  const { authority } = useAppContext()
  const { data, page, size, total, fetching, mutate } = useSubjectsContext()
  const [searchParams, setSearchParams] = useSearchParams();
  const [selected, setSelected] = useState<SubjectRow | null>(null)
  const [open_update, setOpenUpdate] = useState<boolean>(false)

  function handleClose() {
    setSelected(null)
    setOpenUpdate(false)
  }

  function handleOk() {
    handleClose()
    mutate()
  }

  function onTableChange(_pagination: any, _filters: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', _pagination.current);
    newParams.set('size', _pagination.pageSize);

    setSearchParams(newParams);
  }
  const columns: ColumnsType<SubjectRow> = [
    {
      fixed: 'left',
      minWidth: 115,
      title: 'Mã môn học',
      dataIndex: 'code',
      render: (_value, _record) =>
        <Link to={nav_links.subject_detail.route.replace(':id', _record.id + '')}>
          {_value || _record.id}
        </Link>,
    },
    {
      title: 'Tên môn học',
      dataIndex: 'name',
    },
    {
      title: 'Tổ chuyên môn phụ trách',
      dataIndex: 'departments',
      render: (_value) => <GText>{_value?.map((d: any) => d.name).join(', ')}</GText>
    },
    {
      title: 'Có giảng dạy',
      dataIndex: 'canApply',
      render: (_value, _record) => authority?.can_touch_curriculum ? <SwitchActive record={_record} /> : <GText>{_value ? 'Có' : 'Không'}</GText>
    },
    {
      fixed: 'right',
      width: 64,
      dataIndex: 'id',
      hidden: !authority?.can_touch_curriculum,
      render: (_value, _record) => <Flex gap={8}>
        <Button
          icon={<FormOutlined />}
          onClick={() => {
            setSelected(_record)
            setOpenUpdate(true)
          }}
        />
      </Flex>
    },
  ];
  return <Fragment>
    <Table<SubjectRow>
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
      onChange={onTableChange}
    />
    {open_update && selected && (
      <UpdateSubjectModal
        record={selected}
        close={handleClose}
        ok={handleOk}
      />
    )}
  </Fragment>
}
interface SProps {
  record: SubjectRow
}
function SwitchActive({ record }: SProps) {
  const [loading, setLoading] = useState<boolean>(false)
  const { activeSubject, mutate } = useSubjectsContext()
  async function handleChange(e: any) {
    setLoading(true)
    const res = await activeSubject(record.id, e) as any
    if (res) {
      mutate()
    }
    setLoading(false)
  }
  return <Switch loading={loading}
    value={record.canApply || false}
    onChange={handleChange}
  />
}