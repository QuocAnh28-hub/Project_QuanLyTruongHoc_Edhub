import { Button, Divider, Flex, Row, Space, Spin, Table, Timeline } from "antd";
import { ColumnsType } from "antd/lib/table";
import dayjs from "dayjs";
import { Fragment } from "react/jsx-runtime";
import { useAppContext } from "../../../../../../contexts/AppContext";
import { useStaffDetailMajorContext } from "../../../../../../contexts/school-only/staffs/detail/StaffDetailMajorContext";
import { useStaffDetailContext } from "../../../../../../contexts/school-only/staffs/StaffDetailContext";
import { ToFormatedDate } from "../../../../../../utils/locale-helpers";
import GText from "../../../../../atoms/g-text";
import GTitle from "../../../../../atoms/g-title";
import { DeleteOutlined, FormOutlined } from "../../../../../atoms/svg/outlined-icons";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

export default function StaffDetailMajorView() {
  const { authority } = useAppContext()
  const { data: staff, switchUpdateMode } = useStaffDetailContext()
  const { data, refreshing } = useStaffDetailMajorContext()
  if (!staff || !data) return null

  const columns: ColumnsType<any> = [
    {
      title: 'Thời gian',
      dataIndex: 'fromDate',
      render: (_value, _record) => <div>{ToFormatedDate(_value)} - {_record.toDate ? ToFormatedDate(_record.toDate) : 'Nay'}</div>,
    },
    {
      title: 'Nơi công tác',
      dataIndex: 'orgName',
      render: (_value) => <div>{_value}</div>,
    },
    {
      title: 'Chức danh / Kiêm nhiệm',
      dataIndex: 'positions',
      render: (_value) => <div>{_value}</div>,
    },
    {
      fixed: 'right',
      width: 88,
      dataIndex: 'id',
      hidden: !authority?.can_touch_staff,
      render: (_value, _record) => <Flex gap={8}>
        <Button size='small' icon={<FormOutlined />} />
        <Button size='small' icon={<DeleteOutlined />} />
      </Flex>,
    },
  ];

  if (refreshing) return <Flex justify='center' align='center' style={{ height: 200 }}>
    <Spin />
  </Flex>;

  return <Fragment>
    {authority?.can_touch_staff &&
      <Row justify='end'>
        <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
      </Row>
    }
    <Flex vertical gap={32}>
      {/* Phân công giảng dạy */}
      <TitleSegmentRow title='Phân công giảng dạy'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Loại cán bộ'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Vị trí việc làm'>
            <GText>{data.position?.title}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Bộ môn giảng dạy'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Kiêm nhiệm'>
            <GText>{data.schoolStaffPositions?.map(item => item.title).join(', ')}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      <Divider />

      {/* Trình độ & Năng lực */}
      <TitleSegmentRow title='Trình độ & Năng lực'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Trình độ học vấn cao nhất'>
            <GText>{data.qualificationCompetence?.highestAcademicQualification}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Trình độ chuyên môn'>
            <GText>{data.qualificationCompetence?.professionalQualification}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Chuyên ngành đào tạo'>
            <GText>{data.qualificationCompetence?.fieldOfStudy}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Trình độ Ngoại ngữ'>
            <GText>{data.qualificationCompetence?.foreignLanguageSkill}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Trình độ Tin học'>
            <GText>{data.qualificationCompetence?.itSkill}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Trình độ Lý luận chính trị'>
            <GText>{data.qualificationCompetence?.politicalTheoryQualification}</GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Trình độ Quản lý giáo dục'>
            <GText>{data.qualificationCompetence?.eduManagementQualification}</GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>
      <Divider />
      {/* Quá trình đào tạo, bồi dưỡng */}
      <TitleSegmentRow title='Quá trình đào tạo, bồi dưỡng'>
        <Flex vertical>
          {!data.trainingDevelopmentHistories?.length ? <GText></GText> : null}
          <Timeline mode="alternate"
            items={data.trainingDevelopmentHistories.map((h: any) => {
              return {
                label: <GText strong>{dayjs(h.date).format('YYYY')}</GText>,
                children: h.description
              }
            })}
          />
        </Flex>
      </TitleSegmentRow>
      <Divider />
      {/* Lịch sử Công tác giảng dạy */}
      <Flex vertical gap={12}>
        <GTitle level={5}>Lịch sử Công tác giảng dạy</GTitle>
        <Table<any>
          className="stretch-table"
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={data.personalWorkHistories ? data.personalWorkHistories : undefined}
        />
      </Flex>
    </Flex>
  </Fragment>
}