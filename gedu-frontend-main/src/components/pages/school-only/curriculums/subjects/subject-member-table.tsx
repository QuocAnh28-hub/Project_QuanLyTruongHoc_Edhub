import { Button, Collapse, CollapseProps, Flex, Table, TableProps } from "antd";
import { Fragment, useMemo, useState } from "react";
import { useAppContext } from "../../../../../contexts/AppContext";
import { useSubjectDetailContext } from "../../../../../contexts/school-only/curriculums/SubjectDetailContext";
import { subjectType } from "../../../../../models/curriculum-model";
import { studentGradeStatus } from "../../../../../models/student-model";
import { SubjectCurriculumGradeLevel, SubjectCurriculumRow } from "../../../../../models/subject-model";
import { ToAssessmentBased, ToFormatedNumber } from "../../../../../utils/locale-helpers";
import GText from "../../../../atoms/g-text";
import { DeleteOutlined, FormOutlined } from "../../../../atoms/svg/outlined-icons";
import EmptyState from "../../../../molecules/empty-state";
import UpdateCurriculumSubjectModal from "./update-curriculum-subject-modal";

type ColumnsType<T extends object = object> = TableProps<T>['columns'];
export default function SubjectMembersTable() {
  const { curriculums, page } = useSubjectDetailContext()

  const { items, default_key } = useMemo(() => {
    const _items = [] as CollapseProps['items'];
    const _default_key = [] as any
    if (curriculums?.length) {
      curriculums?.map((curr: SubjectCurriculumRow) => {
        _default_key.push(curr.id)
        _items?.push({
          key: curr.id,
          label: curr.code + ' - ' + curr.name,
          children: <CurriculumItem curriculum={curr} />,
        })
      })
    }
    return { items: _items, default_key: _default_key }
  }, [curriculums])

  if (curriculums && !curriculums.length && page === 1) return <EmptyState />
  return <Collapse defaultActiveKey={default_key} items={items} />
}

function CurriculumItem({ curriculum }: { curriculum: SubjectCurriculumRow }) {
  const { authority } = useAppContext()
  const [selected, setSelected] = useState<any>(null)
  const [open_update, setOpenUpdate] = useState<boolean>(false)

  function handleClose() {
    setSelected(null)
    setOpenUpdate(false)
  }
  function handleOk() {
    handleClose()
  }

  const columns: ColumnsType<SubjectCurriculumGradeLevel> = [
    {
      fixed: 'left',
      width: 183,
      title: 'Khối lớp',
      dataIndex: 'name',
      render: (_value, _record) => <GText>{studentGradeStatus.find((g) => g.value == _value)?.text}</GText>,
    },
    {
      title: 'Loại môn học',
      dataIndex: 'subjectType',
      render: (_value) => <GText>{subjectType.find(t => t.value == _value)?.text}</GText>
    },
    {
      title: 'Hình thức đánh giá',
      render: (_, _record) => <GText>{ToAssessmentBased(_record.commentsBased, _record.scoringBased)}</GText>
    },
    {
      title: 'Số tiết/tuần',
      dataIndex: 'lessonsPerWeek',
      render: (_value) => <GText>{ToFormatedNumber(_value)}</GText>
    },
    {
      fixed: 'right',
      width: 88,
      dataIndex: 'id',
      hidden: !authority?.can_touch_curriculum,
      render: (_value, _record) => <Flex gap={8}>
        <Button size='small' icon={<FormOutlined />}
          onClick={() => {
            setSelected(_record)
            setOpenUpdate(true)
          }}
        />
        <Button size='small' icon={<DeleteOutlined />} />
      </Flex>,
    },
  ];
  return <Fragment>
    <Table<SubjectCurriculumGradeLevel>
      style={{ margin: 0 }}
      rowKey={(record) => record.id + ''}
      scroll={{ x: 'max-content' }}
      columns={columns}
      pagination={false}
      dataSource={curriculum.assignedGradeLevels ? curriculum.assignedGradeLevels : undefined}
    />
    {open_update && selected ? <UpdateCurriculumSubjectModal
      close={handleClose} ok={handleOk}
      record={selected}
      curriculum={curriculum}
    /> : null}
  </Fragment>
} 