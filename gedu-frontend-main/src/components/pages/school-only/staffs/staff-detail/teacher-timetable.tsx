import { Table } from "antd";

export default function TeacherTimetable() {
  const dataSource = [
    {
      key: 1,
      c1: 1,
      c2: '',
      c3: 'Vật Lí - 10A',
      c4: 'Toán - 10A',
      c5: 'Vật Lí - 11D',
      c6: '',
      c7: 'Vật Lí - 10A',
    }, {
      key: 2,
      c1: 2,
      c2: 'Toán - 10A',
      c3: 'Vật Lí - 10B',
      c4: 'Toán - 10B',
      c5: 'Vật Lí - 11E',
      c6: '',
      c7: 'Vật Lí - 10B',
    }, {
      key: 3,
      c1: 3,
      c2: 'Toán - 10B',
      c3: '',
      c4: '',
      c5: 'Toán - 11E',
      c6: '',
      c7: '',
    }, {
      key: 4,
      c1: 4,
      c2: 'Vật Lí - 11D',
      c3: '',
      c4: '',
      c5: '',
      c6: 'Vật Lí - 10B',
      c7: '',
    }, {
      key: 5,
      c1: 5,
      c2: '',
      c3: '',
      c4: '',
      c5: '',
      c6: 'Toán - 10B',
      c7: '',
    },
    {},
    {
      key: 7,
      c1: 1,
      c2: 'Toán - 10C',
      c3: 'Toán - 11D',
      c4: 'Toán - 10C',
      c5: 'Toán - 10D',
      c6: 'Vật Lí - 11D',
      c7: '',
    }, {
      key: 8,
      c1: 2,
      c2: 'Toán - 10D',
      c3: 'Toán - 11E',
      c4: '',
      c5: 'Vật Lí - 10A',
      c6: 'Toán - 10D',
      c7: '',
    }, {
      key: 9,
      c1: 3,
      c2: 'Vật Lí - 11E',
      c3: '',
      c4: '',
      c5: '',
      c6: '',
      c7: '',
    }, {
      key: 10,
      c1: 4,
      c2: '',
      c3: '',
      c4: '',
      c5: '',
      c6: '',
      c7: '',
    }, {
      key: 11,
      c1: 5,
      c2: '',
      c3: '',
      c4: '',
      c5: '',
      c6: '',
      c7: '',
    }

  ];

  const columns = [
    {
      title: 'Tiết',
      dataIndex: 'c1'
    },
    {
      title: 'Thứ 2',
      dataIndex: 'c2'
    },
    {
      title: 'Thứ 3',
      dataIndex: 'c3'
    },
    {
      title: 'Thứ 4',
      dataIndex: 'c4'
    },
    {
      title: 'Thứ 5',
      dataIndex: 'c5'
    },
    {
      title: 'Thứ 6',
      dataIndex: 'c6'
    },
    {
      title: 'Thứ 7',
      dataIndex: 'c7'
    },
  ];

  return <Table bordered dataSource={dataSource} columns={columns} />;
}