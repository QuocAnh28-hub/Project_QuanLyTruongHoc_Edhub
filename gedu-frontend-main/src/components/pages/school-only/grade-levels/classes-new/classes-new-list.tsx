import { Button, Card, Flex, Form, Table } from "antd";
import { ColumnsType } from "antd/lib/table";
import { useEffect, useState } from "react";
import { useClassesNewContext } from "../../../../../contexts/school-only/classes/ClassesNewContext";
import { ClassesRequest, ClassRow } from "../../../../../models/class-model";
import GText from "../../../../atoms/g-text";
import { CheckOutlined } from "../../../../atoms/svg/outlined-icons";
import { useRouterBlockerContext } from "../../../../../contexts/RouterBlockerContext";
import { nav_links } from "../../../../../utils/routes";

export default function ClassesNewList() {
  const { callForceNavigate } = useRouterBlockerContext()
  const { grade, input_data, form_result, createClasses } = useClassesNewContext()
  const [list, setList] = useState<any[]>([])
  useEffect(() => {
    if (input_data) {
      const _list = generateClasses(input_data)
      setList(_list)
    } else setList([])
  }, [input_data])
  async function handleFinish() {
    const request = new ClassesRequest()
    request.dailyScheduleType = input_data.dailyScheduleType || 1
    request.gradeLevel = grade?.enum
    request.isDayBoarding = input_data.isDayBoarding || false
    request.schoolYearId = input_data.schoolYearId
    request.classes = list

    const res = await createClasses(request)
    if (!res) return
    callForceNavigate(nav_links.grade_level_detail.route.replace(':id', grade?.enum + ''))
  }
  if (!input_data)
    return <Card style={{ marginTop: 16 }}>
      <Flex vertical gap={8}>
        <GText strong>Xem trước danh sách các lớp sẽ được tạo</GText>
        <GText italic>Vui lòng cung cấp đầy đủ các thông tin bên trên để có thể xem trước và tùy chỉnh Danh sách Lớp học.</GText>
      </Flex>
    </Card>
  const columns: ColumnsType<ClassRow> = [
    {
      fixed: 'left',
      width: 75,
      title: 'STT',
      render: (_v, _r, _idx) => _idx + 1
    },
    {
      fixed: 'left',
      minWidth: 110,
      title: 'Tên lớp học',
      dataIndex: 'name',
      render: (_value) => _value
    },
    {
      title: 'Chương trình học',
      dataIndex: 'curriculumName',
      render: (_value) => _value,
    },
    {
      title: 'Sĩ số tối đa',
      dataIndex: 'maxClassSize',
      render: (_value) => _value,
    },
    {
      title: 'Ngoại ngữ 1',
      dataIndex: 'firstForeignLanguageName',
      render: (_value) => _value,
    },
  ];
  return <Form layout="vertical" form={form_result}>
    <Card style={{ marginTop: 16 }}>
      <Flex vertical gap={16} flex={1}>
        <Flex vertical gap={8}>
          <GText strong>Xem trước danh sách các lớp {grade?.title}</GText>
          <GText italic>Các thiết lập chi tiết khác có thể được tuỳ chỉnh sau khi tạo xong.</GText>
        </Flex>
        <Table<ClassRow>
          className="stretch-table"
          rowKey={(record) => record.id}
          scroll={{ x: 'max-content' }}
          pagination={false}
          columns={columns}
          dataSource={list ? list : undefined}
        />
        <Flex justify="end">
          <Button type="primary"
            icon={<CheckOutlined />}
            disabled={!list || !list.length}
            onClick={handleFinish}
          >Lưu & Hoàn tất</Button>
        </Flex>
      </Flex>
    </Card>
  </Form>
}
function generateClasses(input_data: any) {
  if (input_data.class_count) {
    switch (input_data.rule) {
      case 'by_number':
        return genByNumber(input_data)
      case 'by_name':
        return genByList(input_data)
      case 'by_letter':
      default:
        return genByLetter(input_data)
    }
  }
  return []
}
function increaseChar(char: string) {
  let idx = char.length - 1
  const charCode = char.charCodeAt(idx);
  const nextChar = String.fromCharCode(((charCode - 65 + 1) % 26) + 65)
  char = char.substring(0, idx) + nextChar + char.substring(idx + 1);
  if (nextChar == 'A')
    if (idx == 0)
      char = 'A' + char
  return char
}
function genByLetter(input_data: any) {
  const _lst = []
  if (input_data.rule_value == 'alphabet_inc') {
    let char = 'A';
    let divider = ''
    if (isNaN(input_data.grade.short)) divider = ' '
    for (let i = 0; i < input_data.class_count; i++) {
      const _name = input_data.grade.short + divider + char
      _lst.push({
        code: input_data.school_code + '-' + _name,
        name: _name,
        curriculumId: input_data.curriculumId,
        curriculumName: input_data.curriculumName,
        maxClassSize: input_data.max_class_size,
        firstForeignLanguageId: input_data.firstForeignLanguageId,
        firstForeignLanguageName: input_data.firstForeignLanguageName,
        secondForeignLanguageId: input_data.secondForeignLanguageId,
        secondForeignLanguageName: input_data.secondForeignLanguageName,
      })
      char = increaseChar(char)
    }
  } else {
    for (let i = 0; i < input_data.class_count; i++) {
      const _name = input_data.grade.short + input_data.rule_value + (i + 1)
      _lst.push({
        code: input_data.school_code + '-' + _name,
        name: _name,
        curriculumId: input_data.curriculumId,
        curriculumName: input_data.curriculumName,
        maxClassSize: input_data.max_class_size,
        firstForeignLanguageId: input_data.firstForeignLanguageId,
        firstForeignLanguageName: input_data.firstForeignLanguageName,
        secondForeignLanguageId: input_data.secondForeignLanguageId,
        secondForeignLanguageName: input_data.secondForeignLanguageName,
      })
    }
  }

  return _lst
}

function genByNumber(input_data: any) {
  const _lst = []
  for (let i = 0; i < input_data.class_count; i++) {
    const _name = input_data.grade.short + input_data.rule_value + (i + 1)
    _lst.push({
      code: input_data.school_code + '-' + _name,
      name: _name,
      curriculumId: input_data.curriculumId,
      curriculumName: input_data.curriculumName,
      maxClassSize: input_data.max_class_size,
      firstForeignLanguageId: input_data.firstForeignLanguageId,
      firstForeignLanguageName: input_data.firstForeignLanguageName,
      secondForeignLanguageId: input_data.secondForeignLanguageId,
      secondForeignLanguageName: input_data.secondForeignLanguageName,
    })
  }
  return _lst
}

function genByList(input_data: any) {
  const _lst = []
  const _arr = input_data.rule_value.split(",");
  for (let i = 0; i < input_data.class_count; i++) {
    const _name = _arr?.[i] ? _arr[i] : ''
    _lst.push({
      code: input_data.school_code + '-' + _name,
      name: _name,
      curriculumId: input_data.curriculumId,
      curriculumName: input_data.curriculumName,
      maxClassSize: input_data.max_class_size,
      firstForeignLanguageId: input_data.firstForeignLanguageId,
      firstForeignLanguageName: input_data.firstForeignLanguageName,
      secondForeignLanguageId: input_data.secondForeignLanguageId,
      secondForeignLanguageName: input_data.secondForeignLanguageName,
    })
  }
  return _lst
}