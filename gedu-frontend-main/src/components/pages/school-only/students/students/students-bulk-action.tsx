import { Button, Flex, Modal, Typography } from "antd";
import { useMemo, useState } from "react";
import { useBulkActionContext } from "../../../../../contexts/BulkActionContext";
import { useStudentsContext } from "../../../../../contexts/school-only/students/StudentsContext";
import { StudentRow } from "../../../../../models/student-model";
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers";
import SearchTextBox from "../../../../atoms/search-textbox";
import { CheckOutlined, ClassOutlined, CloseOutlined } from "../../../../atoms/svg/outlined-icons";
import BulkArrangeStudentClass from "./bulk-arrange-students-class";


const { Text } = Typography
export default function StudentsBulkAction() {
  const { mutate } = useStudentsContext()
  const { on_bulk, records, setRecords } = useBulkActionContext()
  const [bulkSelected, setBulkSelected] = useState<StudentRow[]>([])
  const [open_bulk, setOpenBulk] = useState<boolean>(false)

  const unacceptableStudents = useMemo(() => {
    return records?.filter(record => record.classId?.length) ?? []
  }, [records])

  const acceptableStudents = useMemo(() => {
    return records?.filter(record => !record.classId?.length) ?? []
  }, [records])

  function handleBulkTransferClass(_record: StudentRow[]) {
    setBulkSelected(_record)
    setOpenBulk(true)
  }

  function handleCloseBulk() {
    setOpenBulk(false)
    setBulkSelected([])
    setRecords([])
  }

  function handleOkBulk() {
    setOpenBulk(false)
    setBulkSelected([])
    setRecords([])
    mutate()
  }

  const warning = () => {
    Modal.warning({
      title: 'xác nhận xếp lớp',
      content: <Flex vertical >
        <Text>
          Trong {(records?.length ?? 0)} học sinh bạn đã chọn, có {acceptableStudents.length} em hợp lệ để xếp vào lớp. Tuy nhiên,
          <Text strong>
            {unacceptableStudents.length} em sau đây đã có lớp và sẽ được bỏ qua:
          </Text>
        </Text>
        <ul style={{ margin: 0, marginBottom: 12, paddingLeft: 16 }}>
          {unacceptableStudents.map((item) => (
            <li key={item.id}>
              {`${ToFullNameByLocale(item.firstName, item.lastName)} (MSH: ${item.code})`}
            </li>
          ))}
        </ul>
        {acceptableStudents.length > 0 && <Text>
          Bạn có muốn tiếp tục xếp lớp cho {acceptableStudents.length} em hợp lệ không?
        </Text>}
      </Flex>,
      okCancel: true,
      cancelButtonProps: {
        icon: <CloseOutlined />,
      },
      okButtonProps: {
        icon: <CheckOutlined />,
        disabled: acceptableStudents.length === 0,
      },
      cancelText: 'Huỷ bỏ',
      okText: `Tiếp tục với ${acceptableStudents.length} em hợp lệ`,
      onOk() {
        handleBulkTransferClass(acceptableStudents ?? [])
      },
    });

  };

  return <Flex vertical>
    {!on_bulk &&
      <Flex justify="flex-end">
        <SearchTextBox placeholder='Tìm theo tên/mã học sinh, mã định danh/CCCD' />
      </Flex>
    }
    {on_bulk &&
      <Flex style={{ minHeight: 32 }} align="center">
        <Button
          icon={<ClassOutlined />}
          onClick={warning}
        >Xếp lớp</Button>
      </Flex>
    }
    {open_bulk && bulkSelected ? <BulkArrangeStudentClass open={open_bulk} close={handleCloseBulk} ok={handleOkBulk} record={bulkSelected} /> : null}

  </Flex>
}