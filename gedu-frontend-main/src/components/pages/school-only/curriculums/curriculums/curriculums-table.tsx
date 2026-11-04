import { Switch, Table, TableProps } from "antd";
import { Link, useSearchParams } from "react-router-dom";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useCurriculumsContext } from "../../../../../contexts/school-only/curriculums/CurriculumsContext";
import { CurriculumRow } from "../../../../../models/curriculum-model";
import { ToGradeLevelList } from "../../../../../utils/locale-helpers";
import { nav_links } from "../../../../../utils/routes";
import GText from "../../../../atoms/g-text";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function CurriculumsTable() {
  const { authority } = useAppContext()
  const { data, page, size, total, fetching } = useCurriculumsContext()
  const [searchParams, setSearchParams] = useSearchParams();

  function onTableChange(_pagination: any, _filters: any) {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', _pagination.current);
    newParams.set('size', _pagination.pageSize);

    setSearchParams(newParams);
  }
  const columns: ColumnsType<CurriculumRow> = [
    {
      fixed: 'left',
      minWidth: 135,
      title: 'Mã chương trình',
      dataIndex: 'code',
      render: (_value, _record) =>
        <Link to={nav_links.curriculum_detail.route.replace(':id', _record.id + '')}>
          {_value || _record.id}
        </Link>,
    },
    {
      title: 'Tên chương trình',
      dataIndex: 'name',
    },
    {
      title: 'Khối lớp áp dụng',
      dataIndex: 'gradeLevels',
      render: (_value) => ToGradeLevelList(_value)
    },
    {
      title: 'Ngôn ngữ giảng dạy chính',
      dataIndex: 'instructionLanguageName',
    },
    {
      title: 'Có giảng dạy',
      dataIndex: 'canApply',
      render: (_value) => authority?.can_touch_curriculum ? <Switch value={_value} /> : <GText>{_value ? 'Có' : 'Không'}</GText>
    },
  ];
  return <Fragment>
    <Table<CurriculumRow>
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
  </Fragment>
}