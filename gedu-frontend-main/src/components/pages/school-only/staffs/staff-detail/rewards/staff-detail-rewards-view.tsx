import { Flex, Space, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Fragment } from "react/jsx-runtime";
import GText from "../../../../../atoms/g-text";
import GTitle from "../../../../../atoms/g-title";
import TitleSegmentRow from "../../../../../atoms/title-segment-row";

export default function StaffDetailRewardsView() {

  const columns: ColumnsType<any> = [
    {
      title: 'Cấp quyết định',
      render: (_value) => <div>{_value}</div>,
    },
    {
      title: 'Hình thức khen thưởng',
      render: (_value) => <div>{_value}</div>,
    },
    {
      title: 'Năm học',
      render: (_value) => <div>{_value}</div>,
    },
    {
      title: 'Số quyết định',
      render: (_value) => <div>{_value}</div>,
    },
    {
      title: 'Ngày quyết định',
      render: (_value) => <div>{_value}</div>,
    },
    // {
    //   fixed: 'right',
    //   width: 88,
    //   dataIndex: 'id',
    //   render: (_value, _record) => <Flex gap={8}>
    //     <Button size='small' icon={<FormOutlined />} />
    //     <Button size='small' icon={<DeleteOutlined />} />
    //   </Flex>,
    // },
  ];
  return <Fragment>
    {/* <Row justify='end'>
        <Button icon={<FormOutlined />} onClick={() => switchUpdateMode(true)}>Cập nhật</Button>
      </Row> */}
    <Flex vertical gap={32}>
      <GTitle level={5}>Đánh giá, xếp loại</GTitle>

      {/* Đánh giá, phân loại viên chức cuối năm học */}
      <TitleSegmentRow title='Đánh giá, phân loại viên chức cuối năm học'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Năm học'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Kết quả xếp loại'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Căn cứ'>
            <GText></GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Đánh giá theo Chuẩn nghề nghiệp giáo viên */}
      <TitleSegmentRow title='Đánh giá theo Chuẩn nghề nghiệp giáo viên'>
        <Space direction="vertical" size={16}>
          <TitleSegmentRow type="secondary" title='Năm học'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Kết quả xếp loại'>
            <GText></GText>
          </TitleSegmentRow>
          <TitleSegmentRow type="secondary" title='Căn cứ'>
            <GText></GText>
          </TitleSegmentRow>
        </Space>
      </TitleSegmentRow>

      {/* Thông tin Khen thưởng */}
      <Flex vertical gap={12}>
        <GTitle level={5}>Thông tin Khen thưởng</GTitle>
        <Table<any>
          className="stretch-table"
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content' }}
          columns={columns}
          dataSource={undefined}
        />
      </Flex>

      {/* Thông tin Kỷ luật */}
      <Flex vertical gap={12}>
        <GTitle level={5}>Thông tin Kỷ luật</GTitle>
        <GText />
      </Flex>
    </Flex>
  </Fragment>
}