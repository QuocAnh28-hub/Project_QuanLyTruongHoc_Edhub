import { Avatar, Card, Flex, Space } from "antd"
import { Fragment } from "react/jsx-runtime"
import { useStudentDetailContext } from "../../../../../contexts/school-only/students/StudentDetailContext"
import { ToFullNameByLocale } from "../../../../../utils/locale-helpers"
import CopyButton from "../../../../atoms/copy-button"
import GText from "../../../../atoms/g-text"
import GTitle from "../../../../atoms/g-title"
import StudentStatus from "../../../../atoms/student-status"
import { UserOutlined } from "../../../../atoms/svg/outlined-icons"

export default function StudentCard() {
  const { data } = useStudentDetailContext()
  if (!data) return
  return <Flex vertical>
    <Card style={{ overflow: 'hidden', backgroundColor: 'var(--background-color)' }}>
      <Flex vertical gap={8}>
        <Avatar size={96} icon={<UserOutlined />}
          style={{ minWidth: 96, backgroundColor: '#DDD', border: '3px solid white' }} />
        <GTitle level={4} style={{ marginTop: 8 }}>{ToFullNameByLocale(data.firstName, data.lastName)}</GTitle>
        <GText>Mã học sinh: {data.code}</GText>
        <Flex><CopyButton text={data.code} /></Flex>
      </Flex>
    </Card>
    <GText style={{ marginTop: 24 }} strong>Thông tin Học vụ</GText>
    <Space style={{ marginTop: 12 }}><StudentStatus status={1} /></Space>
    {data.class?.name ? <GText style={{ marginTop: 12 }}>Lớp {data.class.name}</GText> : null}
    {data.mainStudentContact ?
      <Fragment>
        <GText style={{ marginTop: 24 }} strong>Người liên hệ chính</GText>
        <Flex style={{ marginTop: 12 }}>
          <GText>{data.mainStudentContact.relationshipTitle}:&nbsp;</GText>
          <GText empty_message='Không có số điện thoại'>{data.mainStudentContact.phone}</GText>
        </Flex>
      </Fragment> : null
    }
  </Flex>
}